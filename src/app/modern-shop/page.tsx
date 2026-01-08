'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import ModernHeader from '../../components/modern-shop/modern-header';
import PromoBar from '../../components/modern-shop/promo-bar';
import ProgressBar from '../../components/modern-shop/progress-bar';
import SelectionScreen from '../../components/modern-shop/selection-screen';
import BillingScreen from '../../components/modern-shop/billing-screen';
import SummaryScreen from '../../components/modern-shop/summary-screen';
import LoginScreen from '../../components/modern-shop/login-screen';
import SuccessScreen from '../../components/modern-shop/success-screen';
import { OrderState, ScreenType, BillingData } from '../../types/modern-shop';

const INITIAL_BILLING: BillingData = {
  type: 'business',
  companyName: '',
  taxId: '',
  useGroupTaxId: false,
  firstName: '',
  lastName: '',
  billingAddress: { postcode: '', city: '', streetName: '', streetType: '', houseNum: '' },
  shippingAddress: { postcode: '', city: '', streetName: '', streetType: '', houseNum: '' },
  isShippingSame: true,
  contactName: '',
  contactPhone: '+36',
  useSecondaryContact: false,
  notifyMinutes: null
};

const INITIAL_STATE: OrderState = {
  quantity: 20,
  isCustomQuantity: false,
  schedule: [],
  isLoggedIn: false,
  billingData: INITIAL_BILLING,
  paymentPlan: 'monthly',
  paymentMethod: 'transfer',
  appliedCoupon: undefined
};

export default function ModernShopPage() {
  const { data: session } = useSession();
  const [screen, setScreen] = useState<ScreenType>('selection');
  const [orderState, setOrderState] = useState<OrderState>({
    ...INITIAL_STATE,
    isLoggedIn: !!session?.user
  });

  const updateOrder = (updates: Partial<OrderState>) => {
    setOrderState(prev => ({ ...prev, ...updates }));
  };

  const updateBilling = (updates: Partial<BillingData>) => {
    setOrderState(prev => ({
      ...prev,
      billingData: { ...prev.billingData, ...updates }
    }));
  };

  const navigateTo = (s: ScreenType) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  // Progress Bar Logic
  let currentStep = 0;
  let showProgressBar = false;

  if (screen === 'billing') {
    currentStep = 2; // Számlázás
    showProgressBar = true;
  } else if (screen === 'summary') {
    currentStep = 3; // Ütemezés
    showProgressBar = true;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'selection':
        return (
          <SelectionScreen 
            orderState={orderState} 
            updateOrder={updateOrder} 
            onNext={() => navigateTo(orderState.isLoggedIn ? 'billing' : 'login')} 
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onLogin={() => {
              updateOrder({ isLoggedIn: true });
              navigateTo('billing');
            }} 
            onBack={() => navigateTo('selection')} 
          />
        );
      case 'billing':
        return (
          <BillingScreen 
            orderState={orderState} 
            updateBilling={updateBilling} 
            onBack={() => navigateTo('selection')} 
            onNext={() => navigateTo('summary')} 
          />
        );
      case 'summary':
        return (
          <SummaryScreen 
            orderState={orderState} 
            updateOrder={updateOrder} 
            onBack={() => navigateTo('billing')} 
            onSubmit={() => navigateTo('success')} 
          />
        );
      case 'success':
        return (
          <SuccessScreen 
            orderState={orderState} 
            onReset={() => {
              setOrderState(INITIAL_STATE);
              navigateTo('selection');
            }} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {screen !== 'login' && <PromoBar />}
      <ModernHeader 
        onLogoClick={() => navigateTo('selection')} 
        isLoggedIn={orderState.isLoggedIn}
        onToggleAuth={() => updateOrder({ isLoggedIn: !orderState.isLoggedIn })}
        currentScreen={screen} 
      />
      
      {showProgressBar && <ProgressBar currentStep={currentStep} />}
      
      {renderScreen()}
    </div>
  );
}
