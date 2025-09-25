import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deliverySettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get the active delivery settings
    const settings = await db
      .select()
      .from(deliverySettings)
      .where(eq(deliverySettings.isActive, true))
      .limit(1);

    if (settings.length === 0) {
      // Return default settings if none exist
      return NextResponse.json({
        deliveryDays: ['monday', 'wednesday'],
        weeksInAdvance: 4,
        cutoffHours: 24,
        isActive: true
      });
    }

    const setting = settings[0];
    return NextResponse.json({
      deliveryDays: JSON.parse(setting.deliveryDays),
      weeksInAdvance: setting.weeksInAdvance,
      cutoffHours: setting.cutoffHours,
      isActive: setting.isActive
    });
  } catch (error) {
    console.error('Error fetching delivery settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deliveryDays, weeksInAdvance, cutoffHours } = body;

    // Validate input
    if (!Array.isArray(deliveryDays) || deliveryDays.length === 0) {
      return NextResponse.json(
        { error: 'Delivery days must be a non-empty array' },
        { status: 400 }
      );
    }

    // First, deactivate all existing settings
    await db
      .update(deliverySettings)
      .set({ isActive: false });

    // Create new active setting
    const newSetting = await db
      .insert(deliverySettings)
      .values({
        deliveryDays: JSON.stringify(deliveryDays),
        weeksInAdvance: weeksInAdvance || 4,
        cutoffHours: cutoffHours || 24,
        isActive: true,
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      message: 'Delivery settings updated successfully',
      settings: {
        deliveryDays,
        weeksInAdvance: newSetting[0].weeksInAdvance,
        cutoffHours: newSetting[0].cutoffHours,
        isActive: true
      }
    });
  } catch (error) {
    console.error('Error updating delivery settings:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery settings' },
      { status: 500 }
    );
  }
}

