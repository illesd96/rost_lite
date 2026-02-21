'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  paymentPlan: 'full',
  paymentMethod: 'card',
  appliedCoupon: undefined
};

// Utility function to clear all modern shop localStorage data
const clearAllModernShopStorage = () => {
  localStorage.removeItem('modern-shop-state');
  localStorage.removeItem('modern-shop-screen');
  localStorage.removeItem('modern-shop-order-completed');
  localStorage.removeItem('modern-shop-completed-order-number');
  localStorage.removeItem('modern-shop-last-order-time');
};

export default function ModernShopPage() {
  const { data: session, status } = useSession();
  const [screen, setScreen] = useState<ScreenType>('selection');
  const [orderState, setOrderState] = useState<OrderState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderCreating, setIsOrderCreating] = useState(false);
  const [orderCreationError, setOrderCreationError] = useState<string | null>(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  const [completedOrderState, setCompletedOrderState] = useState<OrderState | null>(null);
  const orderSubmissionRef = useRef(false);

  // Load state from localStorage and session
  useEffect(() => {
    const loadState = async () => {
      try {
        // Check if an order was just completed
        const orderCompleted = localStorage.getItem('modern-shop-order-completed');
        const completedOrderNumber = localStorage.getItem('modern-shop-completed-order-number');
        const lastOrderTime = localStorage.getItem('modern-shop-last-order-time');
        
        // If order was completed recently (within 2 minutes), show success screen
        const now = Date.now();
        const twoMinutesAgo = now - (2 * 60 * 1000);
        
        console.log('Checking order completion:', {
          orderCompleted,
          completedOrderNumber,
          lastOrderTime,
          now,
          twoMinutesAgo,
          isRecent: lastOrderTime && parseInt(lastOrderTime) > twoMinutesAgo
        });
        
        if (orderCompleted === 'true' && completedOrderNumber && lastOrderTime && parseInt(lastOrderTime) > twoMinutesAgo) {
          console.log('Showing success screen for recent order:', completedOrderNumber);
          // Show success screen with completed order
          setCreatedOrderNumber(completedOrderNumber);
          setScreen('success');
          setOrderState(INITIAL_STATE);
          // Clear the flags immediately to prevent loops
          localStorage.removeItem('modern-shop-order-completed');
          localStorage.removeItem('modern-shop-completed-order-number');
          localStorage.removeItem('modern-shop-last-order-time');
          setIsLoading(false);
          return;
        }
        
        // If order completion flags exist but are old, clear them
        if (orderCompleted === 'true') {
          console.log('Clearing old order completion flags');
          localStorage.removeItem('modern-shop-order-completed');
          localStorage.removeItem('modern-shop-completed-order-number');
          localStorage.removeItem('modern-shop-last-order-time');
        }
        
        // Load from localStorage
        const savedState = localStorage.getItem('modern-shop-state');
        const savedScreen = localStorage.getItem('modern-shop-screen');
        
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setOrderState(prev => ({ ...prev, ...parsedState }));
        }
        
        if (savedScreen && ['selection', 'billing', 'summary'].includes(savedScreen)) {
          setScreen(savedScreen as ScreenType);
        }

        // Update login status based on session
        if (status !== 'loading') {
          setOrderState(prev => ({ 
            ...prev, 
            isLoggedIn: !!session?.user 
          }));

          // Load user billing data if logged in
          if (session?.user) {
            try {
              const response = await fetch('/api/modern-shop/billing-data');
              if (response.ok) {
                const { billingData } = await response.json();
                if (billingData) {
                  setOrderState(prev => ({ 
                    ...prev, 
                    billingData: { ...prev.billingData, ...billingData }
                  }));
                }
              }
            } catch (error) {
              console.error('Failed to load billing data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, [session, status]);

  // Save state to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('modern-shop-state', JSON.stringify(orderState));
      localStorage.setItem('modern-shop-screen', screen);
    }
  }, [orderState, screen, isLoading]);

  const updateOrder = (updates: Partial<OrderState>) => {
    setOrderState(prev => ({ ...prev, ...updates }));
  };

  const updateBilling = (updates: Partial<BillingData>) => {
    const newBillingData = { ...orderState.billingData, ...updates };
    setOrderState(prev => ({
      ...prev,
      billingData: newBillingData
    }));
    
    // Save to backend
    saveBillingData(newBillingData);
  };

  const navigateTo = (s: ScreenType) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const handleStepClick = (step: number) => {
    const stepToScreen: Record<number, ScreenType> = {
      1: 'selection',
      2: 'billing', 
      3: 'summary'
    };
    
    const targetScreen = stepToScreen[step];
    if (targetScreen) {
      // Only allow navigation if user is logged in for billing/summary
      if ((targetScreen === 'billing' || targetScreen === 'summary') && !orderState.isLoggedIn) {
        navigateTo('login');
      } else {
        navigateTo(targetScreen);
      }
    }
  };

  const saveBillingData = async (billingData: BillingData) => {
    if (session?.user) {
      try {
        await fetch('/api/modern-shop/billing-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billingData })
        });
      } catch (error) {
        console.error('Failed to save billing data:', error);
      }
    }
  };

  const handleOrderSubmit = useCallback(async () => {
    // Prevent multiple submissions using ref (React strict mode protection)
    if (orderSubmissionRef.current) {
      console.log('Order submission already in progress (ref check), ignoring duplicate call');
      return;
    }
    
    // Prevent multiple submissions using state
    if (isOrderCreating) {
      console.log('Order creation already in progress (state check), ignoring duplicate call');
      return;
    }
    
    // Check if order was already completed recently
    const lastOrderTime = localStorage.getItem('modern-shop-last-order-time');
    const now = Date.now();
    if (lastOrderTime && (now - parseInt(lastOrderTime)) < 5000) { // 5 second cooldown
      console.log('Order submitted too recently, ignoring duplicate');
      return;
    }
    
    // Set both ref and state to prevent duplicates
    orderSubmissionRef.current = true;
    setIsOrderCreating(true);
    setOrderCreationError(null);
    setCreatedOrderNumber(null);
    
    // Record submission time
    localStorage.setItem('modern-shop-last-order-time', now.toString());

    try {
      const response = await fetch('/api/modern-shop/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderState }),
      });

      const result = await response.json();

      if (response.ok) {
        setCreatedOrderNumber(result.orderNumber);
        // Store the completed order state in sessionStorage for the success page
        sessionStorage.setItem('completed-order-state', JSON.stringify(orderState));
        setCompletedOrderState(orderState);
        // Clear ALL localStorage data immediately to prevent any loops
        clearAllModernShopStorage();
        
        // Clear the order state to prevent resubmission
        setOrderState(INITIAL_STATE);
        
        // Redirect to dedicated success page to prevent reload issues
        window.location.href = `/modern-shop/success?orderNumber=${result.orderNumber}`;
        return;
      } else {
        setOrderCreationError(result.message || 'Hiba történt a rendelés létrehozása során.');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setOrderCreationError('Hiba történt a rendelés létrehozása során.');
    } finally {
      setIsOrderCreating(false);
      orderSubmissionRef.current = false;
    }
  }, [isOrderCreating, orderState]);

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
            onLogin={() => navigateTo('billing')} 
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
            onSubmit={handleOrderSubmit} 
            isSubmitting={isOrderCreating}
            submitError={orderCreationError}
          />
        );
      case 'success':
        return (
          <SuccessScreen 
            orderState={completedOrderState || orderState} 
            orderNumber={createdOrderNumber}
            onReset={() => {
              setOrderState(INITIAL_STATE);
              setCreatedOrderNumber(null);
              setCompletedOrderState(null);
              clearAllModernShopStorage();
              navigateTo('selection');
            }} 
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {screen !== 'login' && <PromoBar />}
      <ModernHeader 
        onLogoClick={() => navigateTo('selection')} 
        isLoggedIn={!!session?.user}
        onToggleAuth={() => {}} // Will be handled by real auth
        currentScreen={screen}
        session={session}
      />
      
      {showProgressBar && (
        <ProgressBar 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
          canNavigate={true}
        />
      )}
      
      {renderScreen()}
    </div>
  );
}
