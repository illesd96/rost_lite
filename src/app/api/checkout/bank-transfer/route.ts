import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { generateHungarianPaymentData, generateBankTransferInfo } from '@/lib/hungarian-payment';
import { z } from 'zod';

// Validation schema for checkout data
const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive().int(),
  })).min(1),
  deliveryFee: z.number().min(0),
  deliveryMethod: z.string(),
  deliveryData: z.object({
    deliveryAddress: z.string().optional(),
    pickupPointId: z.string().optional(),
  }).optional(),
  total: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📦 Bank transfer checkout request:', {
      userEmail: session.user.email,
      itemCount: body.items?.length,
      total: body.total
    });

    // Validate request data
    const validatedData = checkoutSchema.parse(body);

    // Generate unique order ID
    const orderId = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const paymentRequestId = `PAY-${orderId}`;

    console.log('🆔 Generated order ID:', orderId);

    // Create order in database
    const [newOrder] = await db
      .insert(orders)
      .values({
        id: orderId,
        userId: session.user.email,
        userEmail: session.user.email,
        status: 'pending_payment',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
        subtotal: validatedData.total - validatedData.deliveryFee,
        deliveryFee: validatedData.deliveryFee,
        total: validatedData.total,
        deliveryMethod: validatedData.deliveryMethod,
        deliveryData: validatedData.deliveryData ? JSON.stringify(validatedData.deliveryData) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Insert order items
    const orderItemsData = validatedData.items.map(item => ({
      id: `${orderId}-${item.id}`,
      orderId: orderId,
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }));

    await db.insert(orderItems).values(orderItemsData);

    console.log('✅ Order created successfully:', {
      orderId: newOrder.id,
      itemCount: orderItemsData.length,
      total: newOrder.total
    });

    // Generate payment information
    const paymentData = generateHungarianPaymentData(validatedData.total, orderId);
    const bankTransferInfo = generateBankTransferInfo(validatedData.total, orderId);

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentData,
      bankTransferInfo,
      message: 'Order created successfully. Please complete the bank transfer to confirm your order.'
    });

  } catch (error) {
    console.error('Bank transfer checkout error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
