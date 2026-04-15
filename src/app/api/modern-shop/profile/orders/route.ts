import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { db } from '../../../../../lib/db';
import { modernShopOrders, orderDeliverySchedule } from '../../../../../lib/db/schema';
import { eq, and, desc, asc, gte } from 'drizzle-orm';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all modern-shop orders for this user
    const userOrders = await db
      .select()
      .from(modernShopOrders)
      .where(eq(modernShopOrders.userId, session.user.id))
      .orderBy(desc(modernShopOrders.createdAt));

    // For each order, get the next scheduled delivery
    const ordersWithDeliveries = await Promise.all(
      userOrders.map(async (order) => {
        const today = new Date().toISOString().split('T')[0];

        const nextDelivery = await db
          .select()
          .from(orderDeliverySchedule)
          .where(
            and(
              eq(orderDeliverySchedule.orderId, order.id),
              eq(orderDeliverySchedule.status, 'scheduled'),
              gte(orderDeliverySchedule.deliveryDate, today)
            )
          )
          .orderBy(asc(orderDeliverySchedule.deliveryDate))
          .limit(1);

        const lastDelivery = await db
          .select()
          .from(orderDeliverySchedule)
          .where(
            and(
              eq(orderDeliverySchedule.orderId, order.id),
              eq(orderDeliverySchedule.status, 'delivered')
            )
          )
          .orderBy(desc(orderDeliverySchedule.deliveryDate))
          .limit(1);

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          quantity: order.quantity,
          unitPrice: order.unitPrice,
          shippingFee: order.shippingFee,
          totalAmount: order.totalAmount,
          deliveryDatesCount: order.deliveryDatesCount,
          status: order.status,
          createdAt: order.createdAt,
          nextDeliveryDate: nextDelivery[0]?.deliveryDate ?? null,
          lastDeliveryDate: lastDelivery[0]?.deliveryDate ?? null,
        };
      })
    );

    const activeOrders = ordersWithDeliveries.filter(
      (o) => o.status !== 'delivered' && o.status !== 'cancelled'
    );
    const completedOrders = ordersWithDeliveries.filter(
      (o) => o.status === 'delivered'
    );

    return NextResponse.json({ activeOrders, completedOrders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
