'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from 'react-use-cart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { AlertTriangle, X } from 'lucide-react';
import { WebshopIcon } from '../ui/webshop-icon';
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
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [forceValidation, setForceValidation] = useState(false);
  const { items, cartTotal, emptyCart } = useCart();
  const router = useRouter();
  const addressSectionRef = useRef<{ validateAllFields: () => void } | null>(null);

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

  const validateForm = () => {
    const errors: string[] = [];

    // Validate cart
    if (items.length === 0) {
      errors.push('A kosár üres');
    }

    // Validate delivery dates
    if (selectedDeliveryDates.length === 0) {
      errors.push('Kérjük, válasszon legalább egy szállítási dátumot');
    }

    // Validate addresses
    if (!deliveryAddress || !isDeliveryAddressValid) {
      errors.push('Kérjük, adjon meg érvényes szállítási címet');
    }

    if (!billingAddress || !isBillingAddressValid) {
      errors.push('Kérjük, adjon meg érvényes számlázási címet');
    }

    // Validate delivery data
    if (deliveryMethod.includes('home') && !deliveryData.deliveryAddress) {
      errors.push('Kérjük, adjon meg szállítási címet');
    }

    if (deliveryMethod.includes('pickup') && !deliveryData.pickupPointId) {
      errors.push('Kérjük, válasszon átvételi pontot');
    }

    return errors;
  };

  const handleCheckout = async () => {
    // Force validation on all fields
    setForceValidation(true);
    
    // Trigger validation in AddressSection
    if (addressSectionRef.current) {
      addressSectionRef.current.validateAllFields();
    }

    // Wait a bit for validation to complete
    setTimeout(() => {
      const errors = validateForm();
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowValidationPopup(true);
        return;
      }

      // If validation passes, proceed with checkout
      proceedWithCheckout();
    }, 100);
  };

  const proceedWithCheckout = async () => {

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

  const closeValidationPopup = () => {
    setShowValidationPopup(false);
    setValidationErrors([]);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <WebshopIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
          ref={addressSectionRef}
          deliveryAddress={deliveryAddress}
          billingAddress={billingAddress}
          onDeliveryAddressChange={setDeliveryAddress}
          onBillingAddressChange={setBillingAddress}
          onDeliveryValidChange={setIsDeliveryAddressValid}
          onBillingValidChange={setIsBillingAddressValid}
          forceValidation={forceValidation}
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

      {/* Validation Popup */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Hiányzó adatok
                </h3>
              </div>
              <button
                onClick={closeValidationPopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                A rendelés leadásához kérjük, töltse ki a következő kötelező mezőket:
              </p>
              
              <ul className="space-y-2">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{error}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeValidationPopup}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Rendben
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}