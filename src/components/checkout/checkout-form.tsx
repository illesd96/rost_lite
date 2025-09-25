'use client';

import { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { CreditCard, ShoppingBag, Receipt, Calendar } from 'lucide-react';
import { DeliverySelection } from './delivery-selection';
import { BankTransferPayment } from './bank-transfer-payment';
import { AddressForm } from './address-form';
import { formatDateWithDay } from '@/lib/delivery-dates';
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
  const [useSameAddress, setUseSameAddress] = useState(true);
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

    if (!useSameAddress && (!billingAddress || !isBillingAddressValid)) {
      setError('Please provide a valid billing address');
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
      {/* Address Forms */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <AddressForm
            type="delivery"
            onAddressChange={setDeliveryAddress}
            onValidChange={setIsDeliveryAddressValid}
          />
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useSameAddress}
                onChange={(e) => setUseSameAddress(e.target.checked)}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                Számlázási cím megegyezik a szállítási címmel
              </span>
            </label>
          </div>
          
          {!useSameAddress && (
            <AddressForm
              type="billing"
              onAddressChange={setBillingAddress}
              onValidChange={setIsBillingAddressValid}
            />
          )}
          
          {useSameAddress && deliveryAddress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Számlázási cím:</p>
              <p className="text-sm text-gray-900 whitespace-pre-line">
                {deliveryAddress.isCompany && deliveryAddress.companyName && `${deliveryAddress.companyName}\n`}
                {deliveryAddress.fullName}
                {deliveryAddress.streetAddress} {deliveryAddress.houseNumber}
                {deliveryAddress.floor && ` ${deliveryAddress.floor}. emelet`}
                {deliveryAddress.door && ` ${deliveryAddress.door}. ajtó`}
                {`\n${deliveryAddress.postalCode} ${deliveryAddress.city}`}
                {deliveryAddress.district && ` ${deliveryAddress.district}. kerület`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Receipt className="w-5 h-5 mr-2" />
          Order Summary
        </h2>
        
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.quantity} × {formatPrice(item.price)}
                  {selectedDeliveryDates.length > 1 && (
                    <span className="text-blue-600 ml-2">
                      × {selectedDeliveryDates.length} delivery dates
                    </span>
                  )}
                </p>
              </div>
              <span className="font-medium text-gray-900">
                {formatPrice(item.price * (item.quantity || 1) * Math.max(selectedDeliveryDates.length, 1))}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Dates Section */}
        {selectedDeliveryDates.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-blue-900">
                Selected Delivery Dates ({selectedDeliveryDates.length})
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {selectedDeliveryDates.map((date, index) => (
                <div key={index} className="text-sm text-blue-800 bg-blue-100 rounded px-2 py-1">
                  {formatDateWithDay(date)}
                </div>
              ))}
            </div>
            {selectedDeliveryDates.length > 1 && (
              <p className="text-xs text-blue-700 mt-2">
                {selectedDeliveryDates.length} separate orders will be created
              </p>
            )}
          </div>
        )}

                  <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-900 font-medium">Subtotal (per order)</span>
              <span className="font-medium">{formatPrice(cartTotal)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Delivery (per order)</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">INGYEN</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            
            {selectedDeliveryDates.length > 1 && (
              <div className="flex justify-between">
                <span className="text-gray-900 font-medium">Number of orders</span>
                <span className="font-medium">{selectedDeliveryDates.length}</span>
              </div>
            )}
            
            {deliveryFee === 0 && (
              <p className="text-sm text-green-600">
                🎉 Ingyenes szállítás!
              </p>
            )}
          </div>

        {/* Delivery Selection inside Order Summary */}
        <div className="border-t pt-4 mt-4">
          <DeliverySelection
            subtotal={cartTotal}
            onDeliveryChange={handleDeliveryChange}
            selectedDeliveryId={deliveryMethod}
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
          {selectedDeliveryDates.length > 1 && (
            <div className="text-sm text-gray-500 mt-1 text-right">
              {formatPrice(singleOrderTotal)} × {selectedDeliveryDates.length} orders
            </div>
          )}
        </div>

        {/* Bank Transfer Payment Section */}
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
