import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orderDeliverySchedule, modernShopOrders, users } from '@/lib/db/schema';
import { eq, gte, asc } from 'drizzle-orm';
import { DeliveryList } from '@/components/admin/delivery-list';

export default async function DeliveriesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  // Get upcoming deliveries (today and future)
  const today = new Date().toISOString().split('T')[0];
  
  const upcomingDeliveries = await db.query.orderDeliverySchedule.findMany({
    where: gte(orderDeliverySchedule.deliveryDate, today),
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
    orderBy: [asc(orderDeliverySchedule.deliveryDate)],
  });

  // Group deliveries by date
  const deliveriesByDate = upcomingDeliveries.reduce((acc, delivery) => {
    const date = delivery.deliveryDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(delivery);
    return acc;
  }, {} as Record<string, typeof upcomingDeliveries>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Deliveries</h1>
      </div>

      <DeliveryList deliveriesByDate={deliveriesByDate} />
    </div>
  );
}
