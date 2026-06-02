import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { openDayOrders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { OPEN_DAY_UNIT_PRICE } from '@/types/modern-shop';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const MAX_QUANTITY = 50;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OpenDayPayload {
  quantity: number;
  name: string;
  email: string;
  address: {
    postcode?: string;
    city?: string;
    streetName?: string;
    streetType?: string;
    houseNum?: string;
  };
  paymentMethod: 'card' | 'transfer';
}

function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-5);
  return `ROSTI-NAP-${y}${m}${d}-${timestamp}`;
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(`open-day:${getClientIp(req)}`, { limit: 5, windowSeconds: 60 });
    if (rateLimitResponse) return rateLimitResponse;

    const body = (await req.json()) as OpenDayPayload;
    const { name, email, address, paymentMethod } = body;
    const quantity = Math.floor(Number(body.quantity));

    // Server-side validation — never trust the client
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return NextResponse.json({ message: 'Érvénytelen mennyiség.' }, { status: 400 });
    }
    if (!name?.trim() || !email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ message: 'Hiányos vagy érvénytelen számlázási adatok.' }, { status: 400 });
    }
    if (!address?.postcode?.trim() || !address?.city?.trim() || !address?.streetName?.trim() || !address?.houseNum?.trim()) {
      return NextResponse.json({ message: 'Hiányos számlázási cím.' }, { status: 400 });
    }
    if (paymentMethod !== 'card' && paymentMethod !== 'transfer') {
      return NextResponse.json({ message: 'Érvénytelen fizetési mód.' }, { status: 400 });
    }

    const unitPrice = OPEN_DAY_UNIT_PRICE;
    const totalAmount = unitPrice * quantity;
    const orderNumber = generateOrderNumber();

    const [order] = await db.insert(openDayOrders).values({
      orderNumber,
      quantity,
      unitPrice,
      totalAmount,
      name: name.trim(),
      email: email.trim(),
      postcode: address.postcode!.trim(),
      city: address.city!.trim(),
      streetName: address.streetName!.trim(),
      streetType: address.streetType?.trim() || null,
      houseNum: address.houseNum!.trim(),
      paymentMethod,
      status: 'pending_payment',
    }).returning();

    if (paymentMethod === 'transfer') {
      return NextResponse.json({ orderNumber });
    }

    // Card → Stripe Checkout (hosted page also offers Apple Pay / Google Pay)
    const ALLOWED_ORIGINS = [
      'https://www.rosti.hu',
      'https://rosti.hu',
      process.env.NEXTAUTH_URL,
    ].filter(Boolean);
    const requestOrigin = req.headers.get('origin');
    const origin = ALLOWED_ORIGINS.includes(requestOrigin!) ? requestOrigin! : 'https://www.rosti.hu';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'huf',
            product_data: {
              name: 'Rosti prémium nyers zöldség-smoothie',
              description: `${quantity} palack (nyíltnapi átvétel)`,
            },
            // HUF is not zero-decimal in Stripe: amounts are in fillér (×100),
            // which also satisfies Stripe's "divisible by 100" requirement for HUF.
            unit_amount: unitPrice * 100,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/nyiltnap/success?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}&qty=${quantity}`,
      cancel_url: `${origin}/nyiltnap`,
      customer_email: email.trim(),
      metadata: {
        orderType: 'open_day',
        orderId: order.id,
        orderNumber,
      },
      locale: 'hu',
    });

    await db
      .update(openDayOrders)
      .set({ stripeSessionId: checkoutSession.id, updatedAt: new Date() })
      .where(eq(openDayOrders.id, order.id));

    return NextResponse.json({ orderNumber, url: checkoutSession.url });
  } catch (error) {
    console.error('open-day create-order failed:', error);
    return NextResponse.json(
      { message: 'Hiba történt a rendelés létrehozása során.' },
      { status: 500 }
    );
  }
}
