'use client';

import { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { CreditCard, ShoppingBag, Receipt } from 'lucide-react';
import { DeliverySelection } from './delivery-selection';

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

      // Always try Barion first, fallback to mock if it fails
      console.log('🛒 Attempting Barion checkout...');
      
      const response = await fetch('/api/checkout/barion', {
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

      // Clear cart and redirect to Barion payment page
      emptyCart();
      window.location.href = result.gatewayUrl;
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

      {/* Payment Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment
        </h2>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Secure Payment with Barion</h3>
            <p className="text-sm text-blue-700">
              You will be redirected to Barion&apos;s secure payment gateway to complete your purchase.
              We accept all major credit cards and bank transfers.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              SSL encrypted secure payment
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              PCI DSS compliant
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Instant payment confirmation
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Payment confirmation will be sent to this email
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={isProcessing || items.length === 0}
          className="w-full flex items-center justify-center px-6 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay {formatPrice(finalTotal)} with Barion
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          By clicking &quot;Pay with Barion&quot;, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}
