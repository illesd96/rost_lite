import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { modernShopOrders, orderPaymentGroups, orderDeliverySchedule } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AdminLayout } from '@/components/admin/admin-layout';

export default async function ModernOrdersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  // Fetch all modern shop orders with related data
  const orders = await db.query.modernShopOrders.findMany({
    with: {
      user: {
        columns: {
          email: true
        }
      },
      paymentGroups: true,
      deliverySchedule: true
    },
    orderBy: (fields, { desc }) => [desc(fields.createdAt)]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Modern Shop Orders</h1>
        </div>
        <p className="text-gray-600">
          Manage orders from the modern webshop with payment groups and delivery schedules
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No modern shop orders yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Orders will appear here when customers complete the modern shop flow.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const billingData = order.billingData as any;
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status || 'pending')}`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {order.user?.email} • {order.quantity} bottles
                      </p>
                      <p className="text-sm text-gray-500">
                        {billingData?.type === 'business' ? billingData?.companyName : `${billingData?.firstName} ${billingData?.lastName}`}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(order.createdAt).toLocaleDateString('hu-HU')}
                      </p>
                      {order.confirmedAt && (
                        <p className="text-sm text-green-600">
                          Confirmed: {new Date(order.confirmedAt).toLocaleDateString('hu-HU')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Payment Groups */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Payment Groups ({order.paymentGroups?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.paymentGroups?.map((group) => (
                          <div key={group.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Group {group.groupNumber}</p>
                              <p className="text-sm text-gray-600">{group.description}</p>
                              <p className="text-xs text-gray-500">
                                Due: {new Date(group.dueDate).toLocaleDateString('hu-HU')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(group.amount)}</p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                group.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                group.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {group.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Schedule */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Delivery Schedule ({order.deliverySchedule?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.deliverySchedule?.map((delivery) => (
                          <div key={delivery.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">
                                Package {delivery.packageNumber}/{delivery.totalPackages}
                              </p>
                              <p className="text-sm text-gray-600">
                                {delivery.quantity} bottles
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(delivery.deliveryDate).toLocaleDateString('hu-HU')} 
                                ({delivery.isMonday ? 'Monday' : 'Tuesday'})
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              delivery.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {delivery.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Payment Plan</p>
                        <p className="font-medium capitalize">{order.paymentPlan}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Method</p>
                        <p className="font-medium capitalize">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Applied Coupon</p>
                        <p className="font-medium">{order.appliedCoupon || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
