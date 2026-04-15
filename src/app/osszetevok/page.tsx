'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SiteNavbar } from '@/components/ui/site-navbar';

function toBlogSlug(title: string) {
  return `/blog/${title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

const ingredients = [
  {
    name: 'Cékla',
    benefit: 'Pörgeti a vérkeringést és az állóképességet.',
    science: 'Étrendi nitrátokkal és betalain antioxidánsokkal.',
    textColor: 'text-[#8F1A37]',
    icon: 'https://raw.githubusercontent.com/bal1nt/rosti-img/4adef1f46a8eade083d70001cabf8a2f767f585b/tr_png_ce%CC%81kla.png',
    scale: 'scale-[1.50] group-hover:scale-[1.60]',
  },
  {
    name: 'Sárgarépa',
    benefit: 'Ragyogó bőr és éles látás.',
    science: 'Magas béta-karotin (A-vitamin) és élelmi rost tartalom.',
    textColor: 'text-[#D28360]',
    icon: 'https://raw.githubusercontent.com/bal1nt/rosti-img/4adef1f46a8eade083d70001cabf8a2f767f585b/tr_png_re%CC%81pa.png',
    scale: 'scale-[1.70] group-hover:scale-[1.80]',
  },
  {
    name: 'Uborka',
    benefit: 'Azonnali, mély sejtszintű hidratáció.',
    science: 'Elektrolitokban és természetes káliumban gazdag.',
    textColor: 'text-emerald-700',
    icon: 'https://raw.githubusercontent.com/bal1nt/rosti-img/4adef1f46a8eade083d70001cabf8a2f767f585b/tr_png_uborka.png',
    scale: 'scale-[1.25] group-hover:scale-[1.35]',
  },
  {
    name: 'Zellergumó',
    benefit: 'Erős csontok és optimális vérnyomás.',
    science: 'Természetes kálium-, K-vitamin- és élelmirost-forrás.',
    textColor: 'text-[#ACAD50]',
    icon: 'https://raw.githubusercontent.com/bal1nt/rosti-img/4adef1f46a8eade083d70001cabf8a2f767f585b/tr_png_zellergumo.png',
    scale: 'group-hover:scale-110',
  },
  {
    name: 'Lilakáposzta',
    benefit: 'Páncél a szívnek és az ereknek.',
    science: 'Antociánok, C és K-vitamin, valamint glükozinolátok.',
    textColor: 'text-[#8C56B1]',
    icon: 'https://raw.githubusercontent.com/bal1nt/rosti-img/4adef1f46a8eade083d70001cabf8a2f767f585b/tr_png_kaposzta.png',
    scale: 'group-hover:scale-110',
  },
  {
    name: 'Citrom',
    benefit: 'Immun-löket és vas-felszívódás turbó.',
    science: 'Magas C-vitaminnal támogatja az immunrendszert.',
    textColor: 'text-[#DDAA00]',
    icon: 'https://raw.githubusercontent.com/bal1nt/rosti-img/4adef1f46a8eade083d70001cabf8a2f767f585b/tr_png_citrom.png',
    scale: 'group-hover:scale-110',
  },
  {
    name: 'Alma',
    benefit: 'Természetes energia és szívvédelem.',
    science: 'Antioxidánsai és polifenoljai védik a sejteket.',
    textColor: 'text-[#E06666]',
    icon: 'https://raw.githubusercontent.com/bal1nt/rosti-img/4adef1f46a8eade083d70001cabf8a2f767f585b/tr_png_alma.png',
    scale: 'scale-[1.55] group-hover:scale-[1.65]',
  },
];

const desktopOrders = [
  'md:order-1',
  'md:order-3',
  'md:order-2',
  'md:order-5',
  'md:order-4',
  'md:order-7',
  'md:order-8',
];

export default function OsszetevokPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <SiteNavbar />

      <main className="pt-28 pb-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left Content */}
            <div className="space-y-12">
              <div>
                <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                  AMIT MOST A KEZEDBEN TARTASZ
                </h2>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.25rem] font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-[1.1] mb-2 md:mb-6">
                  5 Zöldség.<br />
                  <span className="text-[#0B5D3F] whitespace-nowrap">Friss és nyers.</span>
                </h1>

                {/* Mobile Bottle Image */}
                <div className="lg:hidden mt-2 mb-6 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti%20HomePage%20bottle_P_tr.png"
                    alt="Rosti 5 zöldséges friss, nyers zöldség-smoothie"
                    className="w-full max-w-[220px] sm:max-w-[260px] h-auto object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl mb-8 text-justify space-y-4">
                  <p>
                    A legdurvább munkanapokon senkinek sincs ideje zöldségeket darabolni. Ezért mi elvégeztük a nehezét.
                  </p>
                  <p>
                    Ha valódi táplálékra vágysz a szuperfeldolgozott üres kalóriák helyett, megtaláltad.
                  </p>
                  <p>
                    Ez nem egy híg, szűrt juice, hanem egy tartalmas, rostokkal teli zöldség-smoothie.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {ingredients.map((item, index) => (
                  <React.Fragment key={index}>
                    {index === 5 && (
                      <div className="col-span-1 md:col-span-2 py-2 mt-2 md:order-6">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 w-full"></div>
                      </div>
                    )}
                    <div
                      className={`group flex items-center gap-5 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${desktopOrders[index]}`}
                    >
                      <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center bg-[#EDF7F3] dark:bg-emerald-900/20 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.icon}
                          alt={item.name}
                          className={`w-[95%] h-[95%] object-contain drop-shadow-md transition-transform duration-300 ${item.scale}`}
                        />
                      </div>
                      <div>
                        <h3 className={`text-xl font-black tracking-tight ${item.textColor}`}>
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Content - Sticky Bottle (desktop only) */}
            <div className="hidden lg:flex sticky top-32 h-[calc(100vh-8rem)] items-center justify-center">
              <div className="relative w-full h-full max-h-[800px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti%20HomePage%20bottle_P_tr.png"
                  alt="Rosti 5 zöldséges friss, nyers zöldség-smoothie"
                  className="relative z-10 w-auto h-full max-h-[800px] object-contain animate-float drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                />
              </div>
            </div>

          </div>

          {/* Blog Section */}
          <div className="mt-10 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">Vágj rendet az egészség-zajban</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                A táplálkozási tanácsok gyakran ellentmondásosak, de a tények nem.<br className="hidden md:block" />
                Tegyél különbséget a trendek és a valóság között.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <Link
                href={toBlogSlug('Juice vagy smoothie: mi a különbség?')}
                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 hover:shadow-xl hover:border-[#0B5D3F]/30 transition-all duration-300 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0B5D3F]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3 group-hover:text-[#0B5D3F] transition-colors leading-tight min-h-[50px]">Juice vagy smoothie: mi a különbség?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  Még a 100%-os gyümölcs juice is hirtelen vércukorszint-emelkedést okozhat. A zöldségekből készült, rostban gazdag smoothie azonban lassítja a felszívódást...
                </p>
                <div className="flex items-center gap-2 text-[#0B5D3F] font-black text-xs uppercase tracking-widest mt-auto">
                  ELOLVASOM <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href={toBlogSlug('3 ok, amiért a testnek rostra van szüksége')}
                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 hover:shadow-xl hover:border-[#0B5D3F]/30 transition-all duration-300 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0B5D3F]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3 group-hover:text-[#0B5D3F] transition-colors leading-tight min-h-[50px]">3 ok, amiért a testnek rostra van szüksége</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  Sokan úgy nőttek fel, hogy a rostfogyasztás egyetlen célja az emésztés &ldquo;rendben tartása&rdquo;. A modern orvostudomány szerint a rost a bélflóra igazi védőpajzsa...
                </p>
                <div className="flex items-center gap-2 text-[#0B5D3F] font-black text-xs uppercase tracking-widest mt-auto">
                  ELOLVASOM <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            <div className="flex justify-center">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:border-[#0B5D3F] hover:text-[#0B5D3F] transition-all shadow-sm hover:shadow-md"
              >
                <span className="font-black text-xs uppercase tracking-widest">
                  Tudomány, közhelyek nélkül
                </span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-10 flex flex-col items-center text-center">
          <Link
            href="/modern-shop"
            className="group flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg group-hover:bg-[#147A55] group-hover:shadow-[#0B5D3F]/20 group-hover:scale-105">
              <span>FELTÖLTÖM A HŰTŐT</span>
              <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
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
