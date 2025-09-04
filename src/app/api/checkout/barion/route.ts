import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { BarionClient, checkoutDataSchema } from '@/lib/barion';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = checkoutDataSchema.parse(body);

    // Generate unique order ID
    const orderId = uuidv4();
    const paymentRequestId = `ORDER-${Date.now()}-${orderId.slice(0, 8)}`;

    // Create order in database
    const newOrder = await db
      .insert(orders)
      .values({
        id: orderId,
        userId: session.user.id,
        status: 'PENDING',
        subtotalHuf: validatedData.total - validatedData.deliveryFee,
        deliveryFeeHuf: validatedData.deliveryFee,
        totalHuf: validatedData.total,
        deliveryMethod: body.deliveryMethod || 'own-delivery',
        deliveryAddress: body.deliveryData?.deliveryAddress || null,
        pickupPointId: body.deliveryData?.pickupPointId || null,
        barionPaymentId: null,
        barionStatus: null,
      })
      .returning();

    // Create order items
    const orderItemsData = validatedData.items.map(item => ({
      orderId: orderId,
      productId: item.id,
      quantity: item.quantity,
      unitPriceHuf: item.price,
      discountAppliedHuf: 0, // TODO: Calculate actual discount
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Check if Barion is properly configured
    if (!process.env.BARION_POSKEY) {
      console.error('❌ Barion POS Key not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('🔧 Barion configuration check:');
    console.log('- BARION_POSKEY:', process.env.BARION_POSKEY ? '✅ Set' : '❌ Missing');
    console.log('- BARION_ENV:', process.env.BARION_ENV || 'test');
    console.log('- BARION_BASE_URL:', process.env.BARION_BASE_URL || 'https://api.test.barion.com');

    // Initialize Barion client
    const barionClient = new BarionClient();

    // Create redirect URLs
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/checkout/success?orderId=${orderId}&paymentId=PAYMENT_ID`;
    const callbackUrl = `${baseUrl}/api/webhooks/barion`;

    // Create Barion payment
    console.log('🚀 Creating Barion payment with:', {
      paymentRequestId,
      total: validatedData.total,
      itemCount: validatedData.items.length,
      redirectUrl,
      callbackUrl
    });

    const barionResponse = await barionClient.createPayment(
      paymentRequestId,
      validatedData.items,
      validatedData.deliveryFee,
      validatedData.total,
      redirectUrl,
      callbackUrl,
      session.user.email
    );

    console.log('✅ Barion response received:', {
      PaymentId: barionResponse.PaymentId,
      Status: barionResponse.Status,
      GatewayUrl: barionResponse.GatewayUrl ? '✅ Present' : '❌ Missing'
    });

    // Update order with Barion payment ID
    await db
      .update(orders)
      .set({
        barionPaymentId: barionResponse.PaymentId,
        barionStatus: barionResponse.Status,
      })
      .where(eq(orders.id, orderId));

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentId: barionResponse.PaymentId,
      gatewayUrl: barionResponse.GatewayUrl,
      qrUrl: barionResponse.QRUrl,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid checkout data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Checkout failed. Please try again.' },
      { status: 500 }
    );
  }
}
