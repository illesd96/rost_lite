import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { modernShopOrders, orderPaymentGroups } from '@/lib/db/schema';
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
      const orderId = checkoutSession.metadata?.orderId;
      const orderNumber = checkoutSession.metadata?.orderNumber;

      if (!orderId) {
        return NextResponse.json({ success: false, message: 'Missing order data' }, { status: 400 });
      }

      // Update order to confirmed (idempotent - safe if webhook already did this)
      await db
        .update(modernShopOrders)
        .set({
          status: 'confirmed',
          confirmedAt: new Date(),
          updatedAt: new Date(),
          notes: `Stripe session: ${sessionId}, Payment intent: ${checkoutSession.payment_intent}`,
        })
        .where(eq(modernShopOrders.id, orderId));

      // Update payment group to paid
      await db
        .update(orderPaymentGroups)
        .set({ status: 'paid' })
        .where(eq(orderPaymentGroups.orderId, orderId));

      return NextResponse.json({
        success: true,
        orderNumber: orderNumber,
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
