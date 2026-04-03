import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await seedDatabase();
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

