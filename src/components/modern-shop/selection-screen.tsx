import React, { useState, useEffect, useRef, useMemo } from 'react';
import { OrderState, CONSTANTS, isHungarianHoliday } from '../../types/modern-shop';
import { formatCurrency, getDateFromIndex } from '../../lib/modern-shop-utils';
import { ChevronUp, ChevronDown, Clock, Snowflake, ArrowDown, X } from 'lucide-react';

interface SelectionScreenProps {
  orderState: OrderState;
  updateOrder: (updates: Partial<OrderState>) => void;
  onNext: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ orderState, updateOrder, onNext }) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const schedulerRef = useRef<HTMLDivElement>(null);
  
  const PRESETS = [20, 30, 40, 50, 100, ];

  const totalPrice = orderState.quantity * CONSTANTS.UNIT_PRICE;
  const isFreeShipping = orderState.quantity >= CONSTANTS.FREE_SHIPPING_THRESHOLD;
  
  // Validation logic
  const isCustomError = orderState.isCustomQuantity && (orderState.quantity < 20 || orderState.quantity > 300);

  // Helper: build calendar data for a given year/month
  const buildMonth = (year: number, month: number) => {
    const firstOfMonth = new Date(year, month, 1);
    const monthName = firstOfMonth.toLocaleDateString('hu-HU', { month: 'long' });
    const capitalizedName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    const firstDayOfWeek = firstOfMonth.getDay();
    let startOffset = 0;
    if (firstDayOfWeek !== 0 && firstDayOfWeek !== 6) startOffset = firstDayOfWeek - 1;

    for (let i = 0; i < startOffset; i++) currentWeek.push(null);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      currentWeek.push(date);
      if (dayOfWeek === 5) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 5) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    return { year, month, name: capitalizedName, weeks };
  };

  // Always show 3 months starting from current month (e.g. March, April, May when in March)
  const calendarMonths = useMemo(() => {
    const today = new Date();
    const months: { year: number; month: number; name: string; weeks: (Date | null)[][] }[] = [];
    for (let m = 0; m < 3; m++) {
      const candidate = new Date(today.getFullYear(), today.getMonth() + m, 1);
      months.push(buildMonth(candidate.getFullYear(), candidate.getMonth()));
    }
    return months;
  }, []);

  // Build date-to-index map through the end of the 3rd visible month (e.g. through May 31 when showing Mar/Apr/May)
  const dateToIndexMap = useMemo(() => {
    const today = new Date();
    const lastDayOfThirdMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const map = new Map<string, number>();
    for (let i = 0; i < 52; i++) {
      const mondayDate = getDateFromIndex(CONSTANTS.START_DATE, i);
      const tuesdayDate = getDateFromIndex(CONSTANTS.START_DATE, i + 100);
      if (mondayDate <= lastDayOfThirdMonth) map.set(mondayDate.toDateString(), i);
      if (tuesdayDate <= lastDayOfThirdMonth) map.set(tuesdayDate.toDateString(), i + 100);
    }
    return map;
  }, []);

  // Valid Monday/Tuesday indices within the visible 3 months only (not past, not holiday)
  const { allValidMondayIndices, allValidTuesdayIndices } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mondayIndices: number[] = [];
    const tuesdayIndices: number[] = [];

    for (const monthData of calendarMonths) {
      for (const week of monthData.weeks) {
        for (const date of week) {
          if (!date) continue;
          const day = date.getDay();
          if (day !== 1 && day !== 2) continue;
          if (date < today) continue;
          if (isHungarianHoliday(date)) continue;
          const index = dateToIndexMap.get(date.toDateString());
          if (index === undefined) continue;
          if (day === 1) mondayIndices.push(index);
          else tuesdayIndices.push(index);
        }
      }
    }

    return { allValidMondayIndices: mondayIndices, allValidTuesdayIndices: tuesdayIndices };
  }, [calendarMonths, dateToIndexMap]);

  const isAllMondaysSelected =
    allValidMondayIndices.length > 0 &&
    allValidMondayIndices.every(i => orderState.schedule.includes(i));

  const isAllTuesdaysSelected =
    allValidTuesdayIndices.length > 0 &&
    allValidTuesdayIndices.every(i => orderState.schedule.includes(i));

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

  const toggleDateByDate = (date: Date) => {
    const index = dateToIndexMap.get(date.toDateString());
    if (index !== undefined) {
      toggleDateIndex(index);
    }
  };

  const toggleAllDay = (type: 'mondays' | 'tuesdays') => {
    const targetIndices = type === 'mondays' ? allValidMondayIndices : allValidTuesdayIndices;
    const allSelected = type === 'mondays' ? isAllMondaysSelected : isAllTuesdaysSelected;

    if (allSelected) {
      updateOrder({ schedule: orderState.schedule.filter(i => !targetIndices.includes(i)) });
    } else {
      const merged = new Set([...orderState.schedule, ...targetIndices]);
      updateOrder({ schedule: Array.from(merged) });
    }
  };

  const isDeliveryDay = (date: Date) => {
    const day = date.getDay();
    return day === 1 || day === 2; // Monday (1) or Tuesday (2)
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    const index = dateToIndexMap.get(date.toDateString());
    return index !== undefined && orderState.schedule.includes(index);
  };

  const isDateHoliday = (date: Date) => {
    return isHungarianHoliday(date);
  };

  const clearAllSelections = () => {
    updateOrder({ schedule: [] });
  };

  const isDateSelectable = (date: Date) => {
    return isDeliveryDay(date) && !isPastDate(date) && !isDateHoliday(date) && dateToIndexMap.has(date.toDateString());
  };

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl text-left animate-fade-in flex-grow">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 text-gray-900 dark:text-gray-100 tracking-tight leading-tight text-balance">
          Mennyi Rostit hozzunk<br /><span className="text-green-600">az irodába?</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Bökj rá egy számra, vagy adj meg egyedi mennyiséget.</p>
      </div>

      <div className="flex flex-col gap-10">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm text-balance">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10 text-left">
            {PRESETS.map(q => (
              <button
                key={q}
                onClick={() => handleQtySelect(q)}
                className={`qty-button p-5 rounded-2xl font-black text-xl border-2 transition-all ${
                  !orderState.isCustomQuantity && orderState.quantity === q
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 transform scale-105 shadow-emerald-500/10 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {q}
              </button>
            ))}
            <button
              onClick={toggleCustom}
              className={`qty-button special p-5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all uppercase tracking-wider ${
                orderState.isCustomQuantity
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 transform scale-105 shadow-emerald-500/10 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              EGYEDI
            </button>
          </div>

          {orderState.isCustomQuantity && (
            <div className="mb-10 animate-fade-in text-left">
              <div className="bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">Egyedi mennyiség 20 és 300 palack között</h4>
                  {isCustomError ? (
                    <p className="text-xs font-bold text-red-500 transition-colors">Adj meg egy egész számot 20 és 300 között.</p>
                  ) : (
                    <p className="text-xs font-bold text-emerald-600 transition-colors">Kiváló mennyiség!</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center bg-white dark:bg-gray-900 border-2 rounded-2xl pl-5 pr-2 h-[72px] transition-all ${
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
                            isCustomError ? 'text-red-900' : 'text-gray-900 dark:text-gray-100'
                        }`}
                      />
                      <div className="flex flex-col gap-0.5 ml-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-800">
                          <button onClick={handleIncrement} className="w-8 h-5 flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 rounded-lg text-gray-400 dark:text-gray-500 hover:text-green-600 transition-all shadow-sm hover:shadow-md active:scale-95">
                              <ChevronUp size={16} strokeWidth={3} />
                          </button>
                          <button onClick={handleDecrement} className="w-8 h-5 flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 rounded-lg text-gray-400 dark:text-gray-500 hover:text-green-600 transition-all shadow-sm hover:shadow-md active:scale-95">
                              <ChevronDown size={16} strokeWidth={3} />
                          </button>
                      </div>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500 font-bold uppercase text-sm tracking-widest">Palack</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-10 sm:gap-6 border border-gray-100 dark:border-gray-800 text-balance">
            <div className="text-left self-start sm:self-auto">
              <div className="flex items-baseline gap-2 text-nowrap">
                {isCustomError ? (
                   <span className="text-6xl font-black text-gray-300 dark:text-gray-600 tracking-tighter">-</span>
                ) : (
                   <span className="text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">{orderState.quantity}</span>
                )}
                <span className="text-gray-500 dark:text-gray-400 font-bold ml-2 uppercase text-sm tracking-widest">Palack</span>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-2">friss és nyers <span className="text-green-700 font-black">Rosti</span></p>
            </div>
            <div className="text-right self-end sm:self-auto">
              {/* <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Csomagár</div> */}
              {isCustomError ? (
                 <div className="text-4xl font-black text-gray-300 dark:text-gray-600 text-nowrap">-</div>
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
                               <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">+ SZÁLLÍTÁS</span>
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
                 ? 'bg-gray-300 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                 : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/20'
            }`}
          >
            Kosárba teszem
          </button>
        </div>

        {showScheduler && (
          <div ref={schedulerRef} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in text-balance scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 text-left">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Mikor érkezzen <span className="text-green-600">a frissesség?</span></h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Válassz szállítási napokat. Hamarosan szerdánként is!</p>
              </div>
              <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                {orderState.schedule.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllSelections}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition uppercase tracking-wider"
                  >
                    Törlés
                    <X size={14} strokeWidth={2.5} />
                  </button>
                )}
                <button 
                    type="button"
                    onClick={() => toggleAllDay('mondays')} 
                    disabled={allValidMondayIndices.length === 0}
                    className={`flex-1 md:flex-none text-[9px] sm:text-[10px] font-black px-4 sm:px-6 py-3 rounded-full border-2 transition uppercase tracking-wider sm:tracking-widest text-nowrap text-center
                        ${allValidMondayIndices.length === 0
                            ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : isAllMondaysSelected
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-700 text-emerald-700'
                              : 'bg-white dark:bg-gray-900 border-emerald-700 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        }
                    `}
                >
                    Minden hétfő
                </button>
                <button 
                    type="button"
                    onClick={() => toggleAllDay('tuesdays')} 
                    disabled={allValidTuesdayIndices.length === 0}
                    className={`flex-1 md:flex-none text-[9px] sm:text-[10px] font-black px-4 sm:px-6 py-3 rounded-full border-2 transition uppercase tracking-wider sm:tracking-widest text-nowrap text-center
                        ${allValidTuesdayIndices.length === 0
                            ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : isAllTuesdaysSelected
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-700 text-emerald-700'
                              : 'bg-white dark:bg-gray-900 border-emerald-700 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        }
                    `}
                >
                    Minden kedd
                </button>
              </div>
            </div>

            {/* Calendar Month View - 3 Months */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              {calendarMonths.map((monthData) => (
                <div key={`${monthData.year}-${monthData.month}`} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                  {/* Month Header */}
                  <h4 className="text-center font-bold text-gray-900 dark:text-gray-100 mb-5 text-lg">
                    {monthData.name}
                  </h4>
                  
                  {/* Day Headers - Weekdays only */}
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {['H', 'K', 'Sz', 'Cs', 'P'].map((day, i) => (
                      <div 
                        key={day + i} 
                        className={`text-center text-xs font-bold py-1 ${
                          i === 0 || i === 1 ? 'text-emerald-700' : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Weeks */}
                  <div className="space-y-2">
                    {monthData.weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="grid grid-cols-5 gap-2">
                        {week.map((date, dayIdx) => {
                          if (!date) {
                            return <div key={`empty-${weekIdx}-${dayIdx}`} className="aspect-square" />;
                          }
                          
                          const dayOfWeek = date.getDay();
                          const isMonday = dayOfWeek === 1;
                          const isTuesday = dayOfWeek === 2;
                          const isDelivery = isMonday || isTuesday;
                          const isPast = isPastDate(date);
                          const isHoliday = isDateHoliday(date);
                          const isSelectable = isDateSelectable(date);
                          const isSelected = isDateSelected(date);
                          
                          return (
                            <button
                              key={date.toISOString()}
                              type="button"
                              onClick={() => isSelectable && toggleDateByDate(date)}
                              disabled={!isSelectable}
                              className={`
                                aspect-square rounded-full flex items-center justify-center text-sm font-semibold transition-all
                                ${isHoliday 
                                  ? 'bg-red-50 dark:bg-red-900/20 text-red-300 cursor-not-allowed' 
                                  : isSelected
                                    ? 'bg-emerald-700 text-white shadow-sm'
                                    : isSelectable
                                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                                      : isPast && isDelivery
                                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                        : 'text-gray-400 dark:text-gray-500 cursor-default'
                                }
                              `}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 mb-8 text-balance">
              <span className="text-blue-700 dark:text-blue-400 font-bold text-lg shrink-0">ⓘ</span>
              <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium text-left">
                 Jelenleg <strong>{orderState.schedule.length}</strong> szállítási nap van kijelölve.
                 {isFreeShipping && ' Örömhír: 50 palacktól a szállítást mi álljuk. 🚚'}
              </div>
            </div>
            
            <button
              onClick={onNext}
              disabled={orderState.schedule.length === 0}
              className={`w-full font-black py-6 rounded-2xl text-xl shadow-xl transition transform active:scale-[0.98] ${
                 orderState.schedule.length === 0
                 ? 'bg-gray-300 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                 : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/20'
              }`}
            >
              {orderState.isLoggedIn ? 'Tovább a számlázáshoz' : 'Jelentkezz be és tovább a számlázáshoz'}
            </button>

            <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border border-rose-100 shadow-sm">
                    <Clock size={12} className="text-rose-800 dark:text-rose-400" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold text-rose-900 dark:text-rose-300 uppercase tracking-widest text-center sm:text-left leading-tight">
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


