import React, { useState } from 'react';
import { OrderState, CONSTANTS } from '../../types/modern-shop';
import { Copy, MessageSquare, CheckCircle2, ChevronDown, ChevronUp, Calendar, Download } from 'lucide-react';
import { getDateFromIndex } from '../../lib/modern-shop-utils';

interface SuccessScreenProps {
  orderState: OrderState;
  orderNumber: string | null;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderState, orderNumber, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showDates, setShowDates] = useState(false);

  // Calculate sorted schedule
  const sortedSchedule = [...orderState.schedule].sort((a, b) => {
    const dateA = getDateFromIndex(CONSTANTS.START_DATE, a);
    const dateB = getDateFromIndex(CONSTANTS.START_DATE, b);
    return dateA.getTime() - dateB.getTime();
  });
  const deliveryDates = sortedSchedule.map(idx => getDateFromIndex(CONSTANTS.START_DATE, idx));

  // Split schedule into Mondays and Tuesdays
  const mondayIndices = sortedSchedule.filter(idx => idx < 100);
  const tuesdayIndices = sortedSchedule.filter(idx => idx >= 100);
  const hasMondays = mondayIndices.length > 0;
  const hasTuesdays = tuesdayIndices.length > 0;

  // Calculate first delivery date
  const firstDeliveryDate = deliveryDates.length > 0 ? deliveryDates[0] : new Date();

  // Date formatting with suffix logic
  const day = firstDeliveryDate.getDate();
  const dateBase = firstDeliveryDate.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' }).replace(/\.$/, '');

  // Hungarian suffix logic (-én, -án, -jén)
  let suffix = '-én';
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
  const shareMessage = `Sziasztok! 🥕🥦\n\nJó hír: érkezik a friss Rosti a csapatnak! 🥤\n${formattedDate}, ${weekday} kerülnek a hűtőbe a nyers zöldségből készült szuper smoothiek.\n\nJuice vagy smoothie? Rostok? Vágj rendet az egészség-zajban: www.rosti.hu/blog\n\nSiessetek, mert gyorsan fogy! ⚡`;

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
        const now = formatICSDate(new Date(), 0, 0);

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
    'hello@teceged.hu',
    orderState.billingData.emailCC1,
    orderState.billingData.emailCC2
  ].filter(Boolean);

  const renderDateList = (indices: number[], label: string) => (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        {indices.map(idx => {
          const d = getDateFromIndex(CONSTANTS.START_DATE, idx);
          return (
            <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-xs font-bold text-gray-600 dark:text-gray-400 text-center shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              {d.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' })}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fade-in flex-grow text-balance">

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-start justify-center">

          {/* Main Success Card */}
          <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-200 dark:border-gray-700 shadow-2xl p-10 md:p-16 relative overflow-hidden text-balance text-left order-2 lg:order-1">
            <div className="flex justify-center mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti_double_white-bg_PNG.png"
                    alt="Rosti"
                    className="h-32 w-auto object-contain drop-shadow-md"
                />
            </div>

            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-tight text-center">Készülhet a hűtő!</h2>
            <div className="flex items-center justify-center gap-1.5 mb-10">
                <CheckCircle2 size={14} className="text-[#0B5D3F]" />
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sikeresen rögzítettük a rendelésedet.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 mb-8 text-left border border-gray-100 dark:border-gray-800 text-balance">
                {/* Delivery Count with Dropdown */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4 pb-4 transition-all">
                    <button
                        onClick={() => setShowDates(!showDates)}
                        className="w-full flex justify-between items-center group focus:outline-none"
                    >
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-[#0B5D3F] transition-colors text-left">
                            Szállítások száma
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{orderState.schedule.length} alkalom</span>
                            <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#0B5D3F] transition-colors bg-gray-200 dark:bg-gray-700 group-hover:bg-[#EDF7F3] rounded-full p-0.5">
                                {showDates ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                            </div>
                        </div>
                    </button>

                    {showDates && (
                        <div className="mt-6 animate-fade-in pt-2">
                            <div className={`grid gap-8 ${hasMondays && hasTuesdays ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                                {hasMondays && renderDateList(mondayIndices, 'Hétfők')}
                                {hasTuesdays && renderDateList(tuesdayIndices, 'Keddek')}
                            </div>
                        </div>
                    )}
                </div>

                {/* Total Quantity */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Összesített mennyiség</span>
                    <div className="flex items-baseline justify-end">
                         {orderState.schedule.length > 1 && (
                            <span className="text-xl font-black text-gray-400 dark:text-gray-500 mr-3">
                                {orderState.schedule.length} x
                            </span>
                         )}
                         <span className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                            {orderState.quantity} <span className="text-[#0B5D3F] ml-1">Rosti</span>
                         </span>
                    </div>
                </div>

                {/* Order ID */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Rendelési szám</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {orderNumber ? `#${orderNumber}` : '#ROSTI-2026-0119'}
                    </span>
                </div>

            </div>

            {/* Emails Section */}
            <div className="mt-6 mb-10">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                    A visszaigazolást és a számlát hamarosan küldjük az alábbi címekre:
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                    {emails.map((email, index) => (
                        <div key={index} className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {email}
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer Text */}
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center leading-relaxed px-4">
                Adott heti kiszállítás módosítására legkésőbb a kiszállítást megelőző péntek 15:00-ig van lehetőség a <a href="mailto:rendeles@rosti.hu" className="text-[#0B5D3F] font-bold hover:underline">rendeles@rosti.hu</a> e-mail címen jelezve.
            </p>

            {/* Science CTA Section */}
            <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-3">Vágj rendet az egészség-zajban</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                    A táplálkozási tanácsok gyakran ellentmondásosak, de a tények nem. Tegyél különbséget a trendek és a valóság között.
                </p>
                <div className="flex justify-center">
                    <a
                        href="/blog"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:border-[#0B5D3F] hover:text-[#0B5D3F] transition-all shadow-sm hover:shadow-md"
                    >
                        <span className="font-black text-xs uppercase tracking-widest">Tudomány, közhelyek nélkül</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>
            </div>
          </div>

          {/* Right Column: Social Share & Calendar */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">

             {/* Social Share Card */}
             <div className="bg-gradient-to-br from-[#EDF7F3] to-white dark:from-emerald-900/20 dark:to-gray-900 p-8 rounded-[2.5rem] border border-[#0B5D3F]/15 dark:border-emerald-800 shadow-xl relative text-left">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-[#0B5D3F]">
                    <MessageSquare size={100} />
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight mb-2">Szólj a csapatnak!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
                    Mindenki szereti a jó híreket. Másold ki ezt az üzenetet és dobd be a közös Teams vagy Slack csatornába!
                </p>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-[#0B5D3F]/15 dark:border-emerald-800 shadow-sm mb-6 relative">
                    <div className="absolute -left-2 top-6 w-2 h-4 bg-[#0B5D3F] rounded-r-full"></div>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {shareMessage}
                    </pre>
                </div>

                <button
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                        ${copied
                            ? 'bg-[#147A55] text-white'
                            : 'bg-[#0B5D3F] text-white hover:bg-[#147A55] hover:shadow-[#0B5D3F]/20'
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
             <div className="bg-gradient-to-br from-[#EDF7F3] to-white dark:from-emerald-900/20 dark:to-gray-900 p-8 rounded-[2.5rem] border border-[#0B5D3F]/15 dark:border-emerald-800 shadow-xl relative text-left">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-[#0B5D3F]">
                    <Calendar size={100} />
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight mb-2">Tedd be naptárba!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
                    Töltsd le a szállítási időpontokat tartalmazó fájlt, és add hozzá a naptáradhoz egy kattintással.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-1 bg-white dark:bg-gray-900 border border-[#0B5D3F]/15 dark:border-emerald-800 rounded-md text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Outlook</span>
                    <span className="px-2 py-1 bg-white dark:bg-gray-900 border border-[#0B5D3F]/15 dark:border-emerald-800 rounded-md text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Google Calendar</span>
                    <span className="px-2 py-1 bg-white dark:bg-gray-900 border border-[#0B5D3F]/15 dark:border-emerald-800 rounded-md text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Apple</span>
                </div>

                <button
                    onClick={handleDownloadCalendar}
                    className="w-full py-4 rounded-xl font-bold text-sm bg-[#0B5D3F] text-white hover:bg-[#147A55] hover:shadow-[#0B5D3F]/20 shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
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
