'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Activity, Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { trackQRCodeVisit } from '@/lib/analytics';
import { SiteNavbar } from '@/components/ui/site-navbar';

// Custom SVG icon for natural fiber/grain
const NaturalFiberIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M11.25 12V22H12.75V12H11.25Z" />
    <path d="M12 2C10.5 4 10 7 12 9C14 7 13.5 4 12 2Z" />
    <path d="M10.5 9.5C9 8 6.5 7 5 9.5C4 11.5 6 12.5 8 12C9.5 11.5 10.5 10.5 10.5 9.5Z" />
    <path d="M13.5 9.5C15 8 17.5 7 19 9.5C20 11.5 18 12.5 16 12C14.5 11.5 13.5 10.5 13.5 9.5Z" />
    <path d="M10.5 14.5C9 13 6.5 12 5 14.5C4 16.5 6 17.5 8 17C9.5 16.5 10.5 15.5 10.5 14.5Z" />
    <path d="M13.5 14.5C15 13 17.5 12 19 14.5C20 16.5 18 17.5 16 17C14.5 16.5 13.5 15.5 13.5 14.5Z" />
  </svg>
);

// Hover image component with delayed image swap
const HoverImage = ({ src, hoverSrc, alt, className = "" }: { src: string, hoverSrc: string, alt: string, className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showAlternate, setShowAlternate] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => setShowAlternate(true), 500);
    } else {
      setShowAlternate(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  return (
    <div
      className={`aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowAlternate(false); }}
      onClick={() => setShowAlternate(prev => !prev)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${showAlternate ? 'opacity-0' : 'opacity-100'}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hoverSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${showAlternate ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
    </div>
  );
};

export default function HomePage() {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://rosti.hu/#organization",
        "name": "Rosti Hungary",
        "url": "https://rosti.hu",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rosti.hu/images/logo.png",
          "width": 200,
          "height": 60
        },
        "description": "Friss és természetes zöldségitalok gyártója Magyarországon",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "HU",
          "addressLocality": "Budapest"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "areaServed": "HU",
          "availableLanguage": "Hungarian"
        },
        "sameAs": [
          "https://www.facebook.com/rosti.hungary",
          "https://www.instagram.com/rosti.hungary"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://rosti.hu/#website",
        "url": "https://rosti.hu",
        "name": "Rosti - Friss Zöldségitalok",
        "description": "Friss és nyers zöldségekből készült Rosti italok Budapesten. Természetes vitaminok, rostok és tápanyagok.",
        "publisher": {
          "@id": "https://rosti.hu/#organization"
        },
        "inLanguage": "hu-HU"
      },
      {
        "@type": "Product",
        "name": "Rosti Zöldségital",
        "description": "Friss és nyers zöldségekből készült természetes ital, tele vitaminokkal és rostokkal",
        "brand": {
          "@type": "Brand",
          "name": "Rosti"
        },
        "manufacturer": {
          "@id": "https://rosti.hu/#organization"
        },
        "category": "Zöldségital",
        "offers": {
          "@type": "AggregateOffer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "HUF",
          "lowPrice": "1500",
          "highPrice": "3000",
          "offerCount": "8"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "127",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://rosti.hu/#localbusiness",
        "name": "Rosti Hungary",
        "description": "Egészséges zöldségitalok házhoz szállítása Budapesten és egész Magyarországon",
        "url": "https://rosti.hu",
        "telephone": "+36-1-xxx-xxxx",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Budapest",
          "addressLocality": "Budapest",
          "addressCountry": "HU"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 47.4979,
          "longitude": 19.0402
        },
        "openingHours": "Mo-Fr 08:00-18:00",
        "servesCuisine": "Healthy Drinks",
        "priceRange": "$$",
        "areaServed": {
          "@type": "Country",
          "name": "Hungary"
        }
      }
    ]
  };

  const [blogSlugs, setBlogSlugs] = useState<Record<string, string>>({});

  // Fetch blog post slugs for direct linking
  useEffect(() => {
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then((posts: { title: string; slug: string }[]) => {
        const slugMap: Record<string, string> = {};
        for (const p of posts) {
          slugMap[p.title] = p.slug;
        }
        setBlogSlugs(slugMap);
      })
      .catch(() => {});
  }, []);

  // Track QR code visits on page load
  useEffect(() => {
    trackQRCodeVisit('/');
  }, []);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <SiteNavbar />

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8 relative z-10 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 rounded-full text-[#0B5D3F] text-[10px] font-black uppercase tracking-widest">
                  <Leaf size={12} fill="currentColor" />
                  <span>100% Természetes</span>
                </div>

                <h1 className="text-[40px] sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 leading-[1.1] tracking-tight">
                  Egészség az irodában. <br />
                  <span className="text-[#0B5D3F]">Kompromisszumok nélkül.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                  5 féle nyers zöldség és friss citrom.<br />Egyetlen prémium smoothie-ban.
                </p>

                <div className="flex items-center gap-6 pt-8">
                  <span className="text-lg md:text-xl font-black text-[#0B5D3F] tracking-tight">
                    Friss és nyers.
                  </span>

                  <Link
                    href="/modern-shop"
                    className="group relative transition-transform hover:scale-110 active:scale-95 duration-300"
                    title="Rendelés indítása"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/ROSTI_WEBSHOP_P_tr.png"
                      alt="Rendelés"
                      className="h-24 w-auto object-contain drop-shadow-xl group-hover:-rotate-6 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-sm font-bold text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#0B5D3F]" />
                    <span>Adalékmentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#0B5D3F]" />
                    <span>Tartósítószermentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#0B5D3F]" />
                    <span>Vegán</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 lg:h-[650px] flex items-center justify-center order-1 lg:order-2">
                {/* Bottle Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/tr_Rosti_Hero_bottle.png"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  alt="Rosti 5 Zöldség"
                  className="relative z-20 h-full w-auto object-contain mx-auto animate-float drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"
                  style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                />

                {/* Floating Cards */}
                <div className="absolute top-[15%] left-0 lg:left-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-bounce delay-700 hidden md:block z-30">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-[#0B5D3F] relative">
                      <Leaf size={20} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-gray-100">Frissen készül</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[35%] -right-4 lg:right-0 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-bounce delay-100 hidden md:block z-30">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full text-orange-600">
                      <NaturalFiberIcon size={28} className="rotate-[22deg]" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-gray-100">Természetes rost</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[20%] -left-4 lg:left-0 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-bounce hidden md:block z-30">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600">
                      <Heart size={20} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-gray-100">Vitaminbomba</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 dark:from-emerald-900/20 to-transparent -z-10"></div>
        </section>

        {/* Features Grid */}
        <section className="pt-10 pb-10 bg-gray-50 dark:bg-gray-800 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Miért fogja imádni a csapatod?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow text-left">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-[#0B5D3F] mb-6 relative">
                  <Leaf size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3">5 féle zöldség</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Friss és nyers, de a legfinomabb formában. Valódi alapanyagokból, semmi más.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow text-left">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 mb-6 relative">
                  <Heart size={28} />
                  <div className="absolute inset-0 flex items-center justify-center pt-0.5">
                    <NaturalFiberIcon size={12} className="text-orange-600 fill-current" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3">Természetes rostban gazdag</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  A rost marad. A lényeg marad. Teltségérzet és kiegyensúlyozott felszívódás, kompromisszum nélkül.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow text-left">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Activity size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3">Mikrobiom & bélflóra</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  A növényi rost a mikrobiom alapja. Természetes támogatás a bélrendszer egyensúlyához.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center text-center">
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
          </div>
        </section>

        {/* UGC Section */}
        <section className="pt-10 pb-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center">A nap fénypontja, amiért hálás a csapat</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <HoverImage
                src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/Rosti_highlights_1a.png"
                hoverSrc="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/Rosti_highlights_1b.png"
                alt="Rosti pillanat"
              />

              <HoverImage
                src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/Rosti_highlights_2a.png"
                hoverSrc="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/Rosti_highlights_2b.png"
                alt="Rosti pillanat"
                className="mt-0 md:mt-8"
              />

              <HoverImage
                src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/Rosti_highlights_3a.png"
                hoverSrc="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/Rosti_highlights_3b.png"
                alt="Rosti pillanat"
              />
            </div>

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
                  href={blogSlugs['Juice vagy smoothie: mi a különbség?'] ? `/blog/${blogSlugs['Juice vagy smoothie: mi a különbség?']}` : '/blog'}
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
                  href={blogSlugs['3 ok, amiért a testnek rostra van szüksége'] ? `/blog/${blogSlugs['3 ok, amiért a testnek rostra van szüksége']}` : '/blog'}
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
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-6 mt-auto relative">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 relative">
            {/* Logo */}
            <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Image
                src="/images/logo.png"
                alt="Rosti"
                width={96}
                height={24}
                className="h-6 w-auto object-contain"
              />
            </div>

            {/* Legal & Copyright */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                <Link
                  href="/gyik"
                  className="hover:text-[#0B5D3F] transition-colors"
                >
                  GYIK
                </Link>
                <Link
                  href="/blog"
                  className="hover:text-[#0B5D3F] transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/osszetevok"
                  className="hover:text-[#0B5D3F] transition-colors"
                >
                  Összetevők
                </Link>
                <Link
                  href="/adatkezeles"
                  className="hover:text-[#0B5D3F] transition-colors"
                >
                  Adatkezelés
                </Link>
                <Link
                  href="/altalanos-szerzodesi-feltetelek"
                  className="hover:text-[#0B5D3F] transition-colors"
                >
                  ÁSZF
                </Link>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center md:text-right leading-relaxed">
                © 2026 Rosti. Minden jog fenntartva.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
