'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from 'react-use-cart';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/db';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { parseProductImages } from '@/lib/image-utils';
import { ProductGallery } from '@/components/shop/product-gallery';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { addItem, getItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          throw new Error('Failed to fetch product');
        }
        return;
      }

      const data = await response.json();
      setProduct(data.product);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Product not found'}
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.onSale && product.salePriceHuf 
    ? product.salePriceHuf 
    : product.basePriceHuf;
  
  const discount = calculateDiscount(
    quantity, 
    currentPrice, 
    product.discountThreshold || 5, 
    product.discountPercentage || 10
  );
  
  const totalPrice = (currentPrice * quantity) - discount;
  const cartItem = isClient ? getItem(product.id) : null;
  const productImages = parseProductImages(product.images, product.imageUrl);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
    }, quantity);
    
    // Reset quantity after adding
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {productImages.length > 0 ? (
              <ProductGallery images={productImages} productName={product.name} />
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="/placeholder-product.svg"
                  alt="No image"
                  className="w-32 h-32 text-gray-400"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                SKU: {product.sku}
              </p>
              
              {product.description && (
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(currentPrice)}
                </span>
                {product.onSale && product.salePriceHuf && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.basePriceHuf)}
                  </span>
                )}
              </div>
              
              {product.onSale && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Sale
                </span>
              )}
            </div>

            {/* Quantity Discount Info */}
            {product.discountThreshold && product.discountPercentage && product.discountThreshold > 1 && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Quantity Discount:</span> Buy {product.discountThreshold}+ and save {product.discountPercentage}%!
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>
                <span className="w-16 text-center font-medium text-xl text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  {quantity} × {formatPrice(currentPrice)}
                </span>
                <span className="text-gray-900">
                  {formatPrice(currentPrice * quantity)}
                </span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-600">
                    Quantity Discount ({product.discountPercentage}%)
                  </span>
                  <span className="text-green-600">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}
              
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center px-6 py-4 bg-primary-600 text-white font-medium text-lg rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>

            {/* Cart Status */}
            {isClient && cartItem && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">{cartItem.quantity} in cart</span> - 
                  <Link href="/cart" className="ml-1 underline hover:no-underline">
                    View Cart
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
