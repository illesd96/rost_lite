import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orderPaymentGroups, modernShopOrders, users } from '@/lib/db/schema';
import { eq, gte, asc, or, and, ne } from 'drizzle-orm';
import { BillingList } from '@/components/admin/billing-list';
import { FileText } from 'lucide-react';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  // Get payment groups that are pending or need billing actions
  // Include: upcoming due dates, pending bills, not yet created bills, and recent paid ones
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const pastDateStr = thirtyDaysAgo.toISOString().split('T')[0];
  
  const paymentGroups = await db.query.orderPaymentGroups.findMany({
    where: or(
      // Upcoming or current due dates (not paid/cancelled)
      and(
        gte(orderPaymentGroups.dueDate, pastDateStr),
        ne(orderPaymentGroups.status, 'cancelled')
      ),
      // Any pending payment groups regardless of date
      eq(orderPaymentGroups.status, 'pending')
    ),
    with: {
      order: {
        with: {
          user: {
            columns: {
              email: true,
            },
          },
        },
      },
    },
    orderBy: [asc(orderPaymentGroups.dueDate)],
  });

  // Group payment groups by due date
  const paymentGroupsByDate = paymentGroups.reduce((acc, pg) => {
    const date = pg.dueDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(pg);
    return acc;
  }, {} as Record<string, typeof paymentGroups>);

  // Calculate summary stats
  const totalPending = paymentGroups.filter(pg => pg.status === 'pending').length;
  const billsToCreate = paymentGroups.filter(pg => !pg.billCreated && pg.status !== 'cancelled').length;
  const billsToSend = paymentGroups.filter(pg => pg.billCreated && !pg.billSent && pg.status !== 'cancelled').length;
  const awaitingPayment = paymentGroups.filter(pg => pg.billSent && pg.status === 'pending').length;
  const totalAmount = paymentGroups
    .filter(pg => pg.status === 'pending')
    .reduce((sum, pg) => sum + pg.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Számlázás</h1>
        <FileText className="w-6 h-6 text-gray-400" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-400">
          <div className="text-sm text-gray-500">Összes függőben</div>
          <div className="text-2xl font-bold text-gray-900">{totalPending}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
          <div className="text-sm text-gray-500">Számla létrehozandó</div>
          <div className="text-2xl font-bold text-orange-600">{billsToCreate}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Számla küldendő</div>
          <div className="text-2xl font-bold text-blue-600">{billsToSend}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
          <div className="text-sm text-gray-500">Fizetésre vár</div>
          <div className="text-2xl font-bold text-amber-600">{awaitingPayment}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-emerald-500">
          <div className="text-sm text-gray-500">Összérték (függőben)</div>
          <div className="text-2xl font-bold text-emerald-600">
            {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(totalAmount)}
          </div>
        </div>
      </div>

      <BillingList paymentGroupsByDate={paymentGroupsByDate} />
    </div>
  );
}
