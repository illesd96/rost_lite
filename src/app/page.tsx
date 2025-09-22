'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingBag, Shield, Truck, CreditCard, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UnifiedNavbar } from '@/components/ui/unified-navbar';
import { trackQRCodeVisit } from '@/lib/analytics';

// Product images data
const productImages = [
  { src: '/images/product_pictures/Rosti1.jpg', alt: 'Rosti 1' },
  { src: '/images/product_pictures/Rosti2.jpg', alt: 'Rosti 2' },
  { src: '/images/product_pictures/Rosti3.jpg', alt: 'Rosti 3' },
  { src: '/images/product_pictures/Rosti4.jpg', alt: 'Rosti 4' },
  { src: '/images/product_pictures/Rosti5.jpg', alt: 'Rosti 5' },
  { src: '/images/product_pictures/Rosti6.jpg', alt: 'Rosti 6' },
  { src: '/images/product_pictures/Rosti7.jpg', alt: 'Rosti 7' },
  { src: '/images/product_pictures/Rosti8.jpg', alt: 'Rosti 8' },
];

export default function HomePage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  // Track QR code visits on page load
  useEffect(() => {
    trackQRCodeVisit('/');
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      switch (e.key) {
        case 'Escape':
          setSelectedImageIndex(null);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedImageIndex((prev) => 
            prev === null ? null : prev === 0 ? productImages.length - 1 : prev - 1
          );
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedImageIndex((prev) => 
            prev === null ? null : prev === productImages.length - 1 ? 0 : prev + 1
          );
          break;
      }
    };

    if (selectedImageIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === null ? null : prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => 
      prev === null ? null : prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Unified Navigation */}
      <UnifiedNavbar />
      
      {/* Full-Screen Hero Banner */}
      <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen">
        <Image
          src="/images/bg-new.png"
          fill
          alt="Premium products and fresh ingredients"
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content - Description at top */}
        <div className="absolute top-32 left-0 right-0 flex justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <p className="text-xl md:text-3xl text-gray-100 leading-relaxed">
              Nem juice. Nem szűrt.<br />
              És nem is cukros gyümölcs-smoothie.
            </p>
          </div>
        </div>

        {/* Hero Content - Title at bottom */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Ez Rosti.
            </h1>
          </div>
        </div>
        
        {/* Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div> */}
      </div>

      {/* Mi az a Rosti Section */}
      <section className="py-20 bg-rosti-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Friss és nyers
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Zöldségekből készül, minden rost és tápanyag benne marad, hogy egyszerűen hozzájuthass a napi 
              zöldség- és vitaminadagodhoz.
            </p>
          </div>

          {/* Product Images Grid - 4x2 layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {productImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Product description */}
          <div className="text-center">
            <p className="text-lg text-gray-700 font-medium">
              Semmi mesterséges adalék. Semmi tartósítószer. Friss és nyers.
            </p>
          </div>
        </div>
      </section>

      {/* Érezd a különbséget Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Érezd a különbséget
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Tartós energia */}
            <div className="text-center p-8">
              <div className="text-6xl mb-6">💪</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tartós energia</h3>
              <p className="text-gray-600 leading-relaxed">
              A Rosti lassan felszabaduló tápanyagokkal, teljes rosttal és komplex, alacsony glikémiás indexű szénhidrátokkal lát el.
              </p>
            </div>

            {/* Tiszta tudat és fókusz */}
            {/* <div className="text-center p-8">
              <div className="text-6xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tiszta tudat és fókusz</h3>
              <p className="text-gray-600 leading-relaxed">
                Táplálod tested és elmédét a friss zöldségekben található erős 
                vitaminokkal és ásványi anyagokkal.
              </p>
            </div> */}

            {/* Természetes jóság */}
            <div className="text-center p-8">
              <div className="text-6xl mb-6">🍀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nem leszel feleslegesen éhes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Elkerülheted a vércukor-ingadozások miatti éhségérzetet, így a felesleges nasikat, no meg a hűtő előtti lelkiismeret-furdalást.
                </p>
            </div>

            {/* Meglepően finom */}
            <div className="text-center p-8">
              <div className="text-6xl mb-6">😋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Meglepően finom</h3>
              <p className="text-gray-600 leading-relaxed">
              Egyedi és frissítő ízvilága miatt még azok is szívesen megisszák, akiknek nehezükre esik elegendő zöldséget fogyasztani. Na, kipróbálod?  
              </p>
            </div>
          </div>
        </div>
      </section>

                {/* Why Fiber is Important Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">        
          <div className="bg-rosti-gold rounded-3xl p-8 md:p-12 mt-10 mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              MIÉRT FONTOS A <span className="text-rosti-fiber-green">ROST?</span>
            </h2>
            
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-lg md:text-xl text-white leading-relaxed mb-6">
                A rost hozzájárul a <strong>jóllakottság</strong> érzéséhez, támogatja az <strong>egészséges emésztést</strong> és létfontosságú 
                szerepet játszik a <strong>bélrendszer</strong>, valamint a <strong>vércukorszint</strong> megfelelő működésében.
              </p>
              
              <p className="text-lg md:text-xl text-rosti-cream leading-relaxed mb-8">
                A tudomány jelenlegi állása szerint a <strong className="text-rosti-fiber-green">megfelelő rostbevitel</strong><br />
                az egyik legerősebb prevenciós tényező a <strong className="text-rosti-disease-red">krónikus betegségek ellen.</strong>
              </p>
            </div>

            {/* Scientific Sources */}
            <div className="mt-6 text-sm text-center text-rosti-fiber-green">
              <h4 className="font-semibold mb-2 text-rosti-fiber-green">Tudományos források:</h4>
              <div className="flex flex-wrap justify-center items-center gap-x-2 text-rosti-fiber-green">
                <span className="text-rosti-fiber-green">Frontiers in Nutrition</span>
                <a
                  href="https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2024.1510564/full"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [1]
                </a>
                <span className="text-rosti-fiber-green">|</span>
                <span className="text-rosti-fiber-green">Cell Host & Microbe</span>
                <a
                  href="https://www.cell.com/cell-host-microbe/fulltext/S193131281830266X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [2]
                </a>
                <span className="text-rosti-fiber-green">|</span>
                <span className="text-rosti-fiber-green">News-Medical.net</span>
                <a
                  href="https://www.news-medical.net/health/The-Role-of-Fiber-in-Preventing-Chronic-Disease.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [3]
                </a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-2 mt-2 text-rosti-fiber-green">
                <span className="text-rosti-fiber-green">National Library of Medicine</span>
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10498976"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [4]
                </a>
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9268622"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [5]
                </a>
                <span className="text-rosti-fiber-green">|</span>
                <span className="text-rosti-fiber-green">PubMed</span>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/35471164/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [6]
                </a>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/36193993/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [7]
                </a>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/32142510/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rosti-fiber-green underline hover:no-underline"
                >
                  [8]
                </a>
              </div>
            </div>
          </div>
        </div>

      {/* Keresd a Rostit az irodai hűtőben Section */}
      <section className="py-10 bg-gradient-to-b from-rosti-brown to-rosti-brown-dark text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Keresd a Rostit az irodai hűtőben!
          </h2> */}
          
          <div className="space-y-4 mb-8">
            <p className="text-lg">
              <strong>Kérdés, visszajelzés, vélemény:</strong> hello@rosti.hu
            </p>
            <p className="text-lg">
              <strong>Rendelés:</strong> rendeles@rosti.hu
            </p>
          </div>
          
          <a
            href="mailto:hello@rosti.hu?subject=Érdeklődés a Rosti termékek iránt&body=Kedves Rosti csapat!%0D%0A%0D%0ATöbbet szeretnék megtudni a Rosti termékekről.%0D%0A%0D%0AKérem, küldjetek további információkat hogyan tudjuk megkóstólni és később rendelni.%0D%0A%0D%0AKöszönettel,%0D%0A[Név]"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-rosti-brown font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            Még jobban érdekel a Rosti!
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rosti-brown-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              &copy; 2025 Rosti. Minden jog fenntartva.
            </p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[101]"
          >
            <X size={32} />
          </button>

          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-[101] p-2"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-[101] p-2"
          >
            <ChevronRight size={40} />
          </button>

          {/* Main image */}
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={productImages[selectedImageIndex].src}
              alt={productImages[selectedImageIndex].alt}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              priority
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {productImages.length}
          </div>

          {/* Thumbnail navigation */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedImageIndex
                    ? 'border-white'
                    : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
          ></div>
        </div>
      )}
    </>
  );
}
