import React, { useState, useEffect } from 'react';
import { OrderState, CONSTANTS } from '../../types/modern-shop';
import { Check, Copy, MessageSquare, CheckCircle2, ChevronDown, ChevronUp, Calendar, Download, Loader2 } from 'lucide-react';
import { getDateFromIndex } from '../../lib/modern-shop-utils';

interface SuccessScreenProps {
  orderState: OrderState;
  orderNumber: string | null;
  onReset: () => void;
}

// Order creation result interface removed - orders are now created in summary screen

const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderState, orderNumber, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showDates, setShowDates] = useState(false);
  // Order creation is now handled in the summary screen, not here
  // This component just displays the success message with the provided order number

  // Helper for thousands separator with non-breaking space
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  };

  // Calculate sorted schedule
  const sortedSchedule = [...orderState.schedule].sort((a, b) => {
    const dateA = getDateFromIndex(CONSTANTS.START_DATE, a);
    const dateB = getDateFromIndex(CONSTANTS.START_DATE, b);
    return dateA.getTime() - dateB.getTime();
  });
  const deliveryDates = sortedSchedule.map(idx => getDateFromIndex(CONSTANTS.START_DATE, idx));
  
  // Calculate first delivery date
  const firstDeliveryDate = deliveryDates.length > 0 ? deliveryDates[0] : new Date();

  // Date formatting with suffix logic
  const day = firstDeliveryDate.getDate();
  // Remove dot from end of toLocaleDateString result
  const dateBase = firstDeliveryDate.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' }).replace(/\.$/, '');
  
  // Hungarian suffix logic (-én, -án, -jén)
  let suffix = '-én';
  const dayStr = day.toString();
  if ([1].includes(day)) {
    suffix = '-jén';
  } else if ([2, 3, 6, 8, 13, 16, 18, 20, 23, 26, 28, 30].includes(day)) {
    suffix = '-án';
  } else {
    suffix = '-én';
  }
  
  const formattedDate = `${dateBase}${suffix}`;
  
  // Format weekday (e.g. "hétfő")
  const weekday = firstDeliveryDate.toLocaleDateString('hu-HU', { weekday: 'long' });

  // The pre-written message
  const shareMessage = `Sziasztok! 🥕🥦\n\nJó hír: érkezik a friss Rosti a csapatnak! 🥤\n${formattedDate}, ${weekday} kerülnek a hűtőbe a nyers zöldségből készült szuper smoothiek.\n\nSiessetek, mert gyorsan fogy! ⚡`;

  const handleCopy = () => {
      navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  // Calendar ICS Generation
  const handleDownloadCalendar = () => {
    let icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rosti//Delivery Schedule//HU
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

    const formatICSDate = (date: Date, hours: number, minutes: number) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        const h = hours.toString().padStart(2, '0');
        const min = minutes.toString().padStart(2, '0');
        return `${y}${m}${d}T${h}${min}00`;
    };

    deliveryDates.forEach(date => {
        const start = formatICSDate(date, 8, 30);
        const end = formatICSDate(date, 11, 30);
        const now = formatICSDate(new Date(), 0, 0); // simplified DTSTAMP

        icsContent += 
`BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
DTSTAMP:${now}Z
SUMMARY:Rosti szállítás 🥕
DESCRIPTION:A friss Rosti adagok érkezése az irodai hűtőbe.
LOCATION:Iroda konyha
STATUS:CONFIRMED
TRANSP:TRANSPARENT
BEGIN:VALARM
TRIGGER:-PT70H
ACTION:DISPLAY
DESCRIPTION:Rosti módosítási határidő (Péntek 15:00)
END:VALARM
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Rosti érkezés hamarosan
END:VALARM
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'rosti_szallitasok.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Collect emails to display
  const emails = [
    'hello@teceged.hu', // Placeholder for the main account email as it is not persisted in this demo state
    orderState.billingData.emailCC1,
    orderState.billingData.emailCC2
  ].filter(Boolean);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fade-in flex-grow text-balance">
      
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-start justify-center">
          
          {/* Main Success Card */}
          <div className="w-full lg:w-2/3 bg-white rounded-[3rem] border border-gray-200 shadow-2xl p-10 md:p-16 relative overflow-hidden text-balance text-left order-2 lg:order-1">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="w-10 h-10" strokeWidth={3} />
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase text-center">Sikeres rendelés!</h2>
            <p className="text-gray-500 text-lg mb-10 text-center">A friss Rostik a választott napokon érkeznek hozzátok.</p>
            
            <div className="bg-gray-50 rounded-3xl p-8 mb-8 text-left border border-gray-100 text-balance">
                {/* Order ID */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rendelési szám</span>
                    <span className="text-sm font-bold text-gray-900">
                      {orderNumber ? `#${orderNumber}` : '#ROSTI-2026-0119'}
                    </span>
                </div>

                {/* Delivery Count with Dropdown */}
                <div className="border-b border-gray-200 mb-4 pb-4 transition-all">
                    <button 
                        onClick={() => setShowDates(!showDates)}
                        className="w-full flex justify-between items-center group focus:outline-none"
                    >
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors text-left">
                            Szállítások száma
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{orderState.schedule.length} alkalom</span>
                            <div className={`text-gray-400 group-hover:text-emerald-600 transition-colors bg-gray-200 group-hover:bg-emerald-100 rounded-full p-0.5`}>
                                {showDates ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                            </div>
                        </div>
                    </button>
                    
                    {showDates && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 animate-fade-in pt-2">
                            {sortedSchedule.map(idx => {
                                const d = getDateFromIndex(CONSTANTS.START_DATE, idx);
                                return (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs font-bold text-gray-600 text-center shadow-sm">
                                        {d.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' })}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Total Quantity */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Összesített mennyiség</span>
                    <span className="text-green-700 font-black text-2xl">{formatNumber(orderState.quantity * orderState.schedule.length)} palack</span>
                </div>

                {/* Financial Fulfillment */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pénzügyi teljesítés</span>
                    <span className="text-sm font-bold text-gray-900">számla alapján</span>
                </div>

                {/* Emails Section */}
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 leading-relaxed">
                        Visszaigazolás és számla az alábbi címekre kerül elektronikusan megküldésre
                    </p>
                    <div className="space-y-1.5">
                        {emails.map((email, index) => (
                            <div key={index} className="text-sm font-bold text-gray-900">
                                {email}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer Text */}
            <p className="text-xs text-gray-400 font-medium mb-10 text-center leading-relaxed px-4">
                Adott heti szállítás módosítására legkésőbb a szállítást megelőző péntek 15:00-ig van lehetőség a <a href="mailto:rendeles@rosti.hu" className="text-emerald-600 font-bold hover:underline">rendeles@rosti.hu</a> e-mail címen jelezve.
            </p>

            <button onClick={onReset} className="w-full text-sm font-bold text-green-700 underline underline-offset-4 hover:text-green-800 transition text-center">
                Vissza a kezdőoldalra
            </button>
          </div>

          {/* Right Column: Social Share & Calendar */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">
             
             {/* Social Share Card */}
             <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl relative text-left">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <MessageSquare size={100} />
                </div>
                
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Szólj a csapatnak!</h3>
                <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">
                    Mindenki szereti a jó híreket. Másold ki ezt az üzenetet és dobd be a közös Slack vagy Teams csatornába!
                </p>

                <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm mb-6 relative">
                    <div className="absolute -left-2 top-6 w-2 h-4 bg-indigo-500 rounded-r-full"></div>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                        {shareMessage}
                    </pre>
                </div>

                <button 
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                        ${copied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20'
                        }
                    `}
                >
                    {copied ? (
                        <>
                            <CheckCircle2 size={18} />
                            <span>Kimásolva!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={18} />
                            <span>Szöveg másolása</span>
                        </>
                    )}
                </button>
             </div>

             {/* Calendar Card */}
             <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-[2.5rem] border border-orange-100 shadow-xl relative text-left">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Calendar size={100} />
                </div>
                
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Tedd be naptárba!</h3>
                <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">
                    Töltsd le a szállítási időpontokat tartalmazó fájlt, és add hozzá a naptáradhoz egy kattintással.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-1 bg-white border border-orange-100 rounded-md text-[9px] font-bold text-gray-500 uppercase">Outlook</span>
                    <span className="px-2 py-1 bg-white border border-orange-100 rounded-md text-[9px] font-bold text-gray-500 uppercase">Google Calendar</span>
                    <span className="px-2 py-1 bg-white border border-orange-100 rounded-md text-[9px] font-bold text-gray-500 uppercase">Apple</span>
                </div>

                <button 
                    onClick={handleDownloadCalendar}
                    className="w-full py-4 rounded-xl font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-500/20 shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Download size={18} />
                    <span>Mentés naptárba (.ics)</span>
                </button>
             </div>

          </div>

      </div>
    </div>
  );
};

export default SuccessScreen;
