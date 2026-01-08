import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

interface CouponValidationRequest {
  couponCode: string;
  userType: 'business' | 'private';
  quantity: number;
}

interface CouponValidationResponse {
  valid: boolean;
  message: string;
  discount?: {
    unitPriceDiscount?: number;
    shippingDiscount?: number;
    totalSavings: number;
  };
}

// Define valid coupons with their rules
const VALID_COUPONS = {
  'teszt114db': {
    type: 'standard_partner',
    shippingDiscount: 1700, // Max shipping fee becomes 1700
    description: 'Standard partner kedvezmény'
  },
  'mastercard1234': {
    type: 'standard_partner', 
    shippingDiscount: 1700,
    description: 'Mastercard partner kedvezmény'
  },
  'private1234': {
    type: 'private_special',
    unitPriceDiscount: 240, // 1490 -> 1250
    shippingDiscount: 1700,
    userTypeRequired: 'private',
    maxQuantity: 20,
    description: 'Magánszemély különleges kedvezmény'
  }
} as const;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CouponValidationRequest = await request.json();
    const { couponCode, userType, quantity } = body;

    if (!couponCode || !userType || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const trimmedCode = couponCode.trim();
    const coupon = VALID_COUPONS[trimmedCode as keyof typeof VALID_COUPONS];

    if (!coupon) {
      return NextResponse.json<CouponValidationResponse>({
        valid: false,
        message: 'Érvénytelen partnerkód.'
      });
    }

    // Validate private special code conditions
    if (coupon.type === 'private_special') {
      if (userType !== 'private') {
        return NextResponse.json<CouponValidationResponse>({
          valid: false,
          message: 'Ez a kód csak magánszemélyeknek érvényes.'
        });
      }
      
      if (quantity > 20) {
        return NextResponse.json<CouponValidationResponse>({
          valid: false,
          message: 'Ez a kód maximum 20 palack esetén érvényes.'
        });
      }
    }

    // Calculate potential savings
    const UNIT_PRICE = 1490;
    const SHIPPING_FEE_HIGH = 5700;
    const SHIPPING_FEE_LOW = 3700;
    const FREE_SHIPPING_THRESHOLD = 50;

    let baseShippingFee = 0;
    if (quantity <= 25) {
      baseShippingFee = SHIPPING_FEE_HIGH;
    } else if (quantity < FREE_SHIPPING_THRESHOLD) {
      baseShippingFee = SHIPPING_FEE_LOW;
    }

    let totalSavings = 0;
    
    // Unit price discount
    if ('unitPriceDiscount' in coupon && coupon.unitPriceDiscount) {
      totalSavings += coupon.unitPriceDiscount * quantity;
    }
    
    // Shipping discount
    if (coupon.shippingDiscount && baseShippingFee > coupon.shippingDiscount) {
      totalSavings += baseShippingFee - coupon.shippingDiscount;
    }

    return NextResponse.json<CouponValidationResponse>({
      valid: true,
      message: 'Partnerkód sikeresen érvényesítve!',
      discount: {
        unitPriceDiscount: 'unitPriceDiscount' in coupon ? coupon.unitPriceDiscount : undefined,
        shippingDiscount: coupon.shippingDiscount,
        totalSavings
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
