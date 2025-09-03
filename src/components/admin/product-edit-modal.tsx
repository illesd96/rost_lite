'use client';

import { useState } from 'react';
import { Product } from '@/lib/db';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductInput } from '@/lib/validations';
import { parseProductImages, serializeProductImages, type ProductImage } from '@/lib/image-utils';
import { X } from 'lucide-react';
import { ImageManager } from './image-manager';

interface ProductEditModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (product: Product) => void;
}

export function ProductEditModal({ product, onClose, onUpdate }: ProductEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>(
    parseProductImages(product.images, product.imageUrl)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description || '',
      basePriceHuf: product.basePriceHuf,
      onSale: product.onSale,
      salePriceHuf: product.salePriceHuf || undefined,
      discountThreshold: product.discountThreshold || 5,
      discountPercentage: product.discountPercentage || 10,
    },
  });

  const watchOnSale = watch('onSale');

  const onSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      // Include image data in the update
      const updateData = {
        ...data,
        images: serializeProductImages(productImages),
        imageUrl: productImages.find(img => img.isPrimary)?.url || productImages[0]?.url || null,
      };

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      onUpdate(updatedProduct);
    } catch (error) {
      setError('root', { 
        message: error instanceof Error ? error.message : 'Failed to update product' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Management */}
          <div>
            <ImageManager
              images={productImages}
              onChange={setProductImages}
              maxImages={5}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                value={product.sku}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price (HUF)
              </label>
              <input
                {...register('basePriceHuf', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.basePriceHuf && (
                <p className="mt-1 text-sm text-red-600">{errors.basePriceHuf.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                <input
                  {...register('onSale')}
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>On Sale</span>
              </label>
              
              {watchOnSale && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price (HUF)
                  </label>
                  <input
                    {...register('salePriceHuf', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.salePriceHuf && (
                    <p className="mt-1 text-sm text-red-600">{errors.salePriceHuf.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Threshold (Quantity)
              </label>
              <input
                {...register('discountThreshold', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.discountThreshold && (
                <p className="mt-1 text-sm text-red-600">{errors.discountThreshold.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage (%)
              </label>
              <input
                {...register('discountPercentage', { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.discountPercentage && (
                <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
