import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { modernShopOrders, orderPaymentGroups, orderDeliverySchedule } from '@/lib/db/schema';
import { OrderState, CONSTANTS } from '@/types/modern-shop';
import { getDateFromIndex } from '@/lib/modern-shop-utils';
import Stripe from 'stripe';

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-4);
  return `ROSTI-${year}${month}${day}-${timestamp}`;
}

function calculatePricing(orderState: OrderState) {
  const { quantity, schedule, appliedCoupon, billingData } = orderState;

  let unitPrice = CONSTANTS.UNIT_PRICE;
  let shippingFee = 0;

  if (quantity <= 25) {
    shippingFee = CONSTANTS.SHIPPING_FEE_HIGH;
  } else if (quantity < CONSTANTS.FREE_SHIPPING_THRESHOLD) {
    shippingFee = CONSTANTS.SHIPPING_FEE_LOW;
  }

  if (appliedCoupon) {
    if (appliedCoupon === 'private1234' && billingData.type === 'private' && quantity <= 20) {
      unitPrice = 1250;
      shippingFee = 1700;
    } else if (appliedCoupon === 'teszt114db' || appliedCoupon === 'mastercard1234') {
      if (shippingFee > 1700) {
        shippingFee = 1700;
      }
    }
  }

  const subtotalPerDelivery = unitPrice * quantity;
  const subtotal = subtotalPerDelivery * schedule.length;
  const totalShippingFee = shippingFee * schedule.length;
  const totalAmount = subtotal + totalShippingFee;
  const originalTotal = (CONSTANTS.UNIT_PRICE * quantity + shippingFee) * schedule.length;
  const discountAmount = originalTotal - totalAmount;

  return { unitPrice, shippingFee: totalShippingFee, subtotal, totalAmount, discountAmount };
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const { userId, orderStateJson } = session.metadata || {};

  if (!userId || !orderStateJson) {
    console.error('Missing metadata in Stripe session:', session.id);
    return;
  }

  const orderState: OrderState = JSON.parse(orderStateJson);
  const pricing = calculatePricing(orderState);
  const orderNumber = generateOrderNumber();

  const [newOrder] = await db.insert(modernShopOrders).values({
    userId,
    orderNumber,
    quantity: orderState.quantity,
    unitPrice: pricing.unitPrice,
    shippingFee: pricing.shippingFee,
    totalAmount: pricing.totalAmount,
    deliverySchedule: orderState.schedule,
    deliveryDatesCount: orderState.schedule.length,
    paymentPlan: 'full',
    paymentMethod: 'card',
    appliedCoupon: orderState.appliedCoupon || null,
    discountAmount: pricing.discountAmount,
    billingData: orderState.billingData,
    status: 'confirmed',
    confirmedAt: new Date(),
    notes: `Stripe session: ${session.id}, Payment intent: ${session.payment_intent}`,
  }).returning();

  // Single payment group - full upfront
  await db.insert(orderPaymentGroups).values({
    orderId: newOrder.id,
    groupNumber: 1,
    amount: pricing.totalAmount,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'paid',
    description: 'Teljes összeg kártyás fizetése (Stripe)',
  });

  // Delivery packages
  const packages = orderState.schedule.map((deliveryIndex, index) => {
    const deliveryDate = getDateFromIndex(CONSTANTS.START_DATE, deliveryIndex);
    return {
      orderId: newOrder.id,
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
    await db.insert(orderDeliverySchedule).values(packages);
  }

  console.log(`Order ${orderNumber} created successfully for Stripe session ${session.id}`);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        await fulfillOrder(session);
      }
      break;
    }
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillOrder(session);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
