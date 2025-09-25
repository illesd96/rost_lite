'use client';

import { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import { BankTransferPayment } from './bank-transfer-payment';
import { AddressSection } from './address-section';
import { OrderSummary } from './order-summary';
import { type HungarianAddress } from '@/lib/address-validation';

interface CheckoutFormProps {
  userEmail: string;
}

export function CheckoutForm({ userEmail }: CheckoutFormProps) {
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState('own-delivery');
  const [deliveryFee, setDeliveryFee] = useState(1500);
  const [deliveryData, setDeliveryData] = useState<any>({});
  const [selectedDeliveryDates, setSelectedDeliveryDates] = useState<Date[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<HungarianAddress | null>(null);
  const [billingAddress, setBillingAddress] = useState<HungarianAddress | null>(null);
  const [isDeliveryAddressValid, setIsDeliveryAddressValid] = useState(false);
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(false);
  const { items, cartTotal, emptyCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // Load selected delivery dates from localStorage
    try {
      const storedDates = localStorage.getItem('selectedDeliveryDates');
      if (storedDates) {
        const dateStrings = JSON.parse(storedDates);
        const dates = dateStrings.map((dateStr: string) => new Date(dateStr));
        setSelectedDeliveryDates(dates);
      }
    } catch (error) {
      console.error('Failed to load delivery dates:', error);
    }
  }, []);

  const singleOrderTotal = cartTotal + deliveryFee;
  const finalTotal = singleOrderTotal * Math.max(selectedDeliveryDates.length, 1);

  if (!isClient) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    );
  }

  const handleDeliveryChange = (method: string, fee: number, data?: any) => {
    setDeliveryMethod(method);
    setDeliveryFee(fee);
    setDeliveryData(data || {});
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Validate delivery dates
    if (selectedDeliveryDates.length === 0) {
      setError('Please select at least one delivery date');
      return;
    }

    // Validate addresses
    if (!deliveryAddress || !isDeliveryAddressValid) {
      setError('Please provide a valid delivery address');
      return;
    }

    // Validate delivery data
    if (deliveryMethod.includes('home') && !deliveryData.deliveryAddress) {
      setError('Please provide a delivery address');
      return;
    }

    if (deliveryMethod.includes('pickup') && !deliveryData.pickupPointId) {
      setError('Please select a pickup point');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const checkoutData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        deliveryFee,
        deliveryMethod,
        deliveryData,
        total: finalTotal,
      };

      console.log('🛒 Creating bank transfer order...');
      
      const response = await fetch('/api/checkout/bank-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Checkout failed');
      }

      console.log('✅ Bank transfer order created:', result.orderId);
      
      // Clear cart and redirect to order success page
      emptyCart();
      router.push(`/orders/${result.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products before checking out!</p>
        <button
          onClick={() => router.push('/shop')}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 3-Column Layout on Desktop */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Column 1: Address Forms */}
        <AddressSection
          deliveryAddress={deliveryAddress}
          billingAddress={billingAddress}
          onDeliveryAddressChange={setDeliveryAddress}
          onBillingAddressChange={setBillingAddress}
          onDeliveryValidChange={setIsDeliveryAddressValid}
          onBillingValidChange={setIsBillingAddressValid}
        />

        {/* Column 2: Order Summary */}
        <OrderSummary
          items={items}
          cartTotal={cartTotal}
          deliveryFee={deliveryFee}
          deliveryMethod={deliveryMethod}
          selectedDeliveryDates={selectedDeliveryDates}
          finalTotal={finalTotal}
          singleOrderTotal={singleOrderTotal}
          onDeliveryChange={handleDeliveryChange}
        />

        {/* Column 3: Bank Transfer Payment */}
        <BankTransferPayment
          amount={finalTotal}
          orderId={`TEMP-${Date.now()}`}
          userEmail={userEmail}
          onOrderConfirm={handleCheckout}
          isProcessing={isProcessing}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}