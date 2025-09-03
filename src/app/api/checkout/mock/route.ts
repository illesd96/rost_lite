import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { checkoutDataSchema } from '@/lib/barion';
import { v4 as uuidv4 } from 'uuid';

// Mock checkout for testing without Barion
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
    const paymentRequestId = `MOCK-ORDER-${Date.now()}-${orderId.slice(0, 8)}`;

    console.log('🧪 Mock Checkout - Creating order:', {
      orderId,
      userId: session.user.id,
      total: validatedData.total,
      items: validatedData.items.length
    });

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
        barionPaymentId: `MOCK-${paymentRequestId}`,
        barionStatus: 'Prepared',
      })
      .returning();

    // Create order items
    const orderItemsData = validatedData.items.map(item => ({
      orderId: orderId,
      productId: item.id,
      quantity: item.quantity,
      unitPriceHuf: item.price,
      discountAppliedHuf: 0,
    }));

    await db.insert(orderItems).values(orderItemsData);

    console.log('✅ Mock order created successfully');

    // Return mock Barion response
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const mockGatewayUrl = `${baseUrl}/checkout/mock-payment?orderId=${orderId}`;

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentId: `MOCK-${paymentRequestId}`,
      gatewayUrl: mockGatewayUrl,
      qrUrl: `${baseUrl}/checkout/mock-qr?orderId=${orderId}`,
    });

  } catch (error) {
    console.error('Mock checkout error:', error);
    
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
