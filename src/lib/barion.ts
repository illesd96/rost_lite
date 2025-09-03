import { z } from 'zod';

// Barion API Configuration
export const BARION_CONFIG = {
  baseUrl: process.env.BARION_BASE_URL || 'https://api.test.barion.com',
  posKey: process.env.BARION_POSKEY || '',
  environment: process.env.BARION_ENV || 'test',
  // Payment methods: All, BankCard, Balance, BankTransfer (Azonnali Utalás)
  fundingSources: process.env.BARION_FUNDING_SOURCES?.split(',') || ['All'],
};

// Barion API Types
export interface BarionItem {
  Name: string;
  Description: string;
  Quantity: number;
  Unit: string;
  UnitPrice: number;
  ItemTotal: number;
  SKU?: string;
}

export interface BarionTransaction {
  POSTransactionId: string;
  Payee: string;
  Total: number;
  Currency: string;
  Comment: string;
  Items: BarionItem[];
}

export interface BarionPaymentRequest {
  POSKey: string;
  PaymentType: 'Immediate';
  PaymentRequestId: string;
  PayerHint?: string;
  CardHolderNameHint?: string;
  Locale: string;
  Currency: string;
  FundingSources: string[];
  GuestCheckOut: boolean;
  RedirectUrl: string;
  CallbackUrl: string;
  Transactions: BarionTransaction[];
}

export interface BarionPaymentResponse {
  PaymentId: string;
  PaymentRequestId: string;
  Status: string;
  QRUrl: string;
  Transactions: Array<{
    POSTransactionId: string;
    TransactionId: string;
    Status: string;
    Currency: string;
    TransactionTime: string;
  }>;
  RecurrenceResult?: string;
  ThreeDSAuthClientData?: string;
  GatewayUrl: string;
  RedirectUrl?: string;
  CallbackUrl?: string;
  Errors?: Array<{
    ErrorCode: string;
    Title: string;
    Description: string;
  }>;
}

// Validation schemas
export const checkoutItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive().int(),
});

export const checkoutDataSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  deliveryFee: z.number().min(0),
  total: z.number().positive(),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutData = z.infer<typeof checkoutDataSchema>;

// Barion API Client
export class BarionClient {
  private baseUrl: string;
  private posKey: string;

  constructor() {
    this.baseUrl = BARION_CONFIG.baseUrl;
    this.posKey = BARION_CONFIG.posKey;
    
    if (!this.posKey) {
      throw new Error('BARION_POSKEY environment variable is required');
    }
    
    console.log('🔧 BarionClient initialized:', {
      baseUrl: this.baseUrl,
      posKeyLength: this.posKey.length,
      environment: BARION_CONFIG.environment,
      fundingSources: BARION_CONFIG.fundingSources
    });
  }

  async createPayment(
    paymentRequestId: string,
    items: CheckoutItem[],
    deliveryFee: number,
    total: number,
    redirectUrl: string,
    callbackUrl: string,
    userEmail?: string
  ): Promise<BarionPaymentResponse> {
    // Convert cart items to Barion items
    const barionItems: BarionItem[] = items.map(item => ({
      Name: item.name,
      Description: item.name,
      Quantity: item.quantity,
      Unit: 'piece',
      UnitPrice: item.price,
      ItemTotal: item.price * item.quantity,
      SKU: item.id,
    }));

    // Add delivery fee as separate item if applicable
    if (deliveryFee > 0) {
      barionItems.push({
        Name: 'Delivery Fee',
        Description: 'Shipping and handling',
        Quantity: 1,
        Unit: 'service',
        UnitPrice: deliveryFee,
        ItemTotal: deliveryFee,
      });
    }

    const transaction: BarionTransaction = {
      POSTransactionId: paymentRequestId,
      Payee: 'dani.illes96@gmail.com', // Use your registered Barion account email
      Total: total,
      Currency: 'HUF',
      Comment: `WebShop Order #${paymentRequestId}`,
      Items: barionItems,
    };

    const paymentRequest: BarionPaymentRequest = {
      POSKey: this.posKey,
      PaymentType: 'Immediate',
      PaymentRequestId: paymentRequestId,
      // PayerHint: userEmail, // Remove user email to avoid "Invalid user" error
      Locale: 'hu-HU',
      Currency: 'HUF',
      FundingSources: BARION_CONFIG.fundingSources, // Configurable payment methods
      GuestCheckOut: true,
      RedirectUrl: redirectUrl,
      CallbackUrl: callbackUrl,
      Transactions: [transaction],
    };

    console.log('🚀 Sending Barion API request:', {
      url: `${this.baseUrl}/v2/Payment/Start`,
      posKeyLength: this.posKey.length,
      transactionCount: paymentRequest.Transactions.length,
      total: paymentRequest.Transactions[0].Total
    });

    const response = await fetch(`${this.baseUrl}/v2/Payment/Start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest),
    });

    console.log('📡 Barion API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Barion API error response:', errorText);
      throw new Error(`Barion API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result: BarionPaymentResponse = await response.json();
    
    if (result.Errors && result.Errors.length > 0) {
      throw new Error(`Barion payment error: ${result.Errors[0].Description}`);
    }

    return result;
  }

  async getPaymentState(paymentId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/v2/Payment/GetPaymentState?POSKey=${this.posKey}&PaymentId=${paymentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Barion API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
