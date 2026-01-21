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
  paymentMethod: 'transfer' | 'cash';
  appliedCoupon?: string;
}

export const CONSTANTS = {
  UNIT_PRICE: 1490,
  SHIPPING_FEE_HIGH: 5700, // 10-25 bottles
  SHIPPING_FEE_LOW: 3700,  // 26-49 bottles
  FREE_SHIPPING_THRESHOLD: 50,
  START_DATE: new Date(2026, 0, 19), // Jan 19, 2026
  HOLIDAY_DATE: new Date(2026, 3, 6), // Apr 6, 2026
};


