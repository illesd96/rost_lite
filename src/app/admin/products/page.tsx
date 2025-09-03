import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { formatPrice } from '@/lib/utils';
import { ProductManagement } from '@/components/admin/product-management';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Products ({allProducts.length})
          </h2>
        </div>
        
        <ProductManagement products={allProducts} />
      </div>
    </div>
  );
}
