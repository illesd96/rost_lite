import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    // Only allow seeding in development or if explicitly enabled
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEEDING !== 'true') {
      return NextResponse.json(
        { error: 'Seeding not allowed in production' },
        { status: 403 }
      );
    }

    await seedDatabase();
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      credentials: {
        admin: { email: 'admin@webshop.com', password: 'admin123' },
        customer: { email: 'customer@example.com', password: 'customer123' },
      },
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
