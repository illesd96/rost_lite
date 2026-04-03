import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { companies, companyContacts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { company, contacts, accounts } = body;

    if (!company?.companyName) {
      return NextResponse.json({ error: 'Cégnév megadása kötelező.' }, { status: 400 });
    }

    // Check for duplicate emails in accounts
    if (accounts && accounts.length > 0) {
      for (const account of accounts) {
        if (!account.email) continue;
        const existing = await db.select().from(users).where(eq(users.email, account.email)).limit(1);
        if (existing.length > 0) {
          return NextResponse.json(
            { error: `A(z) ${account.email} email cím már foglalt.` },
            { status: 400 }
          );
        }
      }
    }

    // Create company
    const [newCompany] = await db.insert(companies).values({
      companyName: company.companyName,
      taxId: company.taxId || null,
      groupTaxId: company.groupTaxId || null,
      useGroupTaxId: company.useGroupTaxId || false,
      logoUrl: company.logoUrl || null,

      billingPostcode: company.billingPostcode || null,
      billingCity: company.billingCity || null,
      billingStreetName: company.billingStreetName || null,
      billingStreetType: company.billingStreetType || null,
      billingHouseNum: company.billingHouseNum || null,
      billingBuilding: company.billingBuilding || null,
      billingFloor: company.billingFloor || null,
      billingDoor: company.billingDoor || null,
      billingOfficeBuilding: company.billingOfficeBuilding || null,

      isShippingSame: company.isShippingSame ?? true,
      shippingPostcode: company.shippingPostcode || null,
      shippingCity: company.shippingCity || null,
      shippingStreetName: company.shippingStreetName || null,
      shippingStreetType: company.shippingStreetType || null,
      shippingHouseNum: company.shippingHouseNum || null,
      shippingBuilding: company.shippingBuilding || null,
      shippingFloor: company.shippingFloor || null,
      shippingDoor: company.shippingDoor || null,
      shippingOfficeBuilding: company.shippingOfficeBuilding || null,

      emailCC1: company.emailCC1 || null,
      emailCC2: company.emailCC2 || null,
      internalShippingNote: company.internalShippingNote || null,
      notifyMinutes: company.notifyMinutes ?? 60,
    }).returning();

    // Create contacts
    if (contacts && contacts.length > 0) {
      await db.insert(companyContacts).values(
        contacts.map((c: { name: string; phone?: string; email?: string; isPrimary?: boolean }) => ({
          companyId: newCompany.id,
          name: c.name,
          phone: c.phone || null,
          email: c.email || null,
          isPrimary: c.isPrimary || false,
        }))
      );
    }

    // Create user accounts
    const createdAccounts: { email: string; id: string }[] = [];
    if (accounts && accounts.length > 0) {
      for (const account of accounts) {
        if (!account.email || !account.password) continue;
        const hashedPassword = await bcrypt.hash(account.password, 12);
        const [newUser] = await db.insert(users).values({
          email: account.email,
          password: hashedPassword,
          role: 'customer',
          companyId: newCompany.id,
          requirePasswordChange: true,
        }).returning({ id: users.id, email: users.email });
        createdAccounts.push(newUser);
      }
    }

    return NextResponse.json({
      message: 'Cég sikeresen létrehozva.',
      company: newCompany,
      accountsCreated: createdAccounts.length,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Hiba történt a cég létrehozása során.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allCompanies = await db.select().from(companies).orderBy(companies.createdAt);
    return NextResponse.json(allCompanies);
  } catch (error) {
    return NextResponse.json({ error: 'Hiba történt.' }, { status: 500 });
  }
}
