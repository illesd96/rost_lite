import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Navbar } from '@/components/ui/navbar';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Package, Truck, Receipt } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: {
    orderId?: string;
  };
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const { orderId } = searchParams;

  if (!orderId) {
    redirect('/shop');
  }

  // Fetch order details
  const orderData = await db
    .select({
      order: orders,
      item: orderItems,
      product: products,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orders.id, orderId));

  if (orderData.length === 0) {
    redirect('/shop');
  }

  const order = orderData[0].order;
  const items = orderData.filter(row => row.item && row.product);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Number</h3>
                <p className="text-lg font-semibold text-gray-900">#{order.id.slice(0, 8)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Status</h3>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'PAID' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'PAID' ? 'Paid' : 'Processing'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Amount</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(order.totalHuf)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Date</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {order.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="text-left mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Order Details
            </h2>
            
            <div className="space-y-3">
              {items.map((row, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">{row.product!.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {row.item!.quantity} × {formatPrice(row.item!.unitPriceHuf)}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatPrice(row.item!.unitPriceHuf * row.item!.quantity)}
                  </span>
                </div>
              ))}
              
              {order.deliveryFeeHuf > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium text-gray-900">Delivery Fee</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.deliveryFeeHuf)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.totalHuf)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• You will receive an order confirmation email shortly</li>
              <li>• We will prepare your order for shipping</li>
              <li>• You&apos;ll get a tracking number when your order ships</li>
              <li>• Expected delivery: 2-3 business days</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              View All Orders
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
