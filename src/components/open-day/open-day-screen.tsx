'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight, Lock, Plus, Minus, CreditCard as CardIcon, ChevronDown, Copy, CheckCircle2 } from 'lucide-react';
import { OPEN_DAY_UNIT_PRICE } from '@/types/modern-shop';
import { formatCurrency } from '@/lib/modern-shop-utils';
import { OpenDaySuccessCard } from './open-day-success-card';

type OpenDayStep = 'quantity' | 'billing' | 'payment' | 'transfer' | 'success';

// Event + bank-transfer details (edit here to update the page copy)
const EVENT = {
  dateLabel: '2026. június 7.',
  name: 'Struve Fitness nyíltnap',
  location: '1133 Budapest, Bessenyei utca 1.',
};
const BANK = {
  beneficiary: 'DAB Tanácsadó Kft.',
  account: '30400001-00000000-64323031',
};

const LOGO_URL = 'https://www.rosti.hu/_next/image?url=%2Fimages%2Flogo.png&w=256&q=75';

export default function OpenDayScreen() {
  const router = useRouter();
  const [step, setStep] = useState<OpenDayStep>('quantity');
  const billingRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const [quantity, setQuantity] = useState<number>(3);
  const [billingData, setBillingData] = useState({
    name: '',
    email: '',
    postcode: '',
    city: '',
    streetName: '',
    streetType: 'utca',
    houseNum: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const totalAmount = quantity * OPEN_DAY_UNIT_PRICE;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    if (step === 'billing' && billingRef.current) {
      setTimeout(() => {
        const y = billingRef.current!.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 50);
    } else if (step === 'payment' && paymentRef.current) {
      setTimeout(() => {
        const y = paymentRef.current!.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 50);
    } else if (step === 'transfer' || step === 'success') {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }
  }, [step]);

  const handleUpdateBilling = (field: string, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }));
  };

  const isBillingValid = () => {
    return (
      billingData.name.trim() !== '' &&
      billingData.email.includes('@') &&
      billingData.postcode.trim() !== '' &&
      billingData.city.trim() !== '' &&
      billingData.streetName.trim() !== '' &&
      billingData.houseNum.trim() !== ''
    );
  };

  const createOrder = async (method: 'card' | 'transfer') => {
    const res = await fetch('/api/open-day/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity,
        name: billingData.name,
        email: billingData.email,
        address: {
          postcode: billingData.postcode,
          city: billingData.city,
          streetName: billingData.streetName,
          streetType: billingData.streetType,
          houseNum: billingData.houseNum,
        },
        paymentMethod: method,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Hiba történt a rendelés során.');
    }
    return res.json() as Promise<{ orderNumber: string; url?: string }>;
  };

  const handleCardPay = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const { url } = await createOrder('card');
      if (url) {
        window.location.href = url; // redirect to Stripe Checkout
      } else {
        throw new Error('Nem sikerült elindítani a fizetést.');
      }
    } catch (e: any) {
      setError(e.message);
      setIsProcessing(false);
    }
  };

  const handleTransfer = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const { orderNumber: num } = await createOrder('transfer');
      setOrderNumber(num);
      setStep('transfer');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setQuantity(3);
    setBillingData({ name: '', email: '', postcode: '', city: '', streetName: '', streetType: 'utca', houseNum: '' });
    setPaymentMethod('card');
    setOrderNumber('');
    setError(null);
    setStep('quantity');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans mb-10 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 h-[68px] sticky top-0 z-40">
        <div className="w-9 flex items-center justify-start">
          {(step === 'billing' || step === 'payment') && (
            <button
              onClick={() => setStep(step === 'payment' ? 'billing' : 'quantity')}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
        </div>

        <button
          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="Rosti" className="h-8 w-auto object-contain" />
        </button>

        <div className="w-9" />
      </div>

      <div className="flex-grow p-4 sm:p-6 w-full max-w-md mx-auto">

        {(step === 'quantity' || step === 'billing' || step === 'payment') && (
          <div className="animate-fade-in text-center mt-6">
            <h1 className="text-[28px] sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-[1.1] text-balance mb-5">
              Hány palack<br /><span className="text-[#0B5D3F]">Rosti smoothie-t</span><br />kérsz?
            </h1>

            <div className="flex flex-col items-center justify-center mb-6 mt-2 relative">
              <div className="relative inline-block mt-4 mb-4">
                <div className="absolute top-[35%] -left-16 z-30 animate-bounce [animation-delay:200ms]">
                  <span className="text-[12px] font-black tracking-widest text-[#0B5D3F] uppercase whitespace-nowrap opacity-80 -rotate-[15deg] inline-block">5 zöldség</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti%20HomePage%20bottle_P_tr.png"
                  alt="Rosti palack"
                  className="h-[184px] w-auto object-contain -mt-4 -mb-2 relative z-10"
                />
                <div className="absolute top-[35%] -right-8 z-30 animate-bounce">
                  <span className="text-[12px] font-black tracking-widest text-[#0B5D3F] uppercase whitespace-nowrap opacity-80 rotate-[15deg] inline-block">250 ml</span>
                </div>
              </div>
              <span className="text-[13px] font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-wide">Prémium nyers zöldség-smoothie</span>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-4 flex flex-col items-center">
              <div className="flex items-center justify-center gap-6 mb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 rounded-full border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-[#0B5D3F] hover:text-[#0B5D3F] transition-colors bg-gray-50 dark:bg-gray-800 active:bg-gray-100"
                >
                  <Minus size={24} />
                </button>
                <div className="text-[42px] font-black text-[#0B5D3F] w-20 text-center leading-none">{quantity}</div>
                <button
                  onClick={() => setQuantity(Math.min(50, quantity + 1))}
                  className="w-14 h-14 rounded-full border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-[#0B5D3F] hover:text-[#0B5D3F] transition-colors bg-gray-50 dark:bg-gray-800 active:bg-gray-100"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="text-gray-400 dark:text-gray-500 font-bold pb-4 border-b border-gray-100 dark:border-gray-800 w-full mb-4 flex justify-center text-sm uppercase tracking-wider">
                <span>{quantity} palack</span>
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Összesen:</span>
                <span className="text-2xl font-black text-gray-900 dark:text-gray-100">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {step === 'quantity' && (
              <button
                onClick={() => setStep('billing')}
                className="w-full py-4 mt-0 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition-all bg-[#0B5D3F] text-white hover:bg-[#147A55] active:scale-95"
              >
                <span>Tovább a fizetéshez</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        {(step === 'billing' || step === 'payment') && (
          <div ref={billingRef} className="animate-fade-in mt-12 text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">Számlázási adatok</h2>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Név</label>
                <input
                  type="text"
                  value={billingData.name}
                  onChange={(e) => handleUpdateBilling('name', e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 dark:text-gray-300"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">E-mail cím</label>
                <input
                  type="email"
                  value={billingData.email}
                  onChange={(e) => handleUpdateBilling('email', e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 dark:text-gray-300"
                  autoComplete="email"
                />
                <span className="block text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-2 ml-1 normal-case tracking-normal">Ide küldjük elektronikus formában a számlát.</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Irányítószám</label>
                    <input
                      type="text"
                      value={billingData.postcode}
                      onChange={(e) => handleUpdateBilling('postcode', e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 dark:text-gray-300"
                      autoComplete="postal-code"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Város</label>
                    <input
                      type="text"
                      value={billingData.city}
                      onChange={(e) => handleUpdateBilling('city', e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 dark:text-gray-300"
                      autoComplete="address-level2"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Közterület</label>
                    <input
                      type="text"
                      value={billingData.streetName}
                      onChange={(e) => handleUpdateBilling('streetName', e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 dark:text-gray-300"
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="w-[105px] shrink-0 relative">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Típusa</label>
                    <div className="relative">
                      <select
                        value={billingData.streetType}
                        onChange={(e) => handleUpdateBilling('streetType', e.target.value)}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 dark:text-gray-300 appearance-none pr-10"
                      >
                        <option value="utca">utca</option>
                        <option value="út">út</option>
                        <option value="tér">tér</option>
                        <option value="sor">sor</option>
                        <option value="köz">köz</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="w-[85px] shrink-0">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Hsz.</label>
                    <input
                      type="text"
                      value={billingData.houseNum}
                      onChange={(e) => handleUpdateBilling('houseNum', e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {step === 'billing' && (
              <button
                onClick={() => setStep('payment')}
                disabled={!isBillingValid()}
                className={`w-full py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isBillingValid() ? 'bg-[#0B5D3F] text-white hover:bg-[#147A55] active:scale-95' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Tovább a fizetéshez</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        {step === 'payment' && (
          <div ref={paymentRef} className="animate-fade-in mt-12 text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">Fizetés</h2>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
              {/* Pickup info */}
              <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-lg bg-[#0B5D3F] flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <div className="text-sm text-emerald-900/80 dark:text-emerald-200/80 select-none flex flex-col gap-0.5">
                    <span className="font-medium text-emerald-900 dark:text-emerald-200">Rendelés átvétele fizetést követően azonnal</span>
                    <span className="font-bold text-emerald-950 dark:text-emerald-100 mt-1">{EVENT.dateLabel}</span>
                    <span className="font-medium">{EVENT.name}</span>
                    <span className="text-emerald-900/60 dark:text-emerald-200/50">{EVENT.location}</span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="space-y-3">
                <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#0B5D3F] bg-emerald-50/30 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}>
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#0B5D3F]' : 'border-gray-300 dark:border-gray-600'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#0B5D3F]" />}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100">Bankkártya, Apple&nbsp;Pay, Google&nbsp;Pay</span>
                    </div>
                    <CardIcon className={paymentMethod === 'card' ? 'text-[#0B5D3F]' : 'text-gray-400'} size={20} />
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/60 animate-fade-in">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                        <Lock size={14} />
                        <span className="text-sm">A biztonságos fizetési oldalra irányítunk.</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        A fizetés a Stripe biztonságos rendszerén keresztül történik. A kártya, Apple Pay és Google Pay lehetőség a következő oldalon érhető el.
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 block">Fizetendő összeg</span>
              <span className="text-3xl font-black text-gray-900 dark:text-gray-100">{formatCurrency(totalAmount)}</span>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-4 text-sm font-medium text-red-700 dark:text-red-300 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleCardPay}
              disabled={isProcessing}
              className={`w-full py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${
                !isProcessing ? 'bg-[#0B5D3F] text-white hover:bg-[#147A55] active:scale-95' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Átirányítás a fizetéshez...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Fizetek: {formatCurrency(totalAmount)}</span>
                </>
              )}
            </button>

            <div className="text-center mt-4 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium text-balance">
                A &apos;Fizetek&apos; gomb megnyomásával elfogadod az{' '}
                <a href="/altalanos-szerzodesi-feltetelek" target="_blank" rel="noopener noreferrer" className="font-bold text-[#0B5D3F] underline">ÁSZF</a>-et és az{' '}
                <a href="/adatkezeles" target="_blank" rel="noopener noreferrer" className="font-bold text-[#0B5D3F] underline">Adatkezelési Tájékoztatót</a>.
              </span>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleTransfer}
                disabled={isProcessing}
                className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 uppercase tracking-widest font-bold disabled:opacity-50"
              >
                Átutalással fizetek
              </button>
            </div>
          </div>
        )}

        {step === 'transfer' && (
          <div className="animate-fade-in text-center mt-14 sm:mt-16 bg-[#161B19] px-6 py-8 sm:p-8 rounded-[2rem] border border-gray-800 shadow-xl relative z-10">
            <div className="absolute left-1/2 -translate-x-1/2 -top-16 drop-shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti%20HomePage%20bottle_P_tr.png" alt="Rosti palack" className="h-32 w-auto object-contain" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 mt-12 relative z-10 tracking-tight">Már csak egy lépés</h2>
            <p className="text-gray-400 font-medium mb-8 relative z-10 text-balance leading-relaxed">
              Kérjük, egyenlítsd ki a rendelést banki átutalással:
            </p>

            <div className="bg-white border border-gray-100 rounded-2xl mb-8 relative z-10 text-left overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kedvezményezett neve</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">{BANK.beneficiary}</p>
                  <button onClick={() => handleCopy(BANK.beneficiary, 'name')} className="p-3 -m-3 text-gray-400 hover:text-gray-700 transition-colors" title="Másolás">
                    {copiedField === 'name' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="p-5 border-b border-gray-100 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bankszámlaszám</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-lg text-gray-900 tracking-tight">{BANK.account}</p>
                  <button onClick={() => handleCopy(BANK.account, 'account')} className="p-3 -m-3 text-gray-400 hover:text-gray-700 transition-colors" title="Másolás">
                    {copiedField === 'account' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="p-5 border-b border-gray-100 flex flex-col justify-center bg-gray-50/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Közlemény</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-gray-900 bg-white inline-block px-2 py-1 flex-wrap rounded shadow-sm border border-gray-200">#{orderNumber}</p>
                  <button onClick={() => handleCopy(`#${orderNumber}`, 'orderId')} className="p-3 -m-3 text-gray-400 hover:text-gray-700 transition-colors ml-2" title="Másolás">
                    {copiedField === 'orderId' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-center bg-emerald-50">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Összeg</p>
                <div className="flex items-center justify-between">
                  <p className="font-black text-gray-900 text-lg">{formatCurrency(totalAmount)}</p>
                  <button onClick={() => handleCopy(totalAmount.toString(), 'amount')} className="p-3 -m-3 text-gray-400 hover:text-gray-700 transition-colors" title="Másolás">
                    {copiedField === 'amount' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => setStep('success')} className="w-full bg-[#0B5D3F] text-white py-4 rounded-full font-bold shadow-sm hover:bg-[#147A55] transition-colors relative z-10">
              Kész vagyok!
            </button>
          </div>
        )}

        {step === 'success' && (
          <OpenDaySuccessCard orderNumber={orderNumber} quantity={quantity} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
