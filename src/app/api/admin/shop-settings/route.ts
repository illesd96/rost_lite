import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { shopSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await db.select().from(shopSettings);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching shop settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
    }

    const updated = await db
      .update(shopSettings)
      .set({ value: String(value), updatedAt: new Date() })
      .where(eq(shopSettings.key, key))
      .returning();

    if (updated.length === 0) {
      // Setting doesn't exist yet - create it
      const created = await db
        .insert(shopSettings)
        .values({ key, value: String(value) })
        .returning();
      return NextResponse.json(created[0]);
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating shop setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
