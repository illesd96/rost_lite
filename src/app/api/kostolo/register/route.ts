import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { kostoloRegistrations } from '@/lib/db/schema';
import { count } from 'drizzle-orm';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TICKET_VALIDITY_MINUTES = 10;

interface KostoloPayload {
  name: string;
  email: string;
  acceptedTerms: boolean;
  acceptedMarketing?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(`kostolo:${getClientIp(req)}`, { limit: 5, windowSeconds: 60 });
    if (rateLimitResponse) return rateLimitResponse;

    const body = (await req.json()) as KostoloPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const acceptedMarketing = Boolean(body.acceptedMarketing);

    // Server-side validation — never trust the client
    if (!name || !email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ message: 'Hiányos vagy érvénytelen adatok.' }, { status: 400 });
    }
    if (body.acceptedTerms !== true) {
      return NextResponse.json({ message: 'A szabályzat elfogadása kötelező.' }, { status: 400 });
    }

    const validUntil = new Date(Date.now() + TICKET_VALIDITY_MINUTES * 60_000);

    // Sequential, human-readable ticket number. The unique constraint guards
    // against the rare race between concurrent registrations — retry on conflict.
    let inserted: typeof kostoloRegistrations.$inferSelect | undefined;
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      const [{ total }] = await db.select({ total: count() }).from(kostoloRegistrations);
      const ticketNumber = `KOSTOLO-${String(total + 1).padStart(4, '0')}`;
      try {
        [inserted] = await db
          .insert(kostoloRegistrations)
          .values({ ticketNumber, name, email, acceptedMarketing, validUntil })
          .returning();
      } catch (err: any) {
        // 23505 = unique_violation → another request took this number; retry
        if (err?.code === '23505') continue;
        throw err;
      }
    }

    if (!inserted) {
      return NextResponse.json({ message: 'Nem sikerült kiállítani a kóstolójegyet.' }, { status: 500 });
    }

    return NextResponse.json({
      ticketNumber: inserted.ticketNumber,
      validUntil: inserted.validUntil,
    });
  } catch (error) {
    console.error('kostolo register failed:', error);
    return NextResponse.json({ message: 'Hiba történt a regisztráció során.' }, { status: 500 });
  }
}
