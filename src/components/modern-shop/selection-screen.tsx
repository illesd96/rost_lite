import React, { useState, useEffect, useRef } from 'react';
import { OrderState, CONSTANTS } from '../../types/modern-shop';
import { formatCurrency, getMondayDate, getDateFromIndex, isSameDay } from '../../lib/modern-shop-utils';
import { ChevronUp, ChevronDown, Clock, Snowflake, ArrowDown } from 'lucide-react';

interface SelectionScreenProps {
  orderState: OrderState;
  updateOrder: (updates: Partial<OrderState>) => void;
  onNext: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ orderState, updateOrder, onNext }) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [expandDates, setExpandDates] = useState(false);
  const schedulerRef = useRef<HTMLDivElement>(null);
  
  const PRESETS = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100];
  const WEEKS = Array.from({ length: 12 }, (_, i) => i);

  const totalPrice = orderState.quantity * CONSTANTS.UNIT_PRICE;
  const isFreeShipping = orderState.quantity >= CONSTANTS.FREE_SHIPPING_THRESHOLD;
  
  // Validation logic
  const isCustomError = orderState.isCustomQuantity && (orderState.quantity < 20 || orderState.quantity > 300);

  // Helper to calculate currently visible valid indices (Mondays + Tuesdays) excluding holidays
  const getVisibleValidIndices = () => {
    const limit = expandDates ? 12 : 6;
    const indices: number[] = [];
    
    for (let i = 0; i < limit; i++) {
        // Monday index
        indices.push(i);
        // Tuesday index
        indices.push(i + 100);
    }

    // Filter out holidays
    return indices.filter(idx => {
        const date = getDateFromIndex(CONSTANTS.START_DATE, idx);
        return !isSameDay(date, CONSTANTS.HOLIDAY_DATE);
    });
  };

  const visibleValidIndices = getVisibleValidIndices();

  // Check if "Recurring" is selected based on visible indices
  // It is selected if the order schedule has items, and exactly matches the visible valid indices
  const isRecurringSelected = 
    orderState.schedule.length > 0 &&
    orderState.schedule.length === visibleValidIndices.length &&
    visibleValidIndices.every(i => orderState.schedule.includes(i));

  const isOneTimeSelected = orderState.schedule.length === 1 && orderState.schedule[0] === 0;

  const handleQtySelect = (q: number) => {
    updateOrder({ quantity: q, isCustomQuantity: false });
  };

  const handleCustomQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanVal = e.target.value.replace(/[^0-9]/g, '');
    const val = cleanVal === '' ? 0 : parseInt(cleanVal, 10);
    updateOrder({ quantity: val });
  };

  const handleIncrement = () => {
    updateOrder({ quantity: (orderState.quantity || 0) + 1 });
  };

  const handleDecrement = () => {
    const current = orderState.quantity || 0;
    if (current > 0) {
      updateOrder({ quantity: current - 1 });
    }
  };

  const toggleCustom = () => {
    updateOrder({ isCustomQuantity: true, quantity: 150 });
  };

  const handleAddToCart = () => {
    setShowScheduler(true);
    setTimeout(() => {
      schedulerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const toggleDateIndex = (index: number) => {
    const newSchedule = orderState.schedule.includes(index)
      ? orderState.schedule.filter(i => i !== index)
      : [...orderState.schedule, index];
    updateOrder({ schedule: newSchedule });
  };

  const setSchedule = (type: 'once' | 'recurring') => {
    if (type === 'once') {
      updateOrder({ schedule: [0] }); // Select first Monday
    } else {
      // Select all currently visible valid dates (Mondays & Tuesdays)
      updateOrder({ schedule: visibleValidIndices });
    }
  };

  const renderDateCard = (weekIndex: number, isTuesday: boolean) => {
    // Tuesday indices are shifted by 100
    const actualIndex = isTuesday ? weekIndex + 100 : weekIndex;
    const date = getDateFromIndex(CONSTANTS.START_DATE, actualIndex);
    const isHoliday = isSameDay(date, CONSTANTS.HOLIDAY_DATE);
    const isSelected = orderState.schedule.includes(actualIndex);
    const dayName = isTuesday ? 'Kedd' : 'Hétfő';

    return (
      <div
        key={actualIndex}
        onClick={() => !isHoliday && toggleDateIndex(actualIndex)}
        className={`relative p-3 sm:p-4 rounded-xl text-center font-bold text-xs border-2 transition-all cursor-pointer select-none flex flex-col items-center justify-center min-h-[80px]
          ${isHoliday 
            ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed pattern-diagonal-lines' 
            : isSelected 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm transform scale-[1.02]' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }
        `}
      >
         {isHoliday && (
            <span className="absolute top-1 right-1.5 text-[7px] font-black text-red-400 uppercase tracking-wider">Ünnep</span>
         )}
         {!isHoliday && !isSelected && (
            <span className="absolute top-1 right-1.5 text-[7px] font-black text-gray-300 uppercase tracking-wider">Kihagyva</span>
         )}
         <div className="text-[10px] sm:text-xs mb-1 text-nowrap">{date.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' })}</div>
         <div className={`text-[8px] uppercase font-black tracking-wider ${isTuesday ? 'text-indigo-400' : 'text-emerald-600/60'}`}>{dayName}</div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl text-left animate-fade-in flex-grow">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 text-gray-900 tracking-tight leading-tight text-balance">
          Mennyi Rostit hozzunk<br /><span className="text-green-600">az irodába?</span>
        </h1>
        <p className="text-gray-500 text-lg">Bökj rá egy számra, vagy adj meg egyedi mennyiséget.</p>
      </div>

      <div className="flex flex-col gap-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm text-balance">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10 text-left">
            {PRESETS.map(q => (
              <button
                key={q}
                onClick={() => handleQtySelect(q)}
                className={`qty-button p-5 rounded-2xl font-black text-xl border-2 transition-all ${
                  !orderState.isCustomQuantity && orderState.quantity === q
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 transform scale-105 shadow-emerald-500/10 shadow-lg'
                    : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                {q}
              </button>
            ))}
            <button
              onClick={toggleCustom}
              className={`qty-button special p-5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all uppercase tracking-wider ${
                orderState.isCustomQuantity
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 transform scale-105 shadow-emerald-500/10 shadow-lg'
                  : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              EGYEDI
            </button>
          </div>

          {orderState.isCustomQuantity && (
            <div className="mb-10 animate-fade-in text-left">
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Egyedi mennyiség 20 és 300 palack között</h4>
                  {isCustomError ? (
                    <p className="text-xs font-bold text-red-500 transition-colors">Adj meg egy egész számot 20 és 300 között.</p>
                  ) : (
                    <p className="text-xs font-bold text-emerald-600 transition-colors">Kiváló mennyiség!</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center bg-white border-2 rounded-2xl pl-5 pr-2 h-[72px] transition-all ${
                        isCustomError
                        ? 'border-red-500' 
                        : 'border-green-600'
                    }`}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={orderState.quantity || ''}
                        onChange={handleCustomQtyChange}
                        className={`w-24 text-3xl font-black text-center outline-none bg-transparent leading-none ${
                            isCustomError ? 'text-red-900' : 'text-gray-900'
                        }`}
                      />
                      <div className="flex flex-col gap-0.5 ml-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                          <button onClick={handleIncrement} className="w-8 h-5 flex items-center justify-center hover:bg-white rounded-lg text-gray-400 hover:text-green-600 transition-all shadow-sm hover:shadow-md active:scale-95">
                              <ChevronUp size={16} strokeWidth={3} />
                          </button>
                          <button onClick={handleDecrement} className="w-8 h-5 flex items-center justify-center hover:bg-white rounded-lg text-gray-400 hover:text-green-600 transition-all shadow-sm hover:shadow-md active:scale-95">
                              <ChevronDown size={16} strokeWidth={3} />
                          </button>
                      </div>
                  </div>
                  <span className="text-gray-400 font-bold uppercase text-sm tracking-widest">Palack</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-10 sm:gap-6 border border-gray-100 text-balance">
            <div className="text-left self-start sm:self-auto">
              <div className="flex items-baseline gap-2 text-nowrap">
                {isCustomError ? (
                   <span className="text-6xl font-black text-gray-300 tracking-tighter">-</span>
                ) : (
                   <span className="text-6xl font-black text-gray-900 tracking-tighter">{orderState.quantity}</span>
                )}
                <span className="text-gray-500 font-bold ml-2 uppercase text-sm tracking-widest">Palack</span>
              </div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">friss és nyers <span className="text-green-700 font-black">Rosti</span></p>
            </div>
            <div className="text-right self-end sm:self-auto">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Csomagár</div>
              {isCustomError ? (
                 <div className="text-4xl font-black text-gray-300 text-nowrap">-</div>
              ) : (
                 <div className="text-4xl font-black text-green-700 text-nowrap">{formatCurrency(totalPrice)}</div>
              )}
              
              {!isCustomError && (
                  <div className="mt-1 flex justify-end">
                      {isFreeShipping ? (
                        <div className="group relative">
                             <div className="text-[9px] uppercase tracking-widest flex items-center gap-1.5 font-black cursor-help">
                                <span className="text-green-600 animate-pulse">✓ Ingyenes szállítás</span>
                                <Snowflake size={11} strokeWidth={2.5} className="text-blue-500" />
                             </div>
                             <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 text-white p-4 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left transform origin-top-right translate-y-2 group-hover:translate-y-0">
                               <p className="text-[10px] leading-relaxed font-medium normal-case tracking-normal">
                                   A Rostikat mindig hűtve szállítjuk, hogy frissességüket tökéletesen megőrizzék.
                               </p>
                               <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                           </div>
                        </div>
                      ) : (
                        <div className="group relative">
                           <div className="text-[9px] uppercase tracking-widest flex items-center gap-1.5 font-bold cursor-help">
                               <span className="text-gray-400 group-hover:text-blue-500 transition-colors">+ SZÁLLÍTÁS</span>
                               <Snowflake size={11} strokeWidth={2.5} className="text-blue-500" />
                           </div>
                           <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 text-white p-4 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left transform origin-top-right translate-y-2 group-hover:translate-y-0">
                               <p className="text-[10px] leading-relaxed font-medium normal-case tracking-normal">
                                   A Rostikat mindig hűtve szállítjuk, hogy frissességüket tökéletesen megőrizzék.
                               </p>
                               <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                           </div>
                        </div>
                      )}
                  </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isCustomError}
            className={`w-full font-black py-6 rounded-2xl text-xl mt-10 shadow-xl transition transform active:scale-[0.98] ${
                 isCustomError
                 ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                 : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/20'
            }`}
          >
            Kosárba teszem
          </button>
        </div>

        {showScheduler && (
          <div ref={schedulerRef} className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm animate-fade-in text-balance scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 text-left">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Mikor érkezzen <span className="text-green-600">a frissesség?</span></h3>
                <p className="text-sm text-gray-500 whitespace-nowrap">Válassz szállítási napokat. Hamarosan keddenként is!</p>
              </div>
              <div className="flex flex-row gap-2 w-full md:w-auto">
                <button 
                    onClick={() => setSchedule('once')} 
                    className={`flex-1 md:flex-none text-[8px] sm:text-[10px] font-black px-2 sm:px-5 py-2.5 rounded-full border-2 transition uppercase tracking-wider sm:tracking-widest text-nowrap text-center
                        ${isOneTimeSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-600'
                            : 'bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                        }
                    `}
                >
                    Egyszeri szállítás
                </button>
                <button 
                    onClick={() => setSchedule('recurring')} 
                    className={`flex-1 md:flex-none text-[8px] sm:text-[10px] font-black px-2 sm:px-5 py-2.5 rounded-full border-2 transition uppercase tracking-wider sm:tracking-widest text-nowrap text-center
                        ${isRecurringSelected
                            ? 'bg-purple-50 border-purple-800 text-purple-800'
                            : 'bg-white border-purple-800 text-purple-800 hover:bg-purple-50'
                        }
                    `}
                >
                    Ismétlődő szállítás
                </button>
              </div>
            </div>

            {/* Calendar Grid Section */}
            <div className="space-y-8 mb-8 text-left">
                {/* First 6 Weeks */}
                <div className="space-y-2">
                    {/* Mondays Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {WEEKS.slice(0, 6).map(i => renderDateCard(i, false))}
                    </div>
                    {/* Tuesdays Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {WEEKS.slice(0, 6).map(i => renderDateCard(i, true))}
                    </div>
                </div>

                {/* Elegant Expander */}
                <div className="relative h-6 flex items-center justify-center">
                    <div className="absolute inset-x-0 top-1/2 border-t border-gray-100"></div>
                    <button 
                        onClick={() => setExpandDates(!expandDates)}
                        className="relative z-10 bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm rounded-full px-4 py-1 flex items-center gap-2 transition-all hover:shadow-md group"
                    >
                         <span className="text-[9px] font-black uppercase tracking-widest">
                             {expandDates ? 'Kevesebb időpont' : 'További időpontok mutatása'}
                         </span>
                         {expandDates 
                            ? <ChevronUp size={12} strokeWidth={3} className="group-hover:-translate-y-0.5 transition-transform" /> 
                            : <ChevronDown size={12} strokeWidth={3} className="group-hover:translate-y-0.5 transition-transform" />
                         }
                    </button>
                </div>

                {/* Next 6 Weeks (Conditional) */}
                {expandDates && (
                    <div className="space-y-2 animate-fade-in">
                        {/* Mondays Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {WEEKS.slice(6, 12).map(i => renderDateCard(i, false))}
                        </div>
                        {/* Tuesdays Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {WEEKS.slice(6, 12).map(i => renderDateCard(i, true))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-8 text-balance">
              <span className="text-blue-700 font-bold text-lg shrink-0">ⓘ</span>
              <div className="text-xs text-blue-800 leading-relaxed font-medium text-left">
                 Jelenleg <strong>{orderState.schedule.length}</strong> szállítási nap van kijelölve.
                 {isFreeShipping && ' Örömhír: 50 palacktól a szállítást mi álljuk. 🚚'}
              </div>
            </div>
            
            <button
              onClick={onNext}
              disabled={orderState.schedule.length === 0}
              className={`w-full font-black py-6 rounded-2xl text-xl shadow-xl transition transform active:scale-[0.98] ${
                 orderState.schedule.length === 0
                 ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                 : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/20'
              }`}
            >
              Tovább a számlázáshoz
            </button>

            <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-rose-100 shadow-sm">
                    <Clock size={12} className="text-rose-800" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold text-rose-900 uppercase tracking-widest text-center sm:text-left leading-tight">
                        RENDELÉSI HATÁRIDŐ:<br className="block sm:hidden" /> SZÁLLÍTÁST MEGELŐZŐ PÉNTEK 15:00
                    </span>
                </div>
            </div>
          </div>
        )}

        <div className="bg-green-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-lg text-balance text-left">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h3 className="text-2xl font-black mb-6 tracking-tight uppercase text-left">Segítsünk tervezni?</h3>
                    <p className="text-sm text-green-50 leading-relaxed font-medium text-left">A Rostikat minden alkalommal frissen, nyers zöldségből készítjük a kiszállítást megelőző éjszaka. Azonnal 2°C-ra hűtjük őket, így érkeznek meg hozzátok reggel.</p>
                </div>
                <div className="flex flex-col justify-end">
                    <p className="text-sm text-green-50 leading-relaxed font-medium text-left">Ideális tárolással, 2 és 4°C között a Rostik felbontás nélkül akár 3 napig megőrzik kirobbanó frissességüket. Kevésbé hideg hűtőben tárolva javasoljuk az elfogyasztást 48-60 órán belül.</p>
                    <div className="h-4"></div>
                    <p className="text-sm text-green-50 leading-relaxed font-medium text-left">Ne feledd, minden frissen készül, ráadásul a legegészségesebb, nyers zöldségekből.</p>
                </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-green-700/30 rounded-full opacity-50"></div>
        </div>
      </div>
    </main>
  );
};

export default SelectionScreen;
