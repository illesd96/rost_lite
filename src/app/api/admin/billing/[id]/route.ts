import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orderPaymentGroups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, billNumber, billNotes } = body;

    // Validate action
    const validActions = ['create_bill', 'send_bill', 'mark_paid'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const now = new Date();
    let updateData: any = {
      updatedAt: now,
    };

    switch (action) {
      case 'create_bill':
        updateData = {
          ...updateData,
          billCreated: true,
          billCreatedAt: now,
          ...(billNumber && { billNumber }),
          ...(billNotes && { billNotes }),
        };
        break;
      
      case 'send_bill':
        updateData = {
          ...updateData,
          billSent: true,
          billSentAt: now,
        };
        break;
      
      case 'mark_paid':
        updateData = {
          ...updateData,
          status: 'paid',
          paidAt: now,
        };
        break;
    }

    const updatedPaymentGroup = await db
      .update(orderPaymentGroups)
      .set(updateData)
      .where(eq(orderPaymentGroups.id, params.id))
      .returning();

    if (updatedPaymentGroup.length === 0) {
      return NextResponse.json(
        { error: 'Payment group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPaymentGroup[0]);

  } catch (error) {
    console.error('Billing update error:', error);
    return NextResponse.json(
      { error: 'Failed to update billing status' },
      { status: 500 }
    );
  }
}

// GET - Get a single payment group
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const paymentGroup = await db.query.orderPaymentGroups.findFirst({
      where: eq(orderPaymentGroups.id, params.id),
      with: {
        order: {
          with: {
            user: {
              columns: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!paymentGroup) {
      return NextResponse.json(
        { error: 'Payment group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(paymentGroup);

  } catch (error) {
    console.error('Get payment group error:', error);
    return NextResponse.json(
      { error: 'Failed to get payment group' },
      { status: 500 }
    );
  }
}
