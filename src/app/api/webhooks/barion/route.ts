import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { BarionClient } from '@/lib/barion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Barion webhook received:', body);

    const { PaymentId } = body;

    if (!PaymentId) {
      return NextResponse.json(
        { error: 'PaymentId is required' },
        { status: 400 }
      );
    }

    // Get payment state from Barion
    const barionClient = new BarionClient();
    const paymentState = await barionClient.getPaymentState(PaymentId);

    console.log('Barion payment state:', paymentState);

    // Find order by Barion payment ID
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.barionPaymentId, PaymentId))
      .limit(1);

    if (order.length === 0) {
      console.error('Order not found for PaymentId:', PaymentId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const currentOrder = order[0];

    // Map Barion status to our order status
    let newStatus = currentOrder.status;
    switch (paymentState.Status) {
      case 'Prepared':
        newStatus = 'PENDING';
        break;
      case 'Started':
        newStatus = 'PENDING';
        break;
      case 'InProgress':
        newStatus = 'PENDING';
        break;
      case 'Succeeded':
        newStatus = 'PAID';
        break;
      case 'Failed':
      case 'Canceled':
        newStatus = 'FAILED';
        break;
      case 'PartiallySucceeded':
        newStatus = 'PAID'; // Treat as paid for now
        break;
      default:
        console.warn('Unknown Barion status:', paymentState.Status);
    }

    // Update order status
    await db
      .update(orders)
      .set({
        status: newStatus,
        barionStatus: paymentState.Status,
      })
      .where(eq(orders.id, currentOrder.id));

    console.log(`Order ${currentOrder.id} updated to status: ${newStatus}`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Barion webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
