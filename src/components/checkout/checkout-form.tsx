'use client';

import { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { CreditCard, ShoppingBag, Receipt } from 'lucide-react';
import { DeliverySelection } from './delivery-selection';
import { BankTransferPayment } from './bank-transfer-payment';

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
  const { items, cartTotal, emptyCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const finalTotal = cartTotal + deliveryFee;

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
                </p>
              </div>
              <span className="font-medium text-gray-900">
                {formatPrice(item.price * (item.quantity || 1))}
              </span>
            </div>
          ))}
        </div>

                  <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(cartTotal)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">INGYEN</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            
            {deliveryFee === 0 && (
              <p className="text-sm text-green-600">
                🎉 Ingyenes szállítás!
              </p>
            )}
          </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DeliverySelection
          subtotal={cartTotal}
          onDeliveryChange={handleDeliveryChange}
          selectedDeliveryId={deliveryMethod}
        />
      </div>

      {/* Bank Transfer Payment Section */}
      <BankTransferPayment
        amount={finalTotal}
        orderId={`TEMP-${Date.now()}`}
        userEmail={userEmail}
        onOrderConfirm={handleCheckout}
        isProcessing={isProcessing}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
