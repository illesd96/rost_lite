import { db } from '@/lib/db';
import { modernShopOrders, orderDeliverySchedule, users } from '@/lib/db/schema';
import { eq, count, sum, desc, gte } from 'drizzle-orm';
import { formatCurrency } from '@/lib/modern-shop-utils';
import { 
  Package, 
  Users as UsersIcon, 
  TrendingUp,
  DollarSign,
  Truck,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { ModernOrdersList } from '@/components/admin/modern-orders-list';

export default async function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch dashboard statistics
  const [
    totalModernOrders,
    totalUsers,
    totalRevenue,
    upcomingDeliveries,
    recentOrders,
  ] = await Promise.all([
    db.select({ count: count() }).from(modernShopOrders),
    db.select({ count: count() }).from(users),
    db.select({ 
      total: sum(modernShopOrders.totalAmount)
    }).from(modernShopOrders),
    db.select({ count: count() }).from(orderDeliverySchedule)
      .where(gte(orderDeliverySchedule.deliveryDate, today)),
    db.query.modernShopOrders.findMany({
      with: {
        user: {
          columns: {
            email: true,
          },
        },
        paymentGroups: true,
        deliverySchedule: true,
      },
      orderBy: [desc(modernShopOrders.createdAt)],
      limit: 5,
    })
  ]);

  const stats = [
    {
      name: 'Modern Orders',
      value: totalModernOrders[0].count,
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
      name: 'Upcoming Deliveries',
      value: upcomingDeliveries[0].count,
      icon: Truck,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(Number(totalRevenue[0].total) || 0),
      icon: DollarSign,
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

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


      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Legutóbbi rendelések</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <Link 
            href="/admin/modern-orders"
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Összes rendelés
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ModernOrdersList orders={recentOrders} />
      </div>
    </div>
  );
}
