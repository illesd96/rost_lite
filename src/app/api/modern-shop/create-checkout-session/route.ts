import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { modernShopOrders, orderPaymentGroups, orderDeliverySchedule } from '@/lib/db/schema';
import { OrderState, CONSTANTS } from '@/types/modern-shop';
import { getDateFromIndex } from '@/lib/modern-shop-utils';
import { applyCouponToPricing } from '@/lib/coupon-validation';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

function calculatePricing(orderState: OrderState) {
  const { quantity, schedule, appliedCoupon, billingData } = orderState;

  // Calculate base shipping fee
  let baseShippingFee = 0;
  if (quantity <= 25) {
    baseShippingFee = CONSTANTS.SHIPPING_FEE_HIGH;
  } else if (quantity < CONSTANTS.FREE_SHIPPING_THRESHOLD) {
    baseShippingFee = CONSTANTS.SHIPPING_FEE_LOW;
  }

  // Server-side coupon re-validation — never trust client pricing
  const { unitPrice, shippingFee } = applyCouponToPricing(
    appliedCoupon,
    billingData.type,
    quantity,
    CONSTANTS.UNIT_PRICE,
    baseShippingFee
  );

  const subtotalPerDelivery = unitPrice * quantity;
  const subtotal = subtotalPerDelivery * schedule.length;
  const totalShippingFee = shippingFee * schedule.length;
  const totalAmount = subtotal + totalShippingFee;

  return { unitPrice, subtotalPerDelivery, shippingFee, totalShippingFee, subtotal, totalAmount };
}

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-4);
  return `ROSTI-${year}${month}${day}-${timestamp}`;
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(`checkout:${getClientIp(req)}`, { limit: 5, windowSeconds: 60 });
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderState }: { orderState: OrderState } = await req.json();

    if (!orderState) {
      return NextResponse.json({ message: 'Order state is required' }, { status: 400 });
    }

    const pricing = calculatePricing(orderState);
    const orderNumber = generateOrderNumber();

    // Use a transaction so all inserts succeed or fail together
    const newOrder = await db.transaction(async (tx) => {
      const [order] = await tx.insert(modernShopOrders).values({
        userId: session.user.id,
        orderNumber,
        quantity: orderState.quantity,
        unitPrice: pricing.unitPrice,
        shippingFee: pricing.totalShippingFee,
        totalAmount: pricing.totalAmount,
        deliverySchedule: orderState.schedule,
        deliveryDatesCount: orderState.schedule.length,
        paymentPlan: 'full',
        paymentMethod: 'card',
        appliedCoupon: orderState.appliedCoupon || null,
        discountAmount: 0,
        billingData: orderState.billingData,
        status: 'pending_payment',
      }).returning();

      await tx.insert(orderPaymentGroups).values({
        orderId: order.id,
        groupNumber: 1,
        amount: pricing.totalAmount,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: 'Teljes összeg kártyás fizetése (Stripe)',
      });

      const packages = orderState.schedule.map((deliveryIndex: number, index: number) => {
        const deliveryDate = getDateFromIndex(CONSTANTS.START_DATE, deliveryIndex);
        return {
          orderId: order.id,
          deliveryDate: deliveryDate.toISOString().split('T')[0],
          deliveryIndex,
          isMonday: deliveryDate.getDay() === 1,
          quantity: orderState.quantity,
          amount: pricing.unitPrice * orderState.quantity,
          status: 'scheduled' as const,
          packageNumber: index + 1,
          totalPackages: orderState.schedule.length,
        };
      });

      if (packages.length > 0) {
        await tx.insert(orderDeliverySchedule).values(packages);
      }

      return order;
    });

    // Build Stripe line items
    const deliveryDates = orderState.schedule
      .map(idx => getDateFromIndex(CONSTANTS.START_DATE, idx))
      .sort((a, b) => a.getTime() - b.getTime());

    const firstDate = deliveryDates[0]?.toLocaleDateString('hu-HU');
    const lastDate = deliveryDates[deliveryDates.length - 1]?.toLocaleDateString('hu-HU');

    const lineItems: any[] = [
      {
        price_data: {
          currency: 'huf',
          product_data: {
            name: 'Rosti friss préselt gyümölcslé',
            description: `${orderState.quantity} palack × ${orderState.schedule.length} szállítás (${firstDate} – ${lastDate})`,
          },
          unit_amount: pricing.subtotalPerDelivery,
        },
        quantity: orderState.schedule.length,
      },
    ];

    if (pricing.shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'huf',
          product_data: {
            name: 'Szállítási díj',
            description: `${orderState.schedule.length} alkalomra`,
          },
          unit_amount: pricing.shippingFee,
        },
        quantity: orderState.schedule.length,
      });
    }

    const origin = req.headers.get('origin') || 'https://www.rosti.hu';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/modern-shop/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/modern-shop?screen=summary`,
      customer_email: session.user.email || undefined,
      metadata: {
        orderId: newOrder.id,
        orderNumber,
      },
      locale: 'hu',
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { message: 'Hiba történt a fizetési munkamenet létrehozása során.' },
      { status: 500 }
    );
  }
}
