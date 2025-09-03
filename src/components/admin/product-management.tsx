'use client';

import { useState } from 'react';
import { Product } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { Edit, Trash2, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductEditModal } from './product-edit-modal';

interface ProductManagementProps {
  products: Product[];
}

export function ProductManagement({ products: initialProducts }: ProductManagementProps) {
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleToggleSale = async (productId: string, currentOnSale: boolean) => {
    setIsLoading(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onSale: !currentOnSale }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      setProducts(prev => 
        prev.map(p => p.id === productId ? updatedProduct : p)
      );
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsLoading(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsLoading(null);
    }
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    setEditingProduct(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discounts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatPrice(product.basePriceHuf)}
                  </div>
                  {product.onSale && product.salePriceHuf && (
                    <div className="text-sm text-green-600 font-medium">
                      Sale: {formatPrice(product.salePriceHuf)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.onSale 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.onSale ? 'On Sale' : 'Regular'}
                    </span>
                    <button
                      onClick={() => handleToggleSale(product.id, product.onSale)}
                      disabled={isLoading === product.id}
                      className={`p-1 rounded-full hover:bg-gray-100 ${
                        isLoading === product.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title={product.onSale ? 'Remove from sale' : 'Put on sale'}
                    >
                      {product.onSale ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    {product.discountPercentage}% off {product.discountThreshold}+
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={isLoading === product.id}
                    className={`text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 ${
                      isLoading === product.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleProductUpdate}
        />
      )}
    </>
  );
}
