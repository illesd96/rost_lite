'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingBag, Shield, Truck, CreditCard, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UnifiedNavbar } from '@/components/ui/unified-navbar';

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
      {/* Unified Navigation */}
      <UnifiedNavbar />
      
      {/* Full-Screen Hero Banner */}
      <div className="relative w-full h-screen">
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
                  Elkerülheted a vércukor-ingadozások miatti éhség érzetet, így a felesleges nasikat, no meg a hűtő előtti lelkiismeret-furdalást.
                </p>
            </div>

            {/* Meglepően finom */}
            <div className="text-center p-8">
              <div className="text-6xl mb-6">😋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Meglepően finom</h3>
              <p className="text-gray-600 leading-relaxed">
              Egyedi és frissítő ízvilága miatt még akik nehezen esznek meg elég zöldséget is könnyen megisszák. Na, kipróbálod?  

              </p>
            </div>
          </div>
        </div>
      </section>

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
