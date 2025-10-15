import { db } from '@/lib/db';
import { orders, products, users } from '@/lib/db/schema';
import { eq, count, sum, desc } from 'drizzle-orm';
import { formatPrice } from '@/lib/utils';
import { 
  Package, 
  Users as UsersIcon, 
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch dashboard statistics
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    paidOrders,
    recentOrders,
  ] = await Promise.all([
    db.select({ count: count() }).from(products),
    db.select({ count: count() }).from(orders),
    db.select({ count: count() }).from(users),
    db.select({ 
      count: count(),
      total: sum(orders.totalHuf)
    }).from(orders).where(eq(orders.status, 'PAID')),
    db.select({
      id: orders.id,
      createdAt: orders.createdAt,
      status: orders.status,
      totalHuf: orders.totalHuf,
      userEmail: users.email,
    }).from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(5),
  ]);

  const stats = [
    {
      name: 'Total Products',
      value: totalProducts[0].count,
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Total Orders',
      value: totalOrders[0].count,
      icon: Package,
      color: 'text-green-600 bg-green-100',
    },
    {
      name: 'Total Users',
      value: totalUsers[0].count,
      icon: UsersIcon,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      name: 'Paid Orders',
      value: paidOrders[0].count,
      icon: TrendingUp,
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

  const totalRevenue = paidOrders[0].total || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome to the admin panel
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Total Revenue</h2>
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-3xl font-bold text-green-600">
          {formatPrice(Number(totalRevenue))}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          From {paidOrders[0].count} paid orders
        </p>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userEmail || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'PAID' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(order.totalHuf)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
