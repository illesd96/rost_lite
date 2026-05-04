'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import SuccessScreen from '../../../components/modern-shop/success-screen';
import FailedScreen from '../../../components/modern-shop/failed-screen';
import { SiteNavbar } from '../../../components/ui/site-navbar';
import { OrderState } from '../../../types/modern-shop';

const INITIAL_STATE: OrderState = {
  quantity: 20,
  isCustomQuantity: false,
  schedule: [],
  isLoggedIn: false,
  billingData: {
    type: 'business',
    companyName: '',
    taxId: '',
    useGroupTaxId: false,
    firstName: '',
    lastName: '',
    billingAddress: {
      postcode: '',
      city: '',
      streetName: '',
      streetType: '',
      houseNum: ''
    },
    shippingAddress: {
      postcode: '',
      city: '',
      streetName: '',
      streetType: '',
      houseNum: ''
    },
    isShippingSame: true,
    contactName: '',
    contactPhone: '+36',
    useSecondaryContact: false,
    notifyMinutes: null
  },
  paymentPlan: 'full',
  paymentMethod: 'card'
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<OrderState>(INITIAL_STATE);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      router.push('/modern-shop');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/modern-shop/verify-payment?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setOrderNumber(data.orderNumber);

          // Reconstruct order state from server data (sessionStorage may not survive Stripe redirect)
          if (data.orderData) {
            setOrderState(prev => ({
              ...prev,
              quantity: data.orderData.quantity,
              schedule: Array.isArray(data.orderData.schedule) ? data.orderData.schedule : [],
              billingData: data.orderData.billingData ?? prev.billingData,
              paymentPlan: data.orderData.paymentPlan ?? prev.paymentPlan,
              paymentMethod: data.orderData.paymentMethod ?? prev.paymentMethod,
              appliedCoupon: data.orderData.appliedCoupon ?? undefined,
            }));
          }

          setStatus('success');

          localStorage.removeItem('modern-shop-state');
          localStorage.removeItem('modern-shop-screen');
          localStorage.removeItem('modern-shop-order-completed');
          localStorage.removeItem('modern-shop-completed-order-number');
          localStorage.removeItem('modern-shop-last-order-time');
          sessionStorage.removeItem('completed-order-state');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  const handleReset = () => {
    localStorage.removeItem('modern-shop-state');
    localStorage.removeItem('modern-shop-screen');
    localStorage.removeItem('modern-shop-order-completed');
    localStorage.removeItem('modern-shop-completed-order-number');
    localStorage.removeItem('modern-shop-last-order-time');
    sessionStorage.removeItem('completed-order-state');
    router.push('/modern-shop');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
        <Loader2 className="w-16 h-16 text-[#0B5D3F] animate-spin mb-6" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Fizetés ellenőrzése...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Kérjük, ne zárd be az ablakot.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <FailedScreen
          onRetry={() => router.back()}
          onBackToHome={() => router.push('/modern-shop')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SiteNavbar relative hideOrderCta />
      <SuccessScreen
        orderState={orderState}
        orderNumber={orderNumber}
        onReset={handleReset}
      />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B5D3F]"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
