import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shopSettings } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await db.select({
      key: shopSettings.key,
      value: shopSettings.value,
    }).from(shopSettings);

    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching public shop settings:', error);
    return NextResponse.json({});
  }
}
