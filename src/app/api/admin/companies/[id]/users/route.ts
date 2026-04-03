import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users, companies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const companyId = params.id;

    // Verify company exists
    const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
    if (!company) {
      return NextResponse.json({ error: 'Cég nem található.' }, { status: 404 });
    }

    const body = await request.json();
    const { accounts } = body;

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ error: 'Legalább egy fiókot meg kell adni.' }, { status: 400 });
    }

    // Check for duplicate emails
    for (const account of accounts) {
      if (!account.email || !account.password) continue;
      const existing = await db.select().from(users).where(eq(users.email, account.email)).limit(1);
      if (existing.length > 0) {
        return NextResponse.json(
          { error: `A(z) ${account.email} email cím már foglalt.` },
          { status: 400 }
        );
      }
    }

    // Create user accounts
    const createdAccounts: { email: string; id: string }[] = [];
    for (const account of accounts) {
      if (!account.email?.trim() || !account.password?.trim()) continue;
      const hashedPassword = await bcrypt.hash(account.password, 12);
      const [newUser] = await db.insert(users).values({
        email: account.email,
        password: hashedPassword,
        role: 'customer',
        companyId,
        requirePasswordChange: true,
      }).returning({ id: users.id, email: users.email });
      createdAccounts.push(newUser);
    }

    if (createdAccounts.length === 0) {
      return NextResponse.json({ error: 'Nem sikerült fiókot létrehozni. Ellenőrizd az adatokat.' }, { status: 400 });
    }

    return NextResponse.json({
      message: `${createdAccounts.length} fiók sikeresen létrehozva.`,
      accountsCreated: createdAccounts.length,
    }, { status: 201 });
  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json({ error: 'Hiba történt a fiókok létrehozása során.' }, { status: 500 });
  }
}
