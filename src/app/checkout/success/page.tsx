'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We've received your payment.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>
            {orderDetails && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Confirmed
              </span>
            )}
          </div>

          <div className="space-y-3">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">#{orderId.slice(0, 8)}</span>
              </div>
            )}
            
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-gray-900">{paymentId.slice(0, 12)}...</span>
              </div>
            )}

            {orderDetails && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium text-gray-900">
                    {orderDetails.totalPriceHuf?.toLocaleString()} Ft
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium text-gray-900">
                    {orderDetails.deliveryMethod || 'Standard Delivery'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <Package className="w-6 h-6 text-blue-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                What happens next?
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• We'll prepare your order for shipping</li>
                <li>• You'll get tracking information once shipped</li>
                <li>• Estimated delivery: 2-5 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Order Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
          
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            View All Orders
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@webshop.com" className="text-primary-600 hover:underline">
              support@webshop.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}