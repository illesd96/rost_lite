import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlistApplications } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { companyName, contactName, email, phone, deliveryAddress, officeHeadcount, quantityMin, quantityMax, acceptedTerms } = body;

    if (!companyName || !contactName || !email || !acceptedTerms) {
      return NextResponse.json(
        { error: 'Kérjük, töltsd ki a kötelező mezőket' },
        { status: 400 }
      );
    }

    const application = await db
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
        acceptedTerms: true,
      })
      .returning({ id: waitlistApplications.id });

    return NextResponse.json(
      { message: 'Jelentkezés sikeresen elküldve', id: application[0].id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Hiba történt a jelentkezés során' },
      { status: 500 }
    );
  }
}
