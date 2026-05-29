'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { OpenDaySuccessCard } from '@/components/open-day/open-day-success-card';

const LOGO_URL = 'https://www.rosti.hu/_next/image?url=%2Fimages%2Flogo.png&w=256&q=75';

function OpenDaySuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get('order') || '';
  const quantity = parseInt(searchParams.get('qty') || '0', 10);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans pb-20">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-center px-4 h-[68px] sticky top-0 z-40">
        <button onClick={() => router.push('/')} className="flex items-center justify-center hover:opacity-80 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="Rosti" className="h-8 w-auto object-contain" />
        </button>
      </div>

      <div className="flex-grow p-4 sm:p-6 w-full max-w-md mx-auto mt-6">
        <OpenDaySuccessCard
          orderNumber={orderNumber}
          quantity={quantity}
          onReset={() => router.push('/nyiltnap')}
        />
      </div>
    </div>
  );
}

export default function OpenDaySuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B5D3F]"></div>
        </div>
      }
    >
      <OpenDaySuccessContent />
    </Suspense>
  );
}
