import React, { useState } from 'react';
import { OrderState, CONSTANTS } from '../../types/modern-shop';
import { ChevronLeft, Truck, Info, Snowflake, CreditCard, Banknote, CheckCircle2, Check, X } from 'lucide-react';
import { formatCurrency, getDateFromIndex } from '../../lib/modern-shop-utils';

interface SummaryScreenProps {
  orderState: OrderState;
  updateOrder: (updates: Partial<OrderState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ orderState, updateOrder, onBack, onSubmit, isSubmitting = false, submitError = null }) => {
  const { quantity, schedule, paymentPlan, paymentMethod, appliedCoupon, billingData } = orderState;
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Calculate shipping fee based on tiers
  let baseShippingFee = 0;
  if (quantity <= 25) {
    baseShippingFee = CONSTANTS.SHIPPING_FEE_HIGH;
  } else if (quantity < CONSTANTS.FREE_SHIPPING_THRESHOLD) {
    baseShippingFee = CONSTANTS.SHIPPING_FEE_LOW;
  } else {
    baseShippingFee = 0;
  }

  // Apply Coupon Logic
  const standardPartnerCodes = ['teszt114db', 'mastercard1234'];
  
  let unitPrice = CONSTANTS.UNIT_PRICE;
  let shippingFee = baseShippingFee;
  let discountApplied = false;
  let priceDiscountApplied = false;
  
  if (appliedCoupon) {
      // Standard Partner Codes
      if (standardPartnerCodes.includes(appliedCoupon)) {
          if (baseShippingFee > 1700) {
              shippingFee = 1700;
              discountApplied = true;
          }
      } 
      // Private Special Code
      else if (appliedCoupon === 'private1234') {
          const isPrivate = billingData.type === 'private';
          const isQtyValid = quantity <= 20;
          
          // Apply discounts only if conditions are still met
          if (isPrivate && isQtyValid) {
              unitPrice = 1250;
              priceDiscountApplied = true;
              
              if (baseShippingFee > 1700) {
                  shippingFee = 1700;
                  discountApplied = true;
              }
          }
      }
  }

  const handleCouponValidate = async () => {
      const trimmedInput = couponInput.trim();
      
      if (!trimmedInput) return;

      try {
        const response = await fetch('/api/modern-shop/validate-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            couponCode: trimmedInput,
            userType: billingData.type,
            quantity: quantity
          })
        });

        const result = await response.json();

        if (result.valid) {
          updateOrder({ appliedCoupon: trimmedInput });
          setCouponMessage({ type: 'success', text: result.message });
        } else {
          setCouponMessage({ type: 'error', text: result.message });
        }
      } catch (error) {
        console.error('Coupon validation error:', error);
        setCouponMessage({ type: 'error', text: 'Hiba történt a partnerkód ellenőrzése során.' });
      }
  };

  const itemTotal = quantity * unitPrice;
  const originalItemTotal = quantity * CONSTANTS.UNIT_PRICE;
  const deliveryTotal = itemTotal + shippingFee;

  // Use numeric sort, but handle the 100 offset logic correctly if needed for date sorting
  const sortedSchedule = [...schedule].sort((a, b) => {
    const dateA = getDateFromIndex(CONSTANTS.START_DATE, a);
    const dateB = getDateFromIndex(CONSTANTS.START_DATE, b);
    return dateA.getTime() - dateB.getTime();
  });

  const deliveryDates = sortedSchedule.map(idx => getDateFromIndex(CONSTANTS.START_DATE, idx));

  const totalCost = deliveryTotal * deliveryDates.length;

  // Calculate Savings
  const originalOneTimeTotal = (quantity * CONSTANTS.UNIT_PRICE) + baseShippingFee;
  const originalTotalCost = originalOneTimeTotal * deliveryDates.length;
  const totalSavings = originalTotalCost - totalCost;

  // Monthly grouping
  const months: Record<string, number> = {};
  deliveryDates.forEach(d => {
    const key = d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' });
    months[key] = (months[key] || 0) + 1;
  });

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl text-left animate-fade-in flex-grow text-balance">
      <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-700 mb-8 transition-colors group focus:outline-none">
        <ChevronLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Vissza a számlázáshoz
      </button>

      <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-10 text-left">Összesítés és fizetés ütemezése</h2>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm mb-10 text-left relative overflow-visible">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-left">Választott szállítási napok</h3>
          
          <div className="group relative z-20">
            <button className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors py-1">
              <Snowflake size={16} strokeWidth={2.5} className="text-blue-500" />
              <Truck size={16} strokeWidth={2.5} />
              <Info size={14} strokeWidth={2.5} />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white p-5 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-gray-400">Szállítási díj alkalmanként</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">10-25 palack között</span>
                  <span className="font-bold">{formatCurrency(CONSTANTS.SHIPPING_FEE_HIGH)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">26-49 palack között</span>
                  <span className="font-bold">{formatCurrency(CONSTANTS.SHIPPING_FEE_LOW)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-medium">50 palack felett</span>
                  <span className="font-black uppercase tracking-wider">Ingyenes</span>
                </div>
              </div>
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {deliveryDates.map((d, i) => (
            <div key={i} className="grid grid-cols-3 p-5 bg-gray-50 rounded-2xl border border-gray-100 h-full">
              {/* Left Column: Date */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                  <span className="text-sm font-bold text-gray-900">
                    {d.toLocaleDateString('hu-HU', { month: 'long' })} {d.getDate()}.
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-400 pl-[18px] mt-0.5 lowercase">
                    {d.toLocaleDateString('hu-HU', { weekday: 'long' })}
                </div>
              </div>

              {/* Center Column: Quantity (Top Row) */}
              <div className="flex justify-center pt-0.5">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{quantity} PALACK</span>
              </div>

              {/* Right Column: Price & Shipping */}
              <div className="text-right flex flex-col items-end gap-0.5">
                <div className="flex flex-col items-end">
                    {priceDiscountApplied && (
                         <span className="text-[10px] font-medium line-through decoration-red-500 decoration-[1px] text-gray-400 leading-none mb-0.5">
                             {formatCurrency(originalItemTotal)}
                         </span>
                    )}
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm font-black text-green-700 leading-tight">{formatCurrency(itemTotal)}</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-0.5">
                  {shippingFee > 0 ? (
                    discountApplied ? (
                      <>
                        <div className="flex items-center justify-end gap-1 text-gray-400">
                          <span className="text-[10px] font-medium line-through decoration-red-500 decoration-[1px]">+ {formatCurrency(baseShippingFee)}</span>
                          <Truck size={11} strokeWidth={2.5} />
                          <Snowflake size={11} strokeWidth={2.5} className="text-blue-500" />
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600 leading-none">
                            partner ár: {formatCurrency(shippingFee)}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <span className="text-[10px] font-medium">+ {formatCurrency(shippingFee)}</span>
                        <Truck size={11} strokeWidth={2.5} />
                        <Snowflake size={11} strokeWidth={2.5} className="text-blue-500" />
                      </div>
                    )
                  ) : (
                    <div className="text-green-600 flex items-center justify-end gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider">INGYENES SZÁLLÍTÁS</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PARTNER CODE SECTION - COMPACT */}
      <div className="mb-10">
         <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-left mb-4">Partnerkód megadása</h3>

         {!appliedCoupon ? (
             <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="Írd be a partnerkódot"
                    value={couponInput}
                    onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponMessage(null);
                    }}
                    className="flex-grow p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-gray-700 placeholder:text-gray-400 shadow-sm"
                />
                <button 
                    onClick={handleCouponValidate}
                    disabled={!couponInput}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-sm
                        ${couponInput 
                            ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95' 
                            : 'bg-white border border-gray-200 text-gray-300 cursor-not-allowed'
                        }
                    `}
                >
                    Érvényesítés
                </button>
             </div>
         ) : (
             <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                 <div className="flex items-center gap-3">
                     <CheckCircle2 size={24} className="text-emerald-600" />
                     <div>
                         <div className="font-bold text-emerald-800 text-sm">{appliedCoupon}</div>
                         <div className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide">Partnerkód aktív</div>
                         {totalSavings > 0 && (
                            <div className="text-xs font-black text-emerald-700 mt-1">
                                {formatCurrency(totalSavings)} kedvezmény!
                            </div>
                         )}
                     </div>
                 </div>
                 <button 
                    onClick={() => {
                        updateOrder({ appliedCoupon: undefined });
                        setCouponInput('');
                        setCouponMessage(null);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 transition-colors p-2"
                 >
                     <X size={20} />
                 </button>
             </div>
         )}
         
         {couponMessage && !appliedCoupon && (
             <div className={`mt-3 text-xs font-bold flex items-center gap-2 ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                 {couponMessage.type === 'success' ? <Check size={14} /> : <X size={14} />}
                 {couponMessage.text}
             </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 text-left">
        {[
          { id: 'full', label: 'Egyben előre', desc: 'Egyetlen számla készül.\nA teljes megrendelt időszak teljesítése előre, egy fizetéssel.', letter: 'A', color: 'emerald' },
          { id: 'monthly', label: 'Havonta előre', desc: 'Havonta egy számla készül.\nAz adott havi adagok pénzügyi teljesítése minden hónap elején, előre.', letter: 'B', color: 'blue' },
          { id: 'delivery', label: 'Szállításonként', desc: 'Minden alkalommal külön számla készül.\nMinden szállítás pénzügyi rendezése alkalmanként, előre.', letter: 'C', color: 'purple' }
        ].map(plan => (
          <div 
            key={plan.id}
            onClick={() => updateOrder({ paymentPlan: plan.id as any })}
            className={`cursor-pointer transition-all border-2 p-6 rounded-[2rem] text-left relative
                ${paymentPlan === plan.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}
            `}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 text-left font-bold text-xs transition-colors
                ${plan.id === 'full' ? 'bg-emerald-100 text-emerald-600' : plan.id === 'monthly' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}
            `}>
                {plan.letter}
            </div>
            <h4 className="font-black text-gray-900 uppercase text-xs mb-2 text-left">{plan.label}</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed text-left whitespace-pre-line">{plan.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 text-balance text-left animate-fade-in mb-10">
         {paymentPlan === 'full' && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto text-left">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Fizetési ütemezés: Egyben előre</span>
                    <div className="text-xl font-bold text-gray-800 leading-tight">
                        {deliveryDates.length} szállítás {deliveryDates.length} hétre<br />
                        <span className="font-medium opacity-0 select-none">placeholder</span>
                    </div>
                </div>
                <div className="w-full md:w-auto text-center md:text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Mindösszesen fizetendő</span>
                    <div className="text-4xl font-black text-green-700">{formatCurrency(totalCost)}</div>
                </div>
            </div>
         )}
         {paymentPlan === 'monthly' && (
             <div className="space-y-8">
                {Object.keys(months).map(m => (
                    <div key={m} className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                        <div className="w-full md:w-auto text-left">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{m}</span>
                            <div className="text-xl font-bold text-gray-800 leading-tight">
                                {months[m]} szállítás {months[m]} hétre<br />
                                <span className="font-medium">alkalmanként {formatCurrency(deliveryTotal)}</span>
                            </div>
                        </div>
                        <div className="w-full md:w-auto text-center md:text-right">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Havi fizetendő</span>
                            <div className="text-4xl font-black text-green-700">{formatCurrency(months[m] * deliveryTotal)}</div>
                        </div>
                    </div>
                ))}
             </div>
         )}
         {paymentPlan === 'delivery' && (
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto text-left">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Fizetési ütemezés: Szállításonként</span>
                    <div className="text-xl font-bold text-gray-800 leading-tight">
                        {deliveryDates.length} szállítás {deliveryDates.length} hétre<br />
                        <span className="font-medium">mindösszesen {formatCurrency(totalCost)}</span>
                    </div>
                </div>
                <div className="w-full md:w-auto text-center md:text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Alkalmanként fizetendő</span>
                    <div className="text-4xl font-black text-green-700">{formatCurrency(deliveryTotal)}</div>
                </div>
             </div>
         )}
      </div>

      {/* Payment Method Selector */}
      <div className="mb-10">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-left mb-4">Fizetési mód</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Transfer Option */}
            <div 
                onClick={() => updateOrder({ paymentMethod: 'transfer' })}
                className={`cursor-pointer relative p-5 rounded-2xl border-2 transition-all flex items-center gap-4
                    ${paymentMethod === 'transfer' 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                `}
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${paymentMethod === 'transfer' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}
                `}>
                    <CreditCard size={24} strokeWidth={2} />
                </div>
                <div>
                    <div className={`font-black uppercase text-xs mb-1 ${paymentMethod === 'transfer' ? 'text-gray-900' : 'text-gray-700'}`}>
                        Átutalás
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Szállítást megelőzően
                    </div>
                </div>
            </div>

            {/* Cash Option */}
            <div 
                onClick={() => updateOrder({ paymentMethod: 'cash' })}
                className={`cursor-pointer relative p-5 rounded-2xl border-2 transition-all flex items-center gap-4
                    ${paymentMethod === 'cash' 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                `}
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${paymentMethod === 'cash' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}
                `}>
                    <Banknote size={24} strokeWidth={2} />
                </div>
                <div>
                    <div className={`font-black uppercase text-xs mb-1 ${paymentMethod === 'cash' ? 'text-gray-900' : 'text-gray-700'}`}>
                        Készpénz
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Fizetés a futárnál
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div>
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm font-medium">{submitError}</p>
          </div>
        )}
        <button 
          onClick={() => {
            if (!isSubmitting) {
              onSubmit();
            }
          }} 
          disabled={isSubmitting}
          className={`w-full font-black py-6 rounded-2xl text-xl shadow-xl transition transform ${
            isSubmitting 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Rendelés feldolgozása...
            </div>
          ) : (
            'Rendelés leadása'
          )}
        </button>
      </div>
    </main>
  );
};

export default SummaryScreen;
