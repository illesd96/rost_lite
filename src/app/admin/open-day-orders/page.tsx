import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { openDayOrders } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { PartyPopper } from 'lucide-react';
import { OpenDayOrdersList } from '@/components/admin/open-day-orders-list';

export const dynamic = 'force-dynamic';

export default async function OpenDayOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  const orders = await db
    .select()
    .from(openDayOrders)
    .orderBy(desc(openDayOrders.createdAt));

  // Summary stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending_payment').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const totalBottles = orders.reduce((sum, o) => sum + o.quantity, 0);
  // Only confirmed orders count as realised revenue
  const totalRevenue = orders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nyíltnapi Rendelések</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            A nyíltnapon (vendég) leadott rendelések
          </p>
        </div>
        <PartyPopper className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-gray-400">
          <div className="text-sm text-gray-500 dark:text-gray-400">Összes rendelés</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalOrders}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500 dark:text-gray-400">Fizetésre vár</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500 dark:text-gray-400">Megerősített</div>
          <div className="text-2xl font-bold text-green-600">{confirmedOrders}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500 dark:text-gray-400">Összes palack</div>
          <div className="text-2xl font-bold text-blue-600">{totalBottles}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-emerald-500">
          <div className="text-sm text-gray-500 dark:text-gray-400">Bevétel (megerősített)</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</div>
        </div>
      </div>

      <OpenDayOrdersList orders={orders} />
    </div>
  );
}
