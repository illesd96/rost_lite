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
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      basePriceHuf: product.basePriceHuf,
      onSale: product.onSale,
      salePriceHuf: product.salePriceHuf || undefined,
      discountThreshold: product.discountThreshold || 1,
      discountPercentage: product.discountPercentage || 0,
    },
  });

  const watchOnSale = watch('onSale');

  const onSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      // Include image data in the update
      const { images, imageUrl } = serializeProductImages(productImages);
      const updateData = {
        ...data,
        images,
        imageUrl,
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
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU
              </label>
              <input
                {...register('sku')}
                value={product.sku}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sku.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base Price (HUF)
              </label>
              <input
                {...register('basePriceHuf', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              />
              {errors.basePriceHuf && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.basePriceHuf.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <input
                  {...register('onSale')}
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span>On Sale</span>
              </label>

              {watchOnSale && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sale Price (HUF)
                  </label>
                  <input
                    {...register('salePriceHuf', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  />
                  {errors.salePriceHuf && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salePriceHuf.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Threshold (Quantity)
              </label>
              <input
                {...register('discountThreshold', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              />
              {errors.discountThreshold && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.discountThreshold.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Percentage (%)
              </label>
              <input
                {...register('discountPercentage', { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              />
              {errors.discountPercentage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.discountPercentage.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
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
