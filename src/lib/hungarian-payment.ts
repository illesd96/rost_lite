// Hungarian Instant Payment (Azonnali Fizetés) System
// Based on the Hungarian Central Bank (MNB) QR code specification for instant payments

export interface HungarianPaymentData {
  id_code: string; // "HCT" for Hungarian Credit Transfer
  version: string; // "001" - current version
  charset: string; // "1" for UTF-8
  bic?: string; // Bank Identifier Code (optional)
  name: string; // Beneficiary name
  iban: string; // IBAN account number
  currency: string; // "HUF" for Hungarian Forint
  amount: number; // Payment amount
  valid_until?: string; // ISO 8601 format (optional)
  purpose_code?: string; // Purpose code (optional)
  remittance: string; // Payment reference/description
  shop_id?: string; // Shop identifier (optional)
  device_id?: string; // Device identifier (optional)
  invoice_id?: string; // Invoice identifier (optional)
  customer_id?: string; // Customer identifier (optional)
  creditor_tx_id?: string; // Creditor transaction ID (optional)
  loyalty_id?: string; // Loyalty program ID (optional)
  nav_check_id?: string; // NAV check ID (optional)
}

export interface BankTransferInfo {
  recipientName: string;
  iban: string;
  amount: number;
  currency: string;
  reference: string;
  validUntil?: Date;
}

// Default configuration for your business
export const DEFAULT_PAYMENT_CONFIG = {
  recipientName: "Kedvezményezett Kft.", // Replace with your actual company name
  iban: "HU93116000060000000012345676", // Replace with your actual IBAN
  bic: "", // Optional - your bank's BIC code
  currency: "HUF"
};

/**
 * Generate Hungarian instant payment QR code data
 */
export function generateHungarianPaymentData(
  amount: number,
  orderId: string,
  customConfig?: Partial<typeof DEFAULT_PAYMENT_CONFIG>
): HungarianPaymentData {
  const config = { ...DEFAULT_PAYMENT_CONFIG, ...customConfig };
  
  // Generate valid until date (24 hours from now)
  const validUntil = new Date();
  validUntil.setHours(validUntil.getHours() + 24);
  
  return {
    id_code: "HCT",
    version: "001", 
    charset: "1",
    bic: config.bic || "",
    name: config.recipientName,
    iban: config.iban,
    currency: config.currency,
    amount: amount,
    valid_until: validUntil.toISOString().slice(0, 19) + "+01:00", // Hungarian timezone
    purpose_code: "",
    remittance: `Rendelés #${orderId}`,
    shop_id: "",
    device_id: "",
    invoice_id: orderId,
    customer_id: "",
    creditor_tx_id: "",
    loyalty_id: "",
    nav_check_id: ""
  };
}

/**
 * Convert payment data to QR code string format
 * This creates a JSON string that can be encoded into a QR code
 */
export function paymentDataToQRString(paymentData: HungarianPaymentData): string {
  // Remove empty optional fields to keep QR code smaller
  const cleanData = Object.fromEntries(
    Object.entries(paymentData).filter(([_, value]) => value !== "" && value != null)
  );
  
  return JSON.stringify(cleanData);
}

/**
 * Generate bank transfer information for manual payment
 */
export function generateBankTransferInfo(
  amount: number,
  orderId: string,
  customConfig?: Partial<typeof DEFAULT_PAYMENT_CONFIG>
): BankTransferInfo {
  const config = { ...DEFAULT_PAYMENT_CONFIG, ...customConfig };
  
  const validUntil = new Date();
  validUntil.setHours(validUntil.getHours() + 24);
  
  return {
    recipientName: config.recipientName,
    iban: config.iban,
    amount: amount,
    currency: config.currency,
    reference: `Rendelés #${orderId}`,
    validUntil: validUntil
  };
}

/**
 * Format IBAN for display (with spaces every 4 characters)
 */
export function formatIBANForDisplay(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Validate Hungarian IBAN format
 */
export function isValidHungarianIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
  
  // Check if it starts with HU and has 28 characters total
  if (!/^HU[0-9]{26}$/.test(cleanIBAN)) {
    return false;
  }
  
  // Basic IBAN checksum validation could be added here
  return true;
}

/**
 * Generate QR code data URL for display
 * This function would typically use a QR code library
 * For now, it returns the data that should be encoded
 */
export function generateQRCodeData(paymentData: HungarianPaymentData): string {
  return paymentDataToQRString(paymentData);
}
