'use client';

import { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/db';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { parseProductImages } from '@/lib/image-utils';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { ProductGallery } from './product-gallery';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const { addItem, getItem } = useCart();
  
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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Product Gallery - Clickable */}
      <Link href={`/products/${product.id}`} className="block p-4 hover:opacity-95 transition-opacity">
        <ProductGallery images={productImages} productName={product.name} />
      </Link>
      
      <div className="p-6 pt-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors cursor-pointer">
                {product.name}
              </h3>
            </Link>
            {product.onSale && (
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">
                On Sale!
              </span>
            )}
          </div>
          {cartItem && (
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              {cartItem.quantity} in cart
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            {product.onSale && product.salePriceHuf ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.salePriceHuf)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.basePriceHuf)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.basePriceHuf)}
              </span>
            )}
          </div>
          
          {quantity >= (product.discountThreshold || 5) && (
            <p className="text-sm text-green-600">
              Bulk discount: -{formatPrice(discount)} 
              ({product.discountPercentage || 10}% off)
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={decrementQuantity}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-gray-500">
                {quantity} × {formatPrice(currentPrice)}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
