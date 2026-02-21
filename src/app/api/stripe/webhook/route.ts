import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { modernShopOrders, orderPaymentGroups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error('Missing orderId in Stripe session metadata:', session.id);
    return;
  }

  // Update order status to confirmed
  await db
    .update(modernShopOrders)
    .set({
      status: 'confirmed',
      confirmedAt: new Date(),
      updatedAt: new Date(),
      notes: `Stripe session: ${session.id}, Payment intent: ${session.payment_intent}`,
    })
    .where(eq(modernShopOrders.id, orderId));

  // Update payment group to paid
  await db
    .update(orderPaymentGroups)
    .set({ status: 'paid' })
    .where(eq(orderPaymentGroups.orderId, orderId));

  console.log(`Order ${orderId} confirmed via Stripe webhook (session: ${session.id})`);
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
