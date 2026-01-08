import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import { userBillingData } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's billing data
    const billingData = await db
      .select()
      .from(userBillingData)
      .where(eq(userBillingData.userId, session.user.id))
      .limit(1);

    if (billingData.length === 0) {
      return NextResponse.json({ billingData: null });
    }

    return NextResponse.json({ 
      billingData: JSON.parse(billingData[0].data) 
    });

  } catch (error) {
    console.error('Get billing data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { billingData } = body;

    if (!billingData) {
      return NextResponse.json(
        { error: 'Missing billing data' },
        { status: 400 }
      );
    }

    // Upsert billing data (insert or update)
    await db
      .insert(userBillingData)
      .values({
        userId: session.user.id,
        data: JSON.stringify(billingData),
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: userBillingData.userId,
        set: {
          data: JSON.stringify(billingData),
          updatedAt: new Date()
        }
      });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Save billing data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
