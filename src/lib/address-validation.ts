import { z } from 'zod';

// Hungarian postal code: 4 digits
const postalCodeRegex = /^\d{4}$/;

// Hungarian tax number: 8 digits
const taxNumberRegex = /^\d{8}$/;

// Hungarian VAT number: HU + 8 digits
const vatNumberRegex = /^HU\d{8}$/;

// Hungarian phone number formats
const phoneRegex = /^(\+36|06)?[1-9]\d{7,8}$/;

export const hungarianAddressSchema = z.object({
  type: z.enum(['delivery', 'billing']),
  isDefault: z.boolean().default(false),
  
  // Personal/Company info
  isCompany: z.boolean().default(false),
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  
  // Hungarian tax information (for companies)
  taxNumber: z.string().regex(taxNumberRegex, 'Adószám formátuma: 8 számjegy').optional(),
  vatNumber: z.string().regex(vatNumberRegex, 'ÁFA szám formátuma: HU12345678').optional(),
  registrationNumber: z.string().optional(),
  
  // Address details
  fullName: z.string().min(1, 'Teljes név kötelező'),
  email: z.string().email('Érvényes email cím szükséges').optional(),
  phone: z.string().regex(phoneRegex, 'Érvényes magyar telefonszám szükséges').optional(),
  
  // Hungarian address format
  country: z.string().default('Hungary'),
  postalCode: z.string().regex(postalCodeRegex, 'Irányítószám: 4 számjegy'),
  city: z.string().min(1, 'Város kötelező'),
  district: z.string().optional(), // For Budapest districts
  streetAddress: z.string().min(1, 'Utca kötelező'),
  houseNumber: z.string().optional(),
  floor: z.string().optional(),
  door: z.string().optional(),
  
  notes: z.string().optional(),
}).refine((data) => {
  // If it's a company, company name is required
  if (data.isCompany && !data.companyName) {
    return false;
  }
  return true;
}, {
  message: 'Cégnév kötelező vállalati címnél',
  path: ['companyName']
}).refine((data) => {
  // If it's a company billing address, tax number is required
  if (data.isCompany && data.type === 'billing' && !data.taxNumber) {
    return false;
  }
  return true;
}, {
  message: 'Adószám kötelező vállalati számlázási címnél',
  path: ['taxNumber']
});

export type HungarianAddress = z.infer<typeof hungarianAddressSchema>;

// Helper functions for Hungarian address formatting
export function formatHungarianAddress(address: HungarianAddress): string {
  const parts = [];
  
  if (address.isCompany && address.companyName) {
    parts.push(address.companyName);
    if (address.contactPerson) {
      parts.push(`Kapcsolattartó: ${address.contactPerson}`);
    }
  }
  
  parts.push(address.fullName);
  
  const addressLine = [
    address.streetAddress,
    address.houseNumber,
    address.floor && `${address.floor}. emelet`,
    address.door && `${address.door}. ajtó`
  ].filter(Boolean).join(' ');
  
  parts.push(addressLine);
  
  const cityLine = [
    address.postalCode,
    address.city,
    address.district && `${address.district}. kerület`
  ].filter(Boolean).join(' ');
  
  parts.push(cityLine);
  parts.push(address.country);
  
  return parts.join('\n');
}

export function validateTaxNumber(taxNumber: string): boolean {
  if (!taxNumber || !taxNumberRegex.test(taxNumber)) {
    return false;
  }
  
  // Hungarian tax number checksum validation
  const digits = taxNumber.split('').map(Number);
  const weights = [9, 7, 3, 1, 9, 7, 3];
  
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += digits[i] * weights[i];
  }
  
  const checkDigit = sum % 10;
  return checkDigit === digits[7];
}

export function validateVATNumber(vatNumber: string): boolean {
  if (!vatNumber || !vatNumberRegex.test(vatNumber)) {
    return false;
  }
  
  // Extract the numeric part and validate as tax number
  const numericPart = vatNumber.substring(2);
  return validateTaxNumber(numericPart);
}

// Hungarian postal code validation with region checking
export function validatePostalCode(postalCode: string): { valid: boolean; region?: string } {
  if (!postalCodeRegex.test(postalCode)) {
    return { valid: false };
  }
  
  const code = parseInt(postalCode);
  let region = '';
  
  if (code >= 1000 && code <= 1239) region = 'Budapest';
  else if (code >= 2000 && code <= 2999) region = 'Pest megye';
  else if (code >= 3000 && code <= 3999) region = 'Észak-Magyarország';
  else if (code >= 4000 && code <= 4999) region = 'Alföld';
  else if (code >= 5000 && code <= 5999) region = 'Dél-Alföld';
  else if (code >= 6000 && code <= 6999) region = 'Dél-Dunántúl';
  else if (code >= 7000 && code <= 7999) region = 'Közép-Dunántúl';
  else if (code >= 8000 && code <= 8999) region = 'Nyugat-Dunántúl';
  else if (code >= 9000 && code <= 9999) region = 'Nyugat-Dunántúl';
  
  return { valid: true, region };
}
