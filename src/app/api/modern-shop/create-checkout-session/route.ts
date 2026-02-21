import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { OrderState, CONSTANTS } from '@/types/modern-shop';
import { getDateFromIndex } from '@/lib/modern-shop-utils';

function calculatePricing(orderState: OrderState) {
  const { quantity, schedule, appliedCoupon, billingData } = orderState;

  let unitPrice = CONSTANTS.UNIT_PRICE;
  let shippingFee = 0;

  if (quantity <= 25) {
    shippingFee = CONSTANTS.SHIPPING_FEE_HIGH;
  } else if (quantity < CONSTANTS.FREE_SHIPPING_THRESHOLD) {
    shippingFee = CONSTANTS.SHIPPING_FEE_LOW;
  }

  if (appliedCoupon) {
    if (appliedCoupon === 'private1234' && billingData.type === 'private' && quantity <= 20) {
      unitPrice = 1250;
      shippingFee = 1700;
    } else if (appliedCoupon === 'teszt114db' || appliedCoupon === 'mastercard1234') {
      if (shippingFee > 1700) {
        shippingFee = 1700;
      }
    }
  }

  const subtotalPerDelivery = unitPrice * quantity;
  const subtotal = subtotalPerDelivery * schedule.length;
  const totalShippingFee = shippingFee * schedule.length;
  const totalAmount = subtotal + totalShippingFee;

  return { unitPrice, subtotalPerDelivery, shippingFee, totalShippingFee, subtotal, totalAmount };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderState }: { orderState: OrderState } = await req.json();

    if (!orderState) {
      return NextResponse.json({ message: 'Order state is required' }, { status: 400 });
    }

    const pricing = calculatePricing(orderState);

    const deliveryDates = orderState.schedule
      .map(idx => getDateFromIndex(CONSTANTS.START_DATE, idx))
      .sort((a, b) => a.getTime() - b.getTime());

    const firstDate = deliveryDates[0]?.toLocaleDateString('hu-HU');
    const lastDate = deliveryDates[deliveryDates.length - 1]?.toLocaleDateString('hu-HU');

    const lineItems: any[] = [
      {
        price_data: {
          currency: 'huf',
          product_data: {
            name: 'Rosti friss préselt gyümölcslé',
            description: `${orderState.quantity} palack × ${orderState.schedule.length} szállítás (${firstDate} – ${lastDate})`,
          },
          unit_amount: pricing.subtotalPerDelivery,
        },
        quantity: orderState.schedule.length,
      },
    ];

    if (pricing.shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'huf',
          product_data: {
            name: 'Szállítási díj',
            description: `${orderState.schedule.length} alkalomra`,
          },
          unit_amount: pricing.shippingFee,
        },
        quantity: orderState.schedule.length,
      });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/modern-shop/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/modern-shop?screen=summary`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        orderStateJson: JSON.stringify(orderState),
      },
      locale: 'hu',
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { message: 'Hiba történt a fizetési munkamenet létrehozása során.' },
      { status: 500 }
    );
  }
}
