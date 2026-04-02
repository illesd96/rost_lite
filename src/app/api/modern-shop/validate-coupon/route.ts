import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { validateCoupon, CouponValidationResult } from '@/lib/coupon-validation';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

interface CouponValidationRequest {
  couponCode: string;
  userType: 'business' | 'private';
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(`coupon:${getClientIp(request)}`, { limit: 10, windowSeconds: 60 });
    if (rateLimitResponse) return rateLimitResponse;

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

    const result = validateCoupon(couponCode, userType, quantity);
    return NextResponse.json<CouponValidationResult>(result);

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
