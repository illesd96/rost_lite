import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Package } from 'lucide-react';
import { ModernOrdersList } from '@/components/admin/modern-orders-list';

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

  // Calculate summary stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalBottles = orders.reduce((sum, o) => sum + o.quantity, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modern Shop Rendelések</h1>
          <p className="text-gray-600 mt-1">
            Rendelések kezelése fizetési csoportokkal és szállítási ütemezéssel
          </p>
        </div>
        <Package className="w-8 h-8 text-gray-400" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-400">
          <div className="text-sm text-gray-500">Összes rendelés</div>
          <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Függőben</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Megerősített</div>
          <div className="text-2xl font-bold text-green-600">{confirmedOrders}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Összes palack</div>
          <div className="text-2xl font-bold text-blue-600">{totalBottles}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-emerald-500">
          <div className="text-sm text-gray-500">Összes bevétel</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</div>
        </div>
      </div>

      <ModernOrdersList orders={orders} />
    </div>
  );
}
