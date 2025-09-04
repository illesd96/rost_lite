import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInHuf: number): string {
  // Use a consistent format to avoid hydration mismatches
  // Format: "9,000 Ft" with comma separators
  return `${priceInHuf.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  })} Ft`;
}

export function calculateDiscount(quantity: number, basePrice: number, threshold: number, percentage: number): number {
  if (quantity >= threshold) {
    return Math.round(basePrice * quantity * (percentage / 100));
  }
  return 0;
}

export function calculateDeliveryFee(subtotal: number): number {
  const deliveryFee = parseInt(process.env.DELIVERY_FEE_HUF || '1500');
  const freeThreshold = parseInt(process.env.FREE_DELIVERY_THRESHOLD_HUF || '15000');
  
  return subtotal >= freeThreshold ? 0 : deliveryFee;
}
