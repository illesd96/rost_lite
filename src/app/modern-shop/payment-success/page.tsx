'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      router.push('/modern-shop');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/modern-shop/verify-payment?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setOrderNumber(data.orderNumber);
          setStatus('success');

          localStorage.removeItem('modern-shop-state');
          localStorage.removeItem('modern-shop-screen');
          localStorage.removeItem('modern-shop-order-completed');
          localStorage.removeItem('modern-shop-completed-order-number');
          localStorage.removeItem('modern-shop-last-order-time');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-6" />
        <h2 className="text-xl font-bold text-gray-700">Fizetés ellenőrzése...</h2>
        <p className="text-gray-500 mt-2">Kérjük, ne zárd be az ablakot.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Fizetés feldolgozás alatt</h2>
          <p className="text-gray-500 mb-6">
            A fizetésed feldolgozás alatt van. Ha a fizetés sikeres volt, a rendelésed hamarosan megjelenik.
            Kérjük, ellenőrizd az e-mail fiókod.
          </p>
          <button
            onClick={() => router.push('/modern-shop')}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-colors"
          >
            Vissza a boltba
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight">Sikeres fizetés!</h2>
        <p className="text-gray-500 mb-2">A rendelésed sikeresen beérkezett és a fizetés feldolgozva.</p>
        {orderNumber && (
          <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rendelésszám</div>
            <div className="text-lg font-black text-emerald-700">{orderNumber}</div>
          </div>
        )}
        <p className="text-sm text-gray-400 mb-8">
          A visszaigazolást és a számla részleteit e-mailben is elküldjük.
        </p>
        <button
          onClick={() => {
            router.push('/modern-shop');
          }}
          className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl text-lg hover:bg-emerald-700 transition-colors active:scale-[0.98] transform shadow-lg"
        >
          Új rendelés indítása
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
