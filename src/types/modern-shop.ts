export type ScreenType = 'selection' | 'login' | 'billing' | 'summary' | 'success';

export type UserType = 'business' | 'private';

export interface Address {
  postcode: string;
  city: string;
  streetName: string;
  streetType: string;
  houseNum: string;
  building?: string;
  floor?: string;
  door?: string;
  officeBuilding?: string;
}

export interface BillingData {
  type: UserType;
  // Business
  companyName: string;
  taxId: string;
  groupTaxId?: string;
  useGroupTaxId: boolean;
  // Private
  firstName: string;
  lastName: string;
  // Common
  billingAddress: Address;
  shippingAddress: Address;
  isShippingSame: boolean;
  // Contact
  contactName: string;
  contactPhone: string;
  secondaryContactName?: string;
  secondaryContactPhone?: string;
  useSecondaryContact: boolean;
  emailCC1?: string;
  emailCC2?: string;
  // Notification
  notifyMinutes: 60 | 30 | 15 | null;
}

export interface OrderState {
  quantity: number;
  isCustomQuantity: boolean;
  schedule: number[]; // Array of week indices
  isLoggedIn: boolean;
  billingData: BillingData;
  paymentPlan: 'full' | 'monthly' | 'delivery';
  paymentMethod: 'transfer' | 'cash' | 'card';
  appliedCoupon?: string;
  stripeSessionId?: string;
}

export const CONSTANTS = {
  UNIT_PRICE: 1490,
  SHIPPING_FEE_HIGH: 5700, // 10-25 bottles
  SHIPPING_FEE_LOW: 3700,  // 26-49 bottles
  FREE_SHIPPING_THRESHOLD: 50,
  START_DATE: new Date(2026, 0, 19), // Jan 19, 2026
  HOLIDAY_DATE: new Date(2026, 3, 6), // Apr 6, 2026 (kept for backward compatibility)
};

// Hungarian public holidays for 2026
export const HUNGARIAN_HOLIDAYS_2026 = [
  new Date(2026, 0, 1),   // January 1 - Újév (New Year's Day)
  new Date(2026, 2, 15),  // March 15 - Nemzeti ünnep (National Day)
  new Date(2026, 3, 3),   // April 3 - Nagypéntek (Good Friday)
  new Date(2026, 3, 6),   // April 6 - Húsvéthétfő (Easter Monday)
  new Date(2026, 4, 1),   // May 1 - A munka ünnepe (Labour Day)
  new Date(2026, 4, 25),  // May 25 - Pünkösdhétfő (Whit Monday)
  new Date(2026, 7, 20),  // August 20 - Szent István ünnepe (State Foundation Day)
  new Date(2026, 9, 23),  // October 23 - 1956-os forradalom ünnepe
  new Date(2026, 10, 1),  // November 1 - Mindenszentek (All Saints' Day)
  new Date(2026, 11, 25), // December 25 - Karácsony (Christmas Day)
  new Date(2026, 11, 26), // December 26 - Karácsony másnapja (Second Day of Christmas)
];

// Helper function to check if a date is a Hungarian holiday
export const isHungarianHoliday = (date: Date): boolean => {
  return HUNGARIAN_HOLIDAYS_2026.some(holiday => 
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
};


