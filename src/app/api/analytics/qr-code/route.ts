import { NextRequest, NextResponse } from 'next/server';
import { sql, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { qrCodeVisits } from '@/lib/db/schema';
import { getClientIP } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { page, referrer, userAgent, timestamp, sessionId, isDirectVisit } = data;
    
    // Validate required fields
    if (!page || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get client IP
    const ipAddress = getClientIP(request);
    
    // Insert into database
    await db.insert(qrCodeVisits).values({
      page,
      referrer: referrer || null,
      userAgent: userAgent || null,
      ipAddress,
      sessionId,
      isDirectVisit: isDirectVisit ?? true,
      timestamp: new Date(timestamp),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking QR code visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get analytics data
    const visits = await db
      .select()
      .from(qrCodeVisits)
      .where(sql`${qrCodeVisits.timestamp} >= ${startDate}`)
      .orderBy(desc(qrCodeVisits.timestamp));
    
    // Calculate statistics
    const stats = {
      totalVisits: visits.length,
      osszetevokDirectVisits: visits.filter(v => v.page === '/osszetevok' && v.isDirectVisit).length,
      mainPageNoReferrerVisits: visits.filter(v => v.page === '/' && v.isDirectVisit).length,
      todayVisits: visits.filter(v => {
        const today = new Date();
        const visitDate = new Date(v.timestamp);
        return visitDate.toDateString() === today.toDateString();
      }).length,
      weeklyVisits: visits.filter(v => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(v.timestamp) >= weekAgo;
      }).length,
      monthlyVisits: visits.length, // Already filtered by days parameter
      recentVisits: visits.slice(0, 20), // Last 20 visits
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching QR analytics:', error);
    const isProd = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production';
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      isProd
        ? { error: 'Failed to fetch analytics' }
        : { error: 'Failed to fetch analytics', details: message },
      { status: 500 }
    );
  }
}

