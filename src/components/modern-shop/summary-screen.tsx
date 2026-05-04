import React, { useState, useMemo } from 'react';
import { OrderState, CONSTANTS } from '../../types/modern-shop';
import { ChevronLeft, ChevronDown, Truck, Info, Snowflake, CheckCircle2, Check, X, Lock } from 'lucide-react';
import { formatCurrency, getDateFromIndex } from '../../lib/modern-shop-utils';

interface SummaryScreenProps {
  orderState: OrderState;
  updateOrder: (updates: Partial<OrderState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ orderState, updateOrder, onBack, onSubmit: _onSubmit, isSubmitting = false, submitError = null }) => {
  const { quantity, schedule, appliedCoupon, billingData } = orderState;
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Helper for formatting numbers without currency symbol
  const formatNumber = (amount: number): string => {
    return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  };

  // Calculate shipping fee based on tiers
  let baseShippingFee = 0;
  if (quantity < CONSTANTS.SHIPPING_TIER_BOUNDARY) {
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

  // Group dates by month
  const groupedDates = useMemo(() => {
    const grouped: Record<string, Date[]> = {};
    deliveryDates.forEach(date => {
      const monthKey = date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' });
      const formattedKey = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
      if (!grouped[formattedKey]) {
        grouped[formattedKey] = [];
      }
      grouped[formattedKey].push(date);
    });
    return grouped;
  }, [deliveryDates]);

  const handleToggleMonth = (monthKey: string) => {
    if (expandedMonth === monthKey) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(monthKey);
      setTimeout(() => {
        const element = document.getElementById(`month-group-${monthKey}`);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl text-left animate-fade-in flex-grow text-balance">
      <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-[#0B5D3F] mb-8 transition-colors group focus:outline-none">
        <ChevronLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Vissza a számlázáshoz
      </button>

      {/* PARTNER CODE SECTION */}
      <div className="mb-4 text-left">
         {!appliedCoupon ? (
            <div>
                 {!isCouponOpen ? (
                     <div className="flex justify-end">
                       <button
                          type="button"
                          onClick={() => setIsCouponOpen(true)}
                          className="text-xs font-bold text-[#0B5D3F] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-5 py-3 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800"
                       >
                           <span className="w-5 h-5 rounded-full border border-[#0B5D3F] flex items-center justify-center text-sm font-normal pb-0.5 leading-none">+</span>
                           Van partnerkódod?
                       </button>
                     </div>
                 ) : (
                     <div className="animate-fade-in bg-gray-50 dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 relative">
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-left">Partnerkód megadása</h3>
                             <button
                                type="button"
                                onClick={() => {
                                    setIsCouponOpen(false);
                                    setCouponInput('');
                                    setCouponMessage(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                             >
                                <X size={16} strokeWidth={2.5} />
                             </button>
                         </div>
                         <div className="flex flex-row gap-3 sm:gap-4">
                            <input
                                type="text"
                                placeholder="Írd be a partnerkódot"
                                value={couponInput}
                                onChange={(e) => {
                                    setCouponInput(e.target.value);
                                    setCouponMessage(null);
                                }}
                                className="flex-grow min-w-0 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={handleCouponValidate}
                                disabled={!couponInput}
                                className={`flex-shrink-0 px-6 sm:px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-sm
                                    ${couponInput
                                        ? 'bg-[#0B5D3F] text-white shadow-lg hover:bg-[#147A55] active:scale-95'
                                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                    }
                                `}
                            >
                                Érvényesítés
                            </button>
                         </div>

                         {couponMessage && (
                             <div className={`mt-3 text-xs font-bold flex items-center gap-2 ${couponMessage.type === 'success' ? 'text-[#0B5D3F]' : 'text-red-500'}`}>
                                 {couponMessage.type === 'success' ? <Check size={14} /> : <X size={14} />}
                                 {couponMessage.text}
                             </div>
                         )}
                     </div>
                 )}
            </div>
         ) : (
             <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl shadow-sm">
                 <div className="flex items-center gap-3">
                     <CheckCircle2 size={24} className="text-[#0B5D3F] flex-shrink-0" />
                     <div className="text-sm text-emerald-800 dark:text-emerald-300">
                         <span className="font-black">Siker! {formatCurrency(totalSavings)}-ot spóroltál.</span>
                         <span className="font-medium ml-1">Ez egy egészséges döntés volt!</span>
                     </div>
                 </div>
                 <button
                    type="button"
                    onClick={() => {
                        updateOrder({ appliedCoupon: undefined });
                        setCouponInput('');
                        setCouponMessage(null);
                        setIsCouponOpen(false);
                    }}
                    className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors p-2"
                 >
                     <X size={20} />
                 </button>
             </div>
         )}
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm mb-10 text-left relative overflow-visible">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="text-left">
              <h3 className="text-2xl font-black text-[#0B5D3F] tracking-tight leading-none">
                {deliveryDates.length} <span className="font-bold">kiszállítás</span>
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">beütemezve</p>
          </div>

          <div className="group relative z-20">
            <button className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-[#0B5D3F] transition-colors py-1">
              <Snowflake size={16} strokeWidth={2.5} className="text-blue-500" />
              <Truck size={16} strokeWidth={2.5} />
              <Info size={14} strokeWidth={2.5} />
            </button>

            <div className="absolute right-0 top-full mt-2 w-72 bg-[#063323] text-white p-5 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-gray-400">Hűtött kiszállítás díja</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">20-39 palack között</span>
                  <span className="font-bold">{formatCurrency(CONSTANTS.SHIPPING_FEE_HIGH)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">40-59 palack között</span>
                  <span className="font-bold">{formatCurrency(CONSTANTS.SHIPPING_FEE_LOW)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-medium">60 palacktól</span>
                  <span className="font-black uppercase tracking-wider">Ingyenes</span>
                </div>
              </div>
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#063323] transform rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Collapsible Months */}
        <div className="space-y-4">
          {Object.entries(groupedDates).map(([month, dates]) => {
            const isExpanded = expandedMonth === month;

            return (
              <div key={month} id={`month-group-${month}`} className="animate-fade-in border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                {/* Month Header */}
                <button
                  type="button"
                  onClick={() => handleToggleMonth(month)}
                  className={`w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isExpanded ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <h4 className="font-black text-gray-900 dark:text-gray-100 text-lg">
                    {month.replace(/^\d{4}\.\s*/, '')}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{dates.length} alkalom</span>
                    <div className={`w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#0B5D3F] border-[#0B5D3F]' : ''}`}>
                      <ChevronDown size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    {dates.map((d, i) => (
                      <div key={i} className={`flex items-center justify-between p-5 ${i !== dates.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                        {/* Date Column */}
                        <div className="flex items-center gap-4 w-1/3">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-gray-900 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-700 text-lg">
                            {d.getDate()}.
                          </div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {d.toLocaleDateString('hu-HU', { weekday: 'long' })}
                          </div>
                        </div>

                        {/* Center Column */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-1/3 text-center">
                          <span className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight">
                            {quantity} <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest mx-1">PALACK</span> <span className="text-[#0B5D3F] font-bold">Rosti</span>
                          </span>
                        </div>

                        {/* Price Column */}
                        <div className="text-right w-1/3 sm:w-1/3">
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              {priceDiscountApplied && (
                                <span className="text-xs font-medium line-through decoration-red-500 text-gray-400 dark:text-gray-500">
                                  {formatCurrency(originalItemTotal)}
                                </span>
                              )}
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-tight">{formatCurrency(itemTotal)}</span>
                            </div>
                            {shippingFee > 0 ? (
                              discountApplied ? (
                                <div className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                                  <span className="line-through">+ {formatCurrency(baseShippingFee)}</span>
                                  <span className="text-[#0B5D3F] font-bold ml-1">+ {formatCurrency(shippingFee)} kiszállítás</span>
                                </div>
                              ) : (
                                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">+ {formatCurrency(shippingFee)} kiszállítás</span>
                              )
                            ) : (
                              <span className="text-[10px] font-bold text-[#0B5D3F]">Ingyenes kiszállítás</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COST SUMMARY */}
      <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm text-balance text-left animate-fade-in mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Left: Breakdown Grid */}
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-[auto_1fr] gap-x-12 gap-y-3 items-baseline">
              {/* ROSTIK ROW */}
              <span className="text-sm font-bold text-[#0B5D3F]">Rosti csomagok</span>
              <div className="flex items-baseline justify-end gap-1.5">
                {deliveryDates.length > 1 && (
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                    {deliveryDates.length} x
                  </span>
                )}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {formatNumber(itemTotal)} Ft
                </span>
              </div>

              {/* SHIPPING ROW */}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">kiszállítás</span>
              <div className="flex items-baseline justify-end gap-1.5">
                {shippingFee === 0 ? (
                  <span className="bg-[#0B5D3F] text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                    ✓ Ingyenes
                  </span>
                ) : (
                  <>
                    {deliveryDates.length > 1 && (
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                        {deliveryDates.length} x
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {formatNumber(shippingFee)} Ft
                    </span>
                  </>
                )}
              </div>

              {/* SAVINGS ROW */}
              {totalSavings > 0 && (
                <>
                  <span className="text-xs font-bold text-[#0B5D3F] uppercase tracking-widest">Megtakarítás</span>
                  <span className="text-sm font-medium text-[#0B5D3F] text-right">{formatCurrency(totalSavings)}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: Total */}
          <div className="w-full md:w-auto text-left flex flex-col items-center md:items-end border-t md:border-t-0 border-gray-200 dark:border-gray-700 pt-6 md:pt-0">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">FIZETENDŐ</span>
            <div className="text-4xl font-black text-[#0B5D3F] leading-none">{formatCurrency(totalCost)}</div>
          </div>
        </div>
      </div>

      {/* TERMS CHECKBOX */}
      <div className="mb-6 flex justify-center">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
            />
            <div className={`w-5 h-5 border-2 rounded-md transition-all shadow-sm flex items-center justify-center
              ${termsAccepted
                ? 'bg-[#0B5D3F] border-[#0B5D3F]'
                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 group-hover:border-[#0B5D3F]/50'
              }
            `}>
              <Check className={`w-3.5 h-3.5 text-white transition-opacity ${termsAccepted ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium select-none group-hover:text-gray-700 dark:group-hover:text-gray-300">
            Elfogadom a weboldal <a href="/adatkezeles" className="text-[#0B5D3F] underline decoration-1 underline-offset-2 hover:text-[#147A55]">adatkezelési</a>- és <a href="/altalanos-szerzodesi-feltetelek" className="text-[#0B5D3F] underline decoration-1 underline-offset-2 hover:text-[#147A55]">felhasználási feltételeit</a>
          </span>
        </label>
      </div>

      {/* STRIPE PAYMENT BUTTON */}
      <div>
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{submitError}</p>
          </div>
        )}
        <button
          onClick={async () => {
            if (isRedirecting || isSubmitting) return;
            setIsRedirecting(true);
            try {
              const response = await fetch('/api/modern-shop/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderState }),
              });
              const data = await response.json();
              if (data.url) {
                sessionStorage.setItem('completed-order-state', JSON.stringify(orderState));
                window.location.href = data.url;
              } else {
                setIsRedirecting(false);
                alert('Hiba történt a fizetési munkamenet létrehozása során.');
              }
            } catch {
              setIsRedirecting(false);
              alert('Hiba történt a fizetési munkamenet létrehozása során.');
            }
          }}
          disabled={isRedirecting || isSubmitting}
          className={`w-full font-black py-6 rounded-2xl text-xl shadow-xl transition transform flex items-center justify-center gap-3 ${
            isRedirecting
              ? 'bg-[#0B5D3F] text-white cursor-wait opacity-90'
              : 'bg-[#0B5D3F] text-white hover:bg-[#147A55] active:scale-[0.98]'
          }`}
        >
          {isRedirecting ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Átirányítás a fizetéshez...</span>
            </>
          ) : (
            <>
              <Lock size={20} strokeWidth={2.5} />
              <span>Fizetés kártyával: {formatCurrency(totalCost)}</span>
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 dark:text-gray-500">
          <Lock size={12} />
          <span className="text-xs font-medium">Biztonságos, gyors fizetés Stripe-on keresztül</span>
        </div>
      </div>
    </main>
  );
};

export default SummaryScreen;
