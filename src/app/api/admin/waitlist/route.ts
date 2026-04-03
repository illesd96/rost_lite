import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { waitlistApplications } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entries = await db
      .select()
      .from(waitlistApplications)
      .orderBy(desc(waitlistApplications.createdAt));

    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: 'Hiba történt.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, contactName, email, phone, deliveryAddress, officeHeadcount, quantityMin, quantityMax } = body;

    if (!companyName || !contactName || !email) {
      return NextResponse.json({ error: 'Cégnév, kapcsolattartó és email megadása kötelező.' }, { status: 400 });
    }

    const [entry] = await db
      .insert(waitlistApplications)
      .values({
        companyName,
        contactName,
        email,
        phone: phone || null,
        deliveryAddress: deliveryAddress || null,
        officeHeadcount: officeHeadcount ? parseInt(officeHeadcount, 10) : null,
        quantityMin: quantityMin ? parseInt(quantityMin, 10) : null,
        quantityMax: quantityMax ? parseInt(quantityMax, 10) : null,
        acceptedTerms: false,
        status: 'to_contact',
        source: 'manual',
      })
      .returning();

    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Hiba történt a mentés során.' }, { status: 500 });
  }
}
