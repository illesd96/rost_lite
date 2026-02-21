'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SuccessScreen from '../../../components/modern-shop/success-screen';
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

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<OrderState>(INITIAL_STATE);

  useEffect(() => {
    // Get order number from URL params or localStorage
    const urlOrderNumber = searchParams.get('orderNumber');
    const storedOrderNumber = localStorage.getItem('modern-shop-completed-order-number');
    
    if (urlOrderNumber) {
      setOrderNumber(urlOrderNumber);
    } else if (storedOrderNumber) {
      setOrderNumber(storedOrderNumber);
    } else {
      // No order number found, redirect to shop
      router.push('/modern-shop');
      return;
    }

    // Load completed order state from sessionStorage
    const completedOrderState = sessionStorage.getItem('completed-order-state');
    if (completedOrderState) {
      try {
        const parsedOrderState = JSON.parse(completedOrderState);
        setOrderState(parsedOrderState);
      } catch (error) {
        console.error('Failed to parse completed order state:', error);
      }
    }
  }, [searchParams, router]);

  // Utility function to clear all modern shop localStorage data
  const clearAllModernShopStorage = () => {
    localStorage.removeItem('modern-shop-state');
    localStorage.removeItem('modern-shop-screen');
    localStorage.removeItem('modern-shop-order-completed');
    localStorage.removeItem('modern-shop-completed-order-number');
    localStorage.removeItem('modern-shop-last-order-time');
  };

  const handleReset = () => {
    // Clear all localStorage data
    clearAllModernShopStorage();
    // Clear sessionStorage data
    sessionStorage.removeItem('completed-order-state');
    
    // Redirect to shop
    router.push('/modern-shop');
  };

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SuccessScreen 
        orderState={orderState} 
        orderNumber={orderNumber}
        onReset={handleReset}
      />
    </div>
  );
}

export default function ModernShopSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
