import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { modernShopOrders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing session_id' }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status === 'paid') {
      // Check if order was already created by webhook
      const existingOrders = await db
        .select()
        .from(modernShopOrders)
        .where(eq(modernShopOrders.userId, session.user.id))
        .limit(1);

      // Try to find the most recent order for this user (webhook might have created it)
      // The webhook stores the session ID in notes
      const recentOrder = existingOrders.find(o =>
        o.notes?.includes(sessionId)
      );

      if (recentOrder) {
        return NextResponse.json({
          success: true,
          orderNumber: recentOrder.orderNumber,
          status: 'confirmed',
        });
      }

      // If webhook hasn't processed yet, create the order here as fallback
      // Import and run the same logic as the webhook
      const { OrderState, CONSTANTS } = await import('@/types/modern-shop');
      const { getDateFromIndex } = await import('@/lib/modern-shop-utils');
      const { orderPaymentGroups, orderDeliverySchedule } = await import('@/lib/db/schema');

      const metadata = checkoutSession.metadata;
      if (!metadata?.orderStateJson) {
        return NextResponse.json({ success: false, message: 'Missing order data' }, { status: 400 });
      }

      const orderState = JSON.parse(metadata.orderStateJson);
      const CONSTS = (await import('@/types/modern-shop')).CONSTANTS;

      // Calculate pricing
      let unitPrice = CONSTS.UNIT_PRICE;
      let shippingFee = 0;
      if (orderState.quantity <= 25) shippingFee = CONSTS.SHIPPING_FEE_HIGH;
      else if (orderState.quantity < CONSTS.FREE_SHIPPING_THRESHOLD) shippingFee = CONSTS.SHIPPING_FEE_LOW;

      if (orderState.appliedCoupon === 'private1234' && orderState.billingData?.type === 'private' && orderState.quantity <= 20) {
        unitPrice = 1250;
        shippingFee = 1700;
      } else if (orderState.appliedCoupon === 'teszt114db' || orderState.appliedCoupon === 'mastercard1234') {
        if (shippingFee > 1700) shippingFee = 1700;
      }

      const totalAmount = (unitPrice * orderState.quantity + shippingFee) * orderState.schedule.length;

      const now = new Date();
      const orderNumber = `ROSTI-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${now.getTime().toString().slice(-4)}`;

      const [newOrder] = await db.insert(modernShopOrders).values({
        userId: session.user.id,
        orderNumber,
        quantity: orderState.quantity,
        unitPrice,
        shippingFee: shippingFee * orderState.schedule.length,
        totalAmount,
        deliverySchedule: orderState.schedule,
        deliveryDatesCount: orderState.schedule.length,
        paymentPlan: 'full',
        paymentMethod: 'card',
        appliedCoupon: orderState.appliedCoupon || null,
        discountAmount: 0,
        billingData: orderState.billingData,
        status: 'confirmed',
        confirmedAt: new Date(),
        notes: `Stripe session: ${sessionId}, Payment intent: ${checkoutSession.payment_intent}`,
      }).returning();

      await db.insert(orderPaymentGroups).values({
        orderId: newOrder.id,
        groupNumber: 1,
        amount: totalAmount,
        dueDate: now.toISOString().split('T')[0],
        status: 'paid',
        description: 'Teljes összeg kártyás fizetése (Stripe)',
      });

      const packages = orderState.schedule.map((deliveryIndex: number, index: number) => {
        const deliveryDate = getDateFromIndex(CONSTS.START_DATE, deliveryIndex);
        return {
          orderId: newOrder.id,
          deliveryDate: deliveryDate.toISOString().split('T')[0],
          deliveryIndex,
          isMonday: deliveryDate.getDay() === 1,
          quantity: orderState.quantity,
          amount: unitPrice * orderState.quantity,
          status: 'scheduled' as const,
          packageNumber: index + 1,
          totalPackages: orderState.schedule.length,
        };
      });

      if (packages.length > 0) {
        await db.insert(orderDeliverySchedule).values(packages);
      }

      return NextResponse.json({
        success: true,
        orderNumber,
        status: 'confirmed',
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Payment not yet completed',
      paymentStatus: checkoutSession.payment_status,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Hiba a fizetés ellenőrzése során.' },
      { status: 500 }
    );
  }
}
