import React, { useState, useEffect, useRef, useMemo } from 'react';
import { OrderState, CONSTANTS, isHungarianHoliday } from '../../types/modern-shop';
import { formatCurrency, getDateFromIndex } from '../../lib/modern-shop-utils';
import { Clock, Snowflake, X, Gift, Info, Check } from 'lucide-react';

interface SelectionScreenProps {
  orderState: OrderState;
  updateOrder: (updates: Partial<OrderState>) => void;
  onNext: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ orderState, updateOrder, onNext }) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const schedulerRef = useRef<HTMLDivElement>(null);

  const PRESETS = [20, 30, 40, 50, 100];

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

  const calendarMonths = useMemo(() => {
    const today = new Date();
    const months: { year: number; month: number; name: string; weeks: (Date | null)[][] }[] = [];
    for (let m = 0; m < 3; m++) {
      const candidate = new Date(today.getFullYear(), today.getMonth() + m, 1);
      months.push(buildMonth(candidate.getFullYear(), candidate.getMonth()));
    }
    return months;
  }, []);

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
    return day === 1 || day === 2;
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
          Mennyi Rostit hozzunk<br /><span className="text-[#0B5D3F]">az irodába?</span>
        </h1>
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
                    ? 'border-[#0B5D3F] bg-[#EDF7F3] dark:bg-emerald-900/20 text-[#0B5D3F] transform scale-105 shadow-lg'
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
                  ? 'border-[#0B5D3F] bg-[#EDF7F3] dark:bg-emerald-900/20 text-[#0B5D3F] transform scale-105 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              EGYEDI
            </button>
          </div>

          {/* (I/c + I/d) Custom Quantity Slider with Edge Cases */}
          {orderState.isCustomQuantity && (
            <div className="mb-10 animate-fade-in text-left">
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-[2rem] py-6 px-6 sm:py-8 sm:px-8 flex flex-col gap-6">

                {/* Header and Input Row */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                  {/* Left: Title and Validation Messages */}
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">Egyedi mennyiség</h4>
                    {isCustomError ? (
                      <p className="text-xs font-bold text-red-500 transition-colors">20 és 300 palack között.</p>
                    ) : (
                      <p className="text-xs font-bold text-[#0B5D3F] transition-colors">Húzd a csúszkát vagy írd be!</p>
                    )}
                  </div>

                  {/* Right: Number Input */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className={`flex items-center justify-center bg-white border-2 rounded-2xl p-3 transition-all shadow-sm w-24 ${
                        isCustomError ? 'border-red-500' : 'border-[#0B5D3F]'
                    }`}>
                      <input
                          type="text"
                          inputMode="numeric"
                          value={orderState.quantity || ''}
                          onChange={handleCustomQtyChange}
                          className={`w-full text-xl font-black text-center outline-none bg-transparent leading-none ${
                              isCustomError ? 'text-red-900' : 'text-gray-900'
                          }`}
                      />
                    </div>
                    <span className="text-gray-400 font-bold uppercase text-[10px] sm:text-xs tracking-widest">Palack</span>
                  </div>
                </div>

                {/* Slider and Markers */}
                <div className="w-full pt-8 pb-1 relative">
                  {/* Free shipping marker at 60 (14.28%) */}
                  <div
                    className="absolute top-1 flex flex-col items-center pointer-events-none z-10"
                    style={{ left: '14.2857%', transform: 'translateX(-50%)' }}
                  >
                    <div className="bg-[#EDF7F3] p-1 rounded-full mb-1 shadow-sm">
                      <Gift size={10} className="text-[#0B5D3F]" />
                    </div>
                    <div className="w-0.5 h-2.5 bg-[#0B5D3F] opacity-40 rounded-full"></div>
                  </div>

                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="1"
                    value={orderState.quantity || 20}
                    onChange={(e) => updateOrder({ quantity: parseInt(e.target.value, 10) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B5D3F] relative z-20"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-1 uppercase tracking-widest relative">
                    <span>20 min</span>
                    <span className="absolute text-[#0B5D3F] opacity-80" style={{ left: '14.2857%', transform: 'translateX(-50%)' }}>60</span>
                    <span>300 max</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Bottom Bar - Summary */}
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
              {/* Left tooltip: FRISS ÉS NYERS ROSTI */}
              <div className="group relative inline-block">
                <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-2 cursor-help">
                  friss és nyers <span className="text-[#0B5D3F] font-black">Rosti</span>
                  <Info size={11} className="inline ml-1.5 text-gray-400 group-hover:text-[#0B5D3F] transition-colors" />
                </p>
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#063323] text-white p-4 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left transform origin-top-left translate-y-2 group-hover:translate-y-0">
                  <p className="text-[11px] font-black text-[#4ADE80] uppercase tracking-wider mb-2">Friss & Nyers</p>
                  <p className="text-[10px] leading-relaxed font-medium normal-case tracking-normal">
                    Kizárólag 5 féle nyers zöldséget, frissen facsart citromot, 100% natúr, préselt rostos almalét és szűrt vizet tartalmaz.
                  </p>
                  <p className="text-[10px] leading-relaxed font-medium normal-case tracking-normal mt-2">
                    Allergén: zeller.
                  </p>
                  <p className="text-[10px] leading-relaxed font-medium normal-case tracking-normal mt-2">
                    Semmi mesterséges adalék. Semmi tartósítószer. Friss és nyers.
                  </p>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-[#063323] transform rotate-45"></div>
                </div>
              </div>
            </div>
            <div className="text-right self-end sm:self-auto">
              {isCustomError ? (
                 <div className="text-4xl font-black text-gray-300 dark:text-gray-600 text-nowrap">-</div>
              ) : (
                 <div className="text-4xl font-black text-[#0B5D3F] text-nowrap">{formatCurrency(totalPrice)}</div>
              )}

              {!isCustomError && (
                  <div className="mt-1 flex justify-end">
                      {isFreeShipping ? (
                        <div className="group relative">
                             {/* Pulsating free shipping badge */}
                             <div className="text-[9px] uppercase tracking-widest flex items-center gap-1.5 font-black cursor-help">
                                <span className="bg-[#0B5D3F] text-white px-2 py-1 rounded-md animate-pulse">
                                  ✓ Ingyenes kiszállítás
                                </span>
                                <Snowflake size={11} strokeWidth={2.5} className="text-blue-500" />
                             </div>
                             {/* Hover Tooltip */}
                             <div className="absolute top-full right-0 mt-2 w-56 bg-[#063323] text-white p-4 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left transform origin-top-right translate-y-2 group-hover:translate-y-0">
                               <p className="text-[10px] leading-relaxed font-medium normal-case tracking-normal">
                                   A Rostikat mindig hűtve szállítjuk, hogy frissességüket tökéletesen megőrizzék. 60 palacktól a kiszállítást mi álljuk.
                               </p>
                               <div className="absolute -top-1 right-2 w-2 h-2 bg-[#063323] transform rotate-45"></div>
                           </div>
                        </div>
                      ) : (
                        <div className="group relative">
                           <div className="text-[9px] tracking-widest flex items-center gap-1.5 font-bold cursor-help">
                               <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">+ kiszállítás</span>
                               <Snowflake size={11} strokeWidth={2.5} className="text-blue-500" />
                           </div>
                           <div className="absolute top-full right-0 mt-2 w-56 bg-[#063323] text-white p-4 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left transform origin-top-right translate-y-2 group-hover:translate-y-0">
                               <p className="text-[10px] leading-relaxed font-medium normal-case tracking-normal">
                                   A Rostikat mindig hűtve szállítjuk, hogy frissességüket tökéletesen megőrizzék. 60 palacktól a kiszállítást mi álljuk.
                               </p>
                               <div className="absolute -top-1 right-2 w-2 h-2 bg-[#063323] transform rotate-45"></div>
                           </div>
                        </div>
                      )}
                  </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={isCustomError}
            className={`w-full font-black py-6 rounded-2xl text-xl mt-10 shadow-xl transition transform active:scale-[0.98] ${
                 isCustomError
                 ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                 : 'bg-[#0B5D3F] text-white hover:bg-[#147A55] hover:shadow-[#0B5D3F]/20'
            }`}
          >
            Kosárba teszem
          </button>
        </div>

        {/* (I/e) Calendar Section */}
        {showScheduler && (
          <div ref={schedulerRef} className="animate-fade-in scroll-mt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 text-left">
              <div>
                <h3 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight text-balance">
                  Mikor hozzuk a<br /><span className="text-[#0B5D3F]">friss Rostikat?</span>
                </h3>
              </div>
              <div className="flex flex-row items-center gap-3 w-full md:w-auto justify-end">
                {/* Clear Button */}
                {orderState.schedule.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllSelections}
                    className="group flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <span className="hidden sm:inline">Törlés</span>
                    <X size={14} strokeWidth={3} />
                  </button>
                )}

                {/* Recurring Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => toggleAllDay('mondays')}
                    disabled={allValidMondayIndices.length === 0}
                    className={`text-sm font-bold px-5 py-2.5 rounded-full border-2 transition-all text-nowrap text-center flex items-center justify-center gap-2
                      ${allValidMondayIndices.length === 0
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : isAllMondaysSelected
                          ? 'bg-[#0B5D3F] border-[#0B5D3F] text-white shadow-lg shadow-[#0B5D3F]/20 hover:bg-[#147A55]'
                          : 'bg-white dark:bg-gray-900 border-[#0B5D3F] text-[#0B5D3F] hover:bg-[#EDF7F3] dark:hover:bg-emerald-900/20'
                      }
                    `}
                  >
                    {isAllMondaysSelected && <Check size={16} strokeWidth={3} />}
                    <span>Minden hétfő</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAllDay('tuesdays')}
                    disabled={allValidTuesdayIndices.length === 0}
                    className={`text-sm font-bold px-5 py-2.5 rounded-full border-2 transition-all text-nowrap text-center flex items-center justify-center gap-2
                      ${allValidTuesdayIndices.length === 0
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : isAllTuesdaysSelected
                          ? 'bg-[#0B5D3F] border-[#0B5D3F] text-white shadow-lg shadow-[#0B5D3F]/20 hover:bg-[#147A55]'
                          : 'bg-white dark:bg-gray-900 border-[#0B5D3F] text-[#0B5D3F] hover:bg-[#EDF7F3] dark:hover:bg-emerald-900/20'
                      }
                    `}
                  >
                    {isAllTuesdaysSelected && <Check size={16} strokeWidth={3} />}
                    <span>Minden kedd</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm text-balance">

              {/* Calendar Month View - 3 Months */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {calendarMonths.map((monthData) => (
                  <div key={`${monthData.year}-${monthData.month}`} className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h4 className="text-center font-black uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-4 text-sm border-b border-gray-100 dark:border-gray-700 pb-2 capitalize">
                      {monthData.name}
                    </h4>

                    {/* Header Row - 5 Columns */}
                    <div className="grid grid-cols-5 mb-2">
                      {['H', 'K', 'Sz', 'Cs', 'P'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500">{d}</div>
                      ))}
                    </div>

                    {/* Days Grid - 5 Columns */}
                    <div className="space-y-2">
                      {monthData.weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="grid grid-cols-5 gap-y-2 gap-x-1">
                          {week.map((date, dayIdx) => {
                            if (!date) {
                              return <div key={`empty-${weekIdx}-${dayIdx}`} className="h-8" />;
                            }

                            const dayOfWeek = date.getDay();
                            const isDelivery = dayOfWeek === 1 || dayOfWeek === 2;
                            const isPast = isPastDate(date);
                            const isHoliday = isDateHoliday(date);
                            const isSelectable = isDateSelectable(date);
                            const isSelected = isDateSelected(date);

                            let cellClass = "h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold transition-all select-none ";

                            if (isHoliday) {
                              cellClass += "bg-red-50 dark:bg-red-900/20 text-red-400 cursor-not-allowed ring-1 ring-red-100 dark:ring-red-800";
                            } else if (isSelected) {
                              cellClass += "bg-[#0B5D3F] text-white shadow-md cursor-pointer transform scale-110";
                            } else if (isSelectable) {
                              cellClass += "bg-emerald-50 dark:bg-emerald-900/20 text-[#0B5D3F] hover:bg-[#0B5D3F] hover:text-white cursor-pointer ring-1 ring-emerald-100/50 dark:ring-emerald-800/50";
                            } else if (isPast && isDelivery) {
                              cellClass += "text-gray-300 dark:text-gray-600 cursor-default";
                            } else {
                              cellClass += "text-gray-300 dark:text-gray-600 cursor-default";
                            }

                            return (
                              <div key={date.toISOString()} className="flex justify-center relative group">
                                <div
                                  onClick={() => !isHoliday && isSelectable && toggleDateByDate(date)}
                                  className={cellClass}
                                >
                                  {date.getDate()}
                                </div>
                                {isHoliday && (
                                  <div className="absolute -top-8 bg-red-500 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap font-bold shadow-lg">
                                    Ünnepnap
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info bar */}
              <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 mb-8 text-balance">
                <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium text-left">
                   Jelenleg <strong>{orderState.schedule.length}</strong> szállítási nap van kijelölve.
                   {isFreeShipping && (
                     <span className="inline-flex items-center gap-1 ml-1">
                       Örömhír: 60 palacktól a szállítást mi álljuk.
                       <Gift size={12} className="text-blue-600 inline" />
                     </span>
                   )}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={onNext}
                disabled={orderState.schedule.length === 0}
                className={`w-full font-black py-6 rounded-2xl text-xl shadow-xl transition transform active:scale-[0.98] ${
                   orderState.schedule.length === 0
                   ? 'bg-gray-300 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                   : 'bg-[#0B5D3F] text-white hover:bg-[#147A55] hover:shadow-[#0B5D3F]/20'
                }`}
              >
                Tovább a számlázáshoz
              </button>

              {/* Deadline text - plain, no pill */}
              <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-2">
                      <Clock size={12} className="text-rose-800 dark:text-rose-400" strokeWidth={2.5} />
                      <span className="text-[11px] font-bold text-rose-900 dark:text-rose-300 text-center sm:text-left leading-tight">
                          Rendelési határidő: szállítást megelőző péntek 15:00
                      </span>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* (I/f) Segítsünk tervezni? Educational Box */}
        <div className="bg-[#EDF7F3] rounded-[2.5rem] p-8 text-[#0B5D3F] relative overflow-hidden shadow-lg text-balance text-left">
            <h3 className="text-2xl font-black mb-10 tracking-tight text-left relative z-10">Segítsünk tervezni?</h3>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

                {/* Left Column */}
                <div className="flex flex-col space-y-6">
                    <p className="text-base text-[#0B5D3F] leading-relaxed font-medium text-left">
                        A Rostikat kizárólag <strong className="font-extrabold">rendelésre</strong>, a kiszállítást megelőző este készítjük.
                    </p>
                    <p className="text-base text-[#0B5D3F] leading-relaxed font-medium text-left">
                        A frissen tisztított zöldségeket <strong className="font-extrabold">hőkezelés nélkül</strong> blendeljük, így megőrizzük a rost- és vitamintartalmat. Ezután azonnal 2°C-ra hűtjük, és hűtve visszük egyenesen az irodátokba.
                    </p>
                </div>

                {/* Right Column (asymmetric offset) */}
                <div className="flex flex-col space-y-6 md:-mt-8">
                    <p className="text-base text-[#0B5D3F] leading-relaxed font-medium text-left">
                        A Rosti egy nyers, tartósítószer-mentes, prémium zöldség-smoothie. Mivel friss termék, a csúcsminőséget a készítést követő <strong className="font-extrabold">60 órában</strong> garantáljuk.
                    </p>
                    <p className="text-base text-[#0B5D3F] leading-relaxed font-medium text-left">
                        A tudatos tervezéshez: a hétfői Rosti-csomag <strong className="font-extrabold">kedd estig</strong>, a keddi <strong className="font-extrabold">szerda nap végéig</strong> nyújtja a maximális élményt (2–4°C közötti tárolás mellett).
                    </p>
                </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D4E8E1] rounded-full"></div>
        </div>
      </div>
    </main>
  );
};

export default SelectionScreen;
