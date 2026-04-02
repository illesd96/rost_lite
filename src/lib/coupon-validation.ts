import { CONSTANTS } from '@/types/modern-shop';

interface CouponRule {
  type: 'standard_partner' | 'private_special';
  unitPriceDiscount?: number;
  shippingDiscount: number;
  userTypeRequired?: 'private';
  maxQuantity?: number;
  description: string;
}

// Single source of truth for coupon codes
// TODO: Move these to the database with an admin UI for managing coupons
const VALID_COUPONS: Record<string, CouponRule> = {
  'teszt114db': {
    type: 'standard_partner',
    shippingDiscount: 1700,
    description: 'Standard partner kedvezmény',
  },
  'mastercard1234': {
    type: 'standard_partner',
    shippingDiscount: 1700,
    description: 'Mastercard partner kedvezmény',
  },
  'private1234': {
    type: 'private_special',
    unitPriceDiscount: 240, // 1490 -> 1250
    shippingDiscount: 1700,
    userTypeRequired: 'private',
    maxQuantity: 20,
    description: 'Magánszemély különleges kedvezmény',
  },
};

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discount?: {
    unitPriceDiscount?: number;
    shippingDiscount: number;
    totalSavings: number;
  };
}

export function validateCoupon(
  couponCode: string,
  userType: 'business' | 'private',
  quantity: number
): CouponValidationResult {
  const trimmedCode = couponCode.trim();
  const coupon = VALID_COUPONS[trimmedCode];

  if (!coupon) {
    return { valid: false, message: 'Érvénytelen partnerkód.' };
  }

  if (coupon.userTypeRequired && userType !== coupon.userTypeRequired) {
    return { valid: false, message: 'Ez a kód csak magánszemélyeknek érvényes.' };
  }

  if (coupon.maxQuantity && quantity > coupon.maxQuantity) {
    return { valid: false, message: `Ez a kód maximum ${coupon.maxQuantity} palack esetén érvényes.` };
  }

  // Calculate savings
  const baseShippingFee = quantity <= 25
    ? CONSTANTS.SHIPPING_FEE_HIGH
    : quantity < CONSTANTS.FREE_SHIPPING_THRESHOLD
      ? CONSTANTS.SHIPPING_FEE_LOW
      : 0;

  let totalSavings = 0;
  if (coupon.unitPriceDiscount) {
    totalSavings += coupon.unitPriceDiscount * quantity;
  }
  if (coupon.shippingDiscount && baseShippingFee > coupon.shippingDiscount) {
    totalSavings += baseShippingFee - coupon.shippingDiscount;
  }

  return {
    valid: true,
    message: 'Partnerkód sikeresen érvényesítve!',
    discount: {
      unitPriceDiscount: coupon.unitPriceDiscount,
      shippingDiscount: coupon.shippingDiscount,
      totalSavings,
    },
  };
}

/**
 * Apply coupon to pricing. Returns adjusted unitPrice and shippingFee.
 * This MUST be used server-side for all order/checkout creation to prevent price manipulation.
 */
export function applyCouponToPricing(
  couponCode: string | undefined | null,
  userType: 'business' | 'private',
  quantity: number,
  baseUnitPrice: number,
  baseShippingFee: number
): { unitPrice: number; shippingFee: number; discountAmount: number } {
  if (!couponCode) {
    return { unitPrice: baseUnitPrice, shippingFee: baseShippingFee, discountAmount: 0 };
  }

  const result = validateCoupon(couponCode, userType, quantity);
  if (!result.valid) {
    // Invalid coupon — ignore it, use base pricing
    return { unitPrice: baseUnitPrice, shippingFee: baseShippingFee, discountAmount: 0 };
  }

  let unitPrice = baseUnitPrice;
  let shippingFee = baseShippingFee;
  let discountAmount = 0;

  if (result.discount?.unitPriceDiscount) {
    unitPrice = baseUnitPrice - result.discount.unitPriceDiscount;
    discountAmount += result.discount.unitPriceDiscount * quantity;
  }
  if (result.discount?.shippingDiscount && shippingFee > result.discount.shippingDiscount) {
    discountAmount += shippingFee - result.discount.shippingDiscount;
    shippingFee = result.discount.shippingDiscount;
  }

  return { unitPrice, shippingFee, discountAmount };
}
