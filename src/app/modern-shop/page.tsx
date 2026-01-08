'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import ModernHeader from '../../components/modern-shop/modern-header';
import PromoBar from '../../components/modern-shop/promo-bar';
import ProgressBar from '../../components/modern-shop/progress-bar';
import SelectionScreen from '../../components/modern-shop/selection-screen';
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
          <div className="container mx-auto px-6 py-12 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6">Bejelentkezés szükséges</h2>
            <p className="text-gray-600 mb-8">A rendelés folytatásához kérjük jelentkezz be.</p>
            <button 
              onClick={() => {
                updateOrder({ isLoggedIn: true });
                navigateTo('billing');
              }}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Bejelentkezés (Demo)
            </button>
            <button 
              onClick={() => navigateTo('selection')}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Vissza
            </button>
          </div>
        );
      case 'billing':
        return (
          <div className="container mx-auto px-6 py-12 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6">Számlázási adatok</h2>
            <p className="text-gray-600 mb-8">Ez a képernyő még fejlesztés alatt áll.</p>
            <button 
              onClick={() => navigateTo('summary')}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Tovább (Demo)
            </button>
            <button 
              onClick={() => navigateTo('selection')}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Vissza
            </button>
          </div>
        );
      case 'summary':
        return (
          <div className="container mx-auto px-6 py-12 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6">Összesítés és ütemezés</h2>
            <p className="text-gray-600 mb-8">Ez a képernyő még fejlesztés alatt áll.</p>
            <button 
              onClick={() => navigateTo('success')}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Rendelés leadása (Demo)
            </button>
            <button 
              onClick={() => navigateTo('billing')}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Vissza
            </button>
          </div>
        );
      case 'success':
        return (
          <div className="container mx-auto px-6 py-12 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-green-600">Sikeres rendelés!</h2>
            <p className="text-gray-600 mb-8">Köszönjük a rendelését!</p>
            <button 
              onClick={() => {
                setOrderState(INITIAL_STATE);
                navigateTo('selection');
              }}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Új rendelés
            </button>
          </div>
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
