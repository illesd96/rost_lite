'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, CreditCard, ArrowLeft } from 'lucide-react';

export default function MockPaymentPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Simulate successful payment
          router.push(`/checkout/success?orderId=${orderId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, orderId]);

  const handlePayNow = () => {
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  const handleCancel = () => {
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mock Payment Gateway
          </h1>
          
          <p className="text-gray-600 mb-6">
            This is a test payment page. In production, this would be Barion's payment interface.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Order ID:</p>
            <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
              {orderId}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handlePayNow}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Simulate Successful Payment
            </button>

            <button
              onClick={handleCancel}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Cancel & Return to Cart
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Auto-redirecting to success page in{' '}
              <span className="font-bold text-blue-600">{countdown}</span> seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
