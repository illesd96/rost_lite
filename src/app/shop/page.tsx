import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { Navbar } from '@/components/ui/navbar';
import { ProductCard } from '@/components/shop/product-card';

export default async function ShopPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch products
  const allProducts = await db.select().from(products);

  return (
    <div className="min-h-screen bg-brand-cream-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Rosti
          </h1>
          <p className="text-gray-600">
            Discover our exclusive collection of premium products
          </p>
        </div>

        {allProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products available at the moment.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please check back later or contact support.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Delivery Info */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            Delivery Information
          </h3>
          <div className="text-sm text-primary-700 space-y-1">
            <p>• Delivery fee: 1,500 HUF per order</p>
            <p>• FREE delivery on orders over 15,000 HUF</p>
            <p>• Delivery only to Hungary</p>
            <p>• Automatic discounts apply for bulk orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
