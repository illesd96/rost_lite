import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import { users, companies, companyContacts } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

// Convert company DB row + contacts into the BillingData shape the frontend expects
function companyToBillingData(company: typeof companies.$inferSelect, contacts: (typeof companyContacts.$inferSelect)[]) {
  const primaryContact = contacts.find(c => c.isPrimary) || contacts[0];
  const secondaryContact = contacts.find(c => !c.isPrimary && c !== primaryContact);

  return {
    type: 'business' as const,
    companyName: company.companyName || '',
    taxId: company.taxId || '',
    groupTaxId: company.groupTaxId || '',
    useGroupTaxId: company.useGroupTaxId || false,
    firstName: '',
    lastName: '',
    billingAddress: {
      postcode: company.billingPostcode || '',
      city: company.billingCity || '',
      streetName: company.billingStreetName || '',
      streetType: company.billingStreetType || '',
      houseNum: company.billingHouseNum || '',
      building: company.billingBuilding || '',
      floor: company.billingFloor || '',
      door: company.billingDoor || '',
      officeBuilding: company.billingOfficeBuilding || '',
    },
    shippingAddress: {
      postcode: company.isShippingSame ? (company.billingPostcode || '') : (company.shippingPostcode || ''),
      city: company.isShippingSame ? (company.billingCity || '') : (company.shippingCity || ''),
      streetName: company.isShippingSame ? (company.billingStreetName || '') : (company.shippingStreetName || ''),
      streetType: company.isShippingSame ? (company.billingStreetType || '') : (company.shippingStreetType || ''),
      houseNum: company.isShippingSame ? (company.billingHouseNum || '') : (company.shippingHouseNum || ''),
      building: company.isShippingSame ? (company.billingBuilding || '') : (company.shippingBuilding || ''),
      floor: company.isShippingSame ? (company.billingFloor || '') : (company.shippingFloor || ''),
      door: company.isShippingSame ? (company.billingDoor || '') : (company.shippingDoor || ''),
      officeBuilding: company.isShippingSame ? (company.billingOfficeBuilding || '') : (company.shippingOfficeBuilding || ''),
    },
    isShippingSame: company.isShippingSame,
    contactName: primaryContact?.name || '',
    contactPhone: primaryContact?.phone || '+36',
    secondaryContactName: secondaryContact?.name || '',
    secondaryContactPhone: secondaryContact?.phone || '',
    useSecondaryContact: !!secondaryContact,
    emailCC1: company.emailCC1 || '',
    emailCC2: company.emailCC2 || '',
    notifyMinutes: company.notifyMinutes as 60 | 30 | 15 | null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user with company
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    if (!user?.companyId) {
      return NextResponse.json({ billingData: null });
    }

    // Get company
    const [company] = await db.select().from(companies).where(eq(companies.id, user.companyId)).limit(1);

    if (!company) {
      return NextResponse.json({ billingData: null });
    }

    // Get contacts
    const contacts = await db.select().from(companyContacts).where(eq(companyContacts.companyId, company.id));

    return NextResponse.json({
      billingData: companyToBillingData(company, contacts),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { billingData } = body;

    if (!billingData) {
      return NextResponse.json({ error: 'Missing billing data' }, { status: 400 });
    }

    // Get user with company
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    if (!user?.companyId) {
      // No company linked — nothing to update
      return NextResponse.json({ success: true });
    }

    // Update company with billing data from the form
    await db.update(companies).set({
      companyName: billingData.companyName || undefined,
      taxId: billingData.taxId || null,
      groupTaxId: billingData.groupTaxId || null,
      useGroupTaxId: billingData.useGroupTaxId || false,

      billingPostcode: billingData.billingAddress?.postcode || null,
      billingCity: billingData.billingAddress?.city || null,
      billingStreetName: billingData.billingAddress?.streetName || null,
      billingStreetType: billingData.billingAddress?.streetType || null,
      billingHouseNum: billingData.billingAddress?.houseNum || null,
      billingBuilding: billingData.billingAddress?.building || null,
      billingFloor: billingData.billingAddress?.floor || null,
      billingDoor: billingData.billingAddress?.door || null,
      billingOfficeBuilding: billingData.billingAddress?.officeBuilding || null,

      isShippingSame: billingData.isShippingSame ?? true,
      shippingPostcode: billingData.isShippingSame ? null : (billingData.shippingAddress?.postcode || null),
      shippingCity: billingData.isShippingSame ? null : (billingData.shippingAddress?.city || null),
      shippingStreetName: billingData.isShippingSame ? null : (billingData.shippingAddress?.streetName || null),
      shippingStreetType: billingData.isShippingSame ? null : (billingData.shippingAddress?.streetType || null),
      shippingHouseNum: billingData.isShippingSame ? null : (billingData.shippingAddress?.houseNum || null),
      shippingBuilding: billingData.isShippingSame ? null : (billingData.shippingAddress?.building || null),
      shippingFloor: billingData.isShippingSame ? null : (billingData.shippingAddress?.floor || null),
      shippingDoor: billingData.isShippingSame ? null : (billingData.shippingAddress?.door || null),
      shippingOfficeBuilding: billingData.isShippingSame ? null : (billingData.shippingAddress?.officeBuilding || null),

      emailCC1: billingData.emailCC1 || null,
      emailCC2: billingData.emailCC2 || null,
      notifyMinutes: billingData.notifyMinutes ?? 60,

      updatedAt: new Date(),
    }).where(eq(companies.id, user.companyId));

    // Update primary contact
    if (billingData.contactName || billingData.contactPhone) {
      const existingContacts = await db.select().from(companyContacts)
        .where(eq(companyContacts.companyId, user.companyId));

      const primaryContact = existingContacts.find(c => c.isPrimary);

      if (primaryContact) {
        await db.update(companyContacts).set({
          name: billingData.contactName || primaryContact.name,
          phone: billingData.contactPhone || primaryContact.phone,
        }).where(eq(companyContacts.id, primaryContact.id));
      } else if (billingData.contactName) {
        await db.insert(companyContacts).values({
          companyId: user.companyId,
          name: billingData.contactName,
          phone: billingData.contactPhone || null,
          isPrimary: true,
        });
      }

      // Handle secondary contact
      const secondaryContact = existingContacts.find(c => !c.isPrimary);
      if (billingData.useSecondaryContact && billingData.secondaryContactName) {
        if (secondaryContact) {
          await db.update(companyContacts).set({
            name: billingData.secondaryContactName,
            phone: billingData.secondaryContactPhone || null,
          }).where(eq(companyContacts.id, secondaryContact.id));
        } else {
          await db.insert(companyContacts).values({
            companyId: user.companyId,
            name: billingData.secondaryContactName,
            phone: billingData.secondaryContactPhone || null,
            isPrimary: false,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
