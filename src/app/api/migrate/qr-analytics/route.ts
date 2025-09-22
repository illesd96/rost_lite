import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    // Create QR Code Analytics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS qr_code_visits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        page VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
        user_agent TEXT,
        ip_address VARCHAR(45),
        referrer TEXT,
        is_direct_visit BOOLEAN DEFAULT true NOT NULL,
        session_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_qr_visits_timestamp ON qr_code_visits(timestamp);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_qr_visits_page ON qr_code_visits(page);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_qr_visits_session ON qr_code_visits(session_id);
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'QR Analytics table created successfully' 
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to create QR Analytics table' },
      { status: 500 }
    );
  }
}

