'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { SiteNavbar } from '@/components/ui/site-navbar';

interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="w-full py-5 flex justify-between items-center text-left focus:outline-none hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{question}</span>
        <span className="ml-6 flex-shrink-0 text-gray-400 dark:text-gray-500">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 pr-12 text-gray-600 dark:text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

const faqs = [
  {
    question: 'Mikor és hogyan érkezik a Rosti az irodába?',
    answer: (
      <>
        A Rostikat a kiszállítást megelőző este készítjük. A szállítás a kiválasztott napokon (hétfőn vagy kedden), <strong>08:00 és 14:00 óra</strong> között hűtve történik az irodába. A pontos szállítási időablakot a kiszállítást megelőző napon e-mailben jelezzük.
      </>
    ),
  },
  {
    question: 'Rendelhetek hétfőtől és keddtől eltérő napra is?',
    answer: (
      <>
        Kézműves kapacitásaink miatt az állandó szállításunk hétfőre és keddre korlátozódik. <strong>Egyedi esetekben</strong> (pl. irodai rendezvény, workshop) van lehetőség ettől eltérni. Kérjük, írj a{' '}
        <a href="mailto:rendeles@rosti.hu" className="text-[#0B5D3F] hover:underline font-bold">rendeles@rosti.hu</a> címre, és egyeztetjük a részleteket.
      </>
    ),
  },
  {
    question: 'Meddig áll el a Rosti a hűtőben?',
    answer: (
      <>
        A csúcsminőséget a készítést követő <strong>60 órában</strong> garantáljuk, amennyiben az átvétel után azonnal hűtőbe kerül. Így a hétfői Rosti-csomag kedd estig, a keddi pedig szerda nap végéig nyújtja a maximális élményt (szigorúan 2–4°C közötti tárolás mellett).
      </>
    ),
  },
  {
    question: 'Meddig tudom módosítani vagy lemondani a rendelést?',
    answer: (
      <>
        A rendelés módosítására vagy lemondására legkésőbb a szállítást megelőző <strong>utolsó munkanap 15:00-ig</strong> van lehetőség a{' '}
        <a href="mailto:rendeles@rosti.hu" className="text-[#0B5D3F] hover:underline font-bold">rendeles@rosti.hu</a> e-mail címen.
      </>
    ),
  },
  {
    question: 'Hogyan történik a fizetés és a számlázás?',
    answer: (
      <>
        A rendelések ellenértékének kiegyenlítése előre, a Stripe biztonságos online bankkártyás rendszerén keresztül történik. A visszaigazolást és a számlát a sikeres fizetést követő <strong>24 órán belül</strong> küldjük e-mailben.
      </>
    ),
  },
  {
    question: 'Tartalmaz a Rosti allergéneket?',
    answer: (
      <>
        A Rosti tej-, glutén- és tartósítószer-mentes, hozzáadott cukrot nem tartalmaz. Állandó allergénként azonban szerepel benne a <strong>zeller</strong>. Az aktuális friss összetevők pontos listáját a{' '}
        <Link href="/osszetevok" className="text-[#0B5D3F] hover:underline font-bold">www.rosti.hu/osszetevok</Link> oldalon találod; kérjük, a rendelésnél ezt vedd figyelembe.
      </>
    ),
  },
];

export default function GyikPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <SiteNavbar />

      <main className="pt-28 pb-12 flex-grow">
        <div className="container mx-auto max-w-3xl px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-10 tracking-tight">
            Gyakran ismételt kérdések
          </h1>

          <div className="border-t border-gray-200 dark:border-gray-700">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          <div className="mt-12 pt-8 pb-12 text-gray-700 dark:text-gray-300">
            Nem találtad meg a választ a kérdésedre? Írj nekünk a{' '}
            <a href="mailto:rendeles@rosti.hu" className="text-[#0B5D3F] hover:underline font-bold">rendeles@rosti.hu</a> címre.
          </div>
        </div>

        {/* CTA */}
        <div className="py-10 flex flex-col items-center text-center">
          <Link
            href="/modern-shop"
            className="group flex flex-col sm:flex-row items-center gap-4"
          >
            <span className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg group-hover:bg-[#147A55] group-hover:shadow-[#0B5D3F]/20 group-hover:scale-105">
              <span>FELTÖLTÖM A HŰTŐT</span>
              <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/ROSTI_WEBSHOP_P_tr.png"
              alt="Friss zöldségek"
              className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 drop-shadow-sm group-hover:scale-110 group-hover:-rotate-3"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-6 mt-auto relative">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="Rosti"
              width={96}
              height={24}
              className="h-6 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
              <Link href="/gyik" className="hover:text-[#0B5D3F] transition-colors">GYIK</Link>
              <Link href="/blog" className="hover:text-[#0B5D3F] transition-colors">Blog</Link>
              <Link href="/osszetevok" className="hover:text-[#0B5D3F] transition-colors">Összetevők</Link>
              <Link href="/adatkezeles" className="hover:text-[#0B5D3F] transition-colors">Adatkezelés</Link>
              <Link href="/altalanos-szerzodesi-feltetelek" className="hover:text-[#0B5D3F] transition-colors">ÁSZF</Link>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center md:text-right leading-relaxed">
              © 2026 Rosti. Minden jog fenntartva.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
