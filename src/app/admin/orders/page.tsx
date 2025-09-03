import { db } from '@/lib/db';
import { orders, users, orderItems, products } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { OrderManagement } from '@/components/admin/order-management';
import { Download } from 'lucide-react';

export default async function AdminOrdersPage() {
  // Fetch all orders with user information
  const allOrders = await db
    .select({
      id: orders.id,
      createdAt: orders.createdAt,
      status: orders.status,
      subtotalHuf: orders.subtotalHuf,
      deliveryFeeHuf: orders.deliveryFeeHuf,
      totalHuf: orders.totalHuf,
      barionPaymentId: orders.barionPaymentId,
      barionStatus: orders.barionStatus,
      userEmail: users.email,
      userId: users.id,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <a
          href="/api/admin/orders/export"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Orders ({allOrders.length})
          </h2>
        </div>
        
        <OrderManagement orders={allOrders} />
      </div>
    </div>
  );
}
