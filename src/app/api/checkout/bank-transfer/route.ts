import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems, users } from '@/lib/db/schema';
import { generateHungarianPaymentData, generateBankTransferInfo } from '@/lib/hungarian-payment';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

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

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('🆔 Creating order for user:', user.id);

    // Create order in database (let DB generate UUID)
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: user.id,
        status: 'PENDING',
        subtotalHuf: validatedData.total - validatedData.deliveryFee,
        deliveryFeeHuf: validatedData.deliveryFee,
        totalHuf: validatedData.total,
        deliveryMethod: validatedData.deliveryMethod,
        deliveryAddress: validatedData.deliveryData?.deliveryAddress || null,
        pickupPointId: validatedData.deliveryData?.pickupPointId || null,
      })
      .returning();

    // Insert order items
    const orderItemsData = validatedData.items.map(item => ({
      orderId: newOrder.id,
      productId: item.id,
      quantity: item.quantity,
      unitPriceHuf: item.price,
      discountAppliedHuf: 0,
    }));

    await db.insert(orderItems).values(orderItemsData);

    console.log('✅ Order created successfully:', {
      orderId: newOrder.id,
      itemCount: orderItemsData.length,
      total: newOrder.totalHuf
    });

    // Generate payment information
    const paymentData = generateHungarianPaymentData(validatedData.total, newOrder.id);
    const bankTransferInfo = generateBankTransferInfo(validatedData.total, newOrder.id);

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
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
