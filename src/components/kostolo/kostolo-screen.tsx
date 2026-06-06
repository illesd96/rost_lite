'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CheckCircle2, ChevronRight, XCircle, Loader2 } from 'lucide-react';
import { ScrollProgressIndicator } from './scroll-progress-indicator';

type AnswerStatus = 'idle' | 'loading' | 'revealed';

export default function KostoloScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'quiz' | 'form' | 'success'>('quiz');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Quiz State
  const [answers, setAnswers] = useState<{ q1: string | null; q2: string | null; q3: string | null }>({ q1: null, q2: null, q3: null });
  const [statuses, setStatuses] = useState<{ q1: AnswerStatus; q2: AnswerStatus; q3: AnswerStatus }>({ q1: 'idle', q2: 'idle', q3: 'idle' });

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);
  const [validUntil, setValidUntil] = useState<Date | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isQuizComplete = statuses.q1 === 'revealed' && statuses.q2 === 'revealed' && statuses.q3 === 'revealed';
  const isFormValid = name.trim() !== '' && email.includes('@') && acceptedTerms;

  const handleAnswer = (q: 'q1' | 'q2' | 'q3', val: string) => {
    if (statuses[q] !== 'idle') return;
    setAnswers(prev => ({ ...prev, [q]: val }));
    setStatuses(prev => ({ ...prev, [q]: 'loading' }));
    setTimeout(() => {
      setStatuses(prev => ({ ...prev, [q]: 'revealed' }));
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Kérjük, fogadd el a feltételeket a továbblépéshez!");
      return;
    }
    if (name.trim() === '' || !email.includes('@')) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/kostolo/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          acceptedTerms,
          acceptedMarketing,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Hiba történt a regisztráció során.');
      }
      const data = (await res.json()) as { ticketNumber: string; validUntil: string };
      setTicketNumber(data.ticketNumber);
      setValidUntil(new Date(data.validUntil));
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans mb-10 pb-20">
      {step === 'quiz' && (
        <div className="md:hidden">
          <ScrollProgressIndicator />
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-4 h-[68px] sticky top-0 z-40">
        <div className="w-9 flex items-center justify-start">
        </div>

        <div
          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.rosti.hu/_next/image?url=%2Fimages%2Flogo.png&w=256&q=75"
            alt="Rosti"
            className="h-8 w-auto object-contain"
          />
        </div>

        <div className="w-9" />
      </div>

      <div className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 mt-4">
        {step === 'quiz' && (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
                <h1 className="text-[28px] sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-[1.1] text-balance mb-5">
                  Ismerd meg a <br /><span className="text-[#0B5D3F]">Rosti smoothie-t!</span>
                </h1>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti%20HomePage%20bottle_P_tr.png"
                    alt="Rosti smoothie"
                    className="h-32 sm:h-40 w-auto object-contain mx-auto mb-6 drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />

                <p className="text-gray-500 text-sm">
                  Készen állsz egy frissítő Rosti kóstolóra?<br />
                  3 rövid kérdés, és már a kezedbe is adjuk.
                </p>
            </div>

            <div className="space-y-8">
                {/* Q1 */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="font-bold text-gray-900 mb-4 text-center text-pretty">Mi a legnagyobb biológiai különbség egy sima préselt juice és az általad választott Rosti között?</p>
                    <div className="flex flex-col gap-3">
                        {[
                          { id: '1a', text: 'A préselt juice-nál a rost nagy része elvész a sajtolás során. A Rostiban a növény teljes rosttartalma megmarad.' },
                          { id: '1b', text: 'Nincs érdemi különbség, mindkettő "folyékony vitamin", csak az állaguk más egy kicsit.' }
                        ].map(opt => {
                           const isSelected = answers.q1 === opt.id;
                           const isRevealed = statuses.q1 === 'revealed';
                           const isLoading = statuses.q1 === 'loading';
                           const correctId = '1a';

                           let btnClass = 'border-gray-100 text-gray-600 hover:border-gray-200 bg-white';
                           let Icon = null;

                           if (isLoading && isSelected) {
                               btnClass = 'border-[#0B5D3F]/40 bg-emerald-50/20 text-gray-600';
                               Icon = <Loader2 size={18} className="animate-spin text-[#0B5D3F]" />;
                           } else if (isRevealed) {
                               if (opt.id === correctId) {
                                   btnClass = 'border-[#0B5D3F] bg-emerald-50 text-[#0B5D3F]';
                                   Icon = <CheckCircle2 size={18} className="text-[#0B5D3F]" />;
                               } else if (isSelected) {
                                   btnClass = 'border-red-700 bg-red-50 text-red-700';
                                   Icon = <XCircle size={18} className="text-red-700" />;
                               } else {
                                   btnClass = 'border-gray-50 text-gray-400 bg-gray-50/50 opacity-60';
                               }
                           } else if (statuses.q1 !== 'idle') {
                               btnClass = 'border-gray-100/50 text-gray-400 bg-gray-50/50 opacity-60';
                           }

                           return (
                               <button
                                  key={opt.id}
                                  disabled={statuses.q1 !== 'idle'}
                                  onClick={() => handleAnswer('q1', opt.id)}
                                  className={`p-4 flex items-center justify-between gap-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${btnClass}`}
                               >
                                  <span>{opt.text}</span>
                                  {Icon && <span className="shrink-0">{Icon}</span>}
                               </button>
                           );
                        })}
                    </div>
                </div>

                {/* Q2 */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="font-bold text-gray-900 mb-4 text-center text-pretty">Miért leszel kevésbé éhes rögtön azután, hogy megiszol egy Rostit?</p>
                    <div className="flex flex-col gap-3">
                        {[
                          { id: '2a', text: 'Mert a sok folyadék megnyújtja a gyomorfalat, így egy sima rostmentes zöldséglé is órákra eltelít.' },
                          { id: '2b', text: 'A rostban gazdag zöldségek segíthetnek a teltségérzet fenntartásában.' }
                        ].map(opt => {
                           const isSelected = answers.q2 === opt.id;
                           const isRevealed = statuses.q2 === 'revealed';
                           const isLoading = statuses.q2 === 'loading';
                           const correctId = '2b';

                           let btnClass = 'border-gray-100 text-gray-600 hover:border-gray-200 bg-white';
                           let Icon = null;

                           if (isLoading && isSelected) {
                               btnClass = 'border-[#0B5D3F]/40 bg-emerald-50/20 text-gray-600';
                               Icon = <Loader2 size={18} className="animate-spin text-[#0B5D3F]" />;
                           } else if (isRevealed) {
                               if (opt.id === correctId) {
                                   btnClass = 'border-[#0B5D3F] bg-emerald-50 text-[#0B5D3F]';
                                   Icon = <CheckCircle2 size={18} className="text-[#0B5D3F]" />;
                               } else if (isSelected) {
                                   btnClass = 'border-red-700 bg-red-50 text-red-700';
                                   Icon = <XCircle size={18} className="text-red-700" />;
                               } else {
                                   btnClass = 'border-gray-50 text-gray-400 bg-gray-50/50 opacity-60';
                               }
                           } else if (statuses.q2 !== 'idle') {
                               btnClass = 'border-gray-100/50 text-gray-400 bg-gray-50/50 opacity-60';
                           }

                           return (
                               <button
                                  key={opt.id}
                                  disabled={statuses.q2 !== 'idle'}
                                  onClick={() => handleAnswer('q2', opt.id)}
                                  className={`p-4 flex items-center justify-between gap-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${btnClass}`}
                               >
                                  <span>{opt.text}</span>
                                  {Icon && <span className="shrink-0">{Icon}</span>}
                               </button>
                           );
                        })}
                    </div>
                </div>

                {/* Q3 */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="font-bold text-gray-900 mb-4 text-center text-pretty">Sokan úgy tudják, a rost csak egy mechanikus "belső seprű" az emésztéshez. Mi a valódi, tudományos szuperképessége?</p>
                    <div className="flex flex-col gap-3">
                        {[
                          { id: '3a', text: 'Az élelmi rost a bélrendszerben élő jótékony baktériumok tápláléka, ami hozzájárulhat az egészséges bélflóra fenntartásához.' },
                          { id: '3b', text: 'Nincs más szerepe, a rostok feladata kizárólag az, hogy felgyorsítsák az anyagcserét és tisztítsák a beleket.' }
                        ].map(opt => {
                           const isSelected = answers.q3 === opt.id;
                           const isRevealed = statuses.q3 === 'revealed';
                           const isLoading = statuses.q3 === 'loading';
                           const correctId = '3a';

                           let btnClass = 'border-gray-100 text-gray-600 hover:border-gray-200 bg-white';
                           let Icon = null;

                           if (isLoading && isSelected) {
                               btnClass = 'border-[#0B5D3F]/40 bg-emerald-50/20 text-gray-600';
                               Icon = <Loader2 size={18} className="animate-spin text-[#0B5D3F]" />;
                           } else if (isRevealed) {
                               if (opt.id === correctId) {
                                   btnClass = 'border-[#0B5D3F] bg-emerald-50 text-[#0B5D3F]';
                                   Icon = <CheckCircle2 size={18} className="text-[#0B5D3F]" />;
                               } else if (isSelected) {
                                   btnClass = 'border-red-700 bg-red-50 text-red-700';
                                   Icon = <XCircle size={18} className="text-red-700" />;
                               } else {
                                   btnClass = 'border-gray-50 text-gray-400 bg-gray-50/50 opacity-60';
                               }
                           } else if (statuses.q3 !== 'idle') {
                               btnClass = 'border-gray-100/50 text-gray-400 bg-gray-50/50 opacity-60';
                           }

                           return (
                               <button
                                  key={opt.id}
                                  disabled={statuses.q3 !== 'idle'}
                                  onClick={() => handleAnswer('q3', opt.id)}
                                  className={`p-4 flex items-center justify-between gap-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${btnClass}`}
                               >
                                  <span>{opt.text}</span>
                                  {Icon && <span className="shrink-0">{Icon}</span>}
                               </button>
                           );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <button
                    disabled={!isQuizComplete}
                    onClick={() => {
                        setStep('form');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full py-4 rounded-full font-bold shadow-sm flex items-center justify-center gap-2 transition-all ${
                        isQuizComplete
                            ? 'bg-[#0B5D3F] text-white hover:bg-[#147A55]'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Tovább a kóstolóhoz
                    <ChevronRight size={18} />
                </button>
            </div>
          </div>
        )}

        {step === 'form' && (
           <div className="animate-fade-up">
               <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-[28px] sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-[1.1] text-balance mb-4">
                      A frissítőd <br /><span className="text-[#0B5D3F]">már vár rád!</span>
                    </h1>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti%20HomePage%20bottle_P_tr.png"
                        alt="Rosti smoothie"
                        className="h-32 sm:h-40 w-auto object-contain mx-auto mb-6 drop-shadow-xl hover:scale-105 transition-transform duration-500"
                    />

                    <p className="text-gray-500 text-[13px] leading-relaxed">
                        Kinek és hova küldhetjük a kóstolójegyet?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Név</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoComplete="name"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">E-mail cím</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-700 transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <div className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${acceptedMarketing ? 'bg-emerald-50/50 border-[#0B5D3F]/30' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`} onClick={() => setAcceptedMarketing(!acceptedMarketing)}>
                            <div className={`mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-lg transition-colors ${acceptedMarketing ? 'bg-[#0B5D3F] border-[#0B5D3F]' : 'bg-white border-2 border-gray-300'}`}>
                                {acceptedMarketing && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <div className={`text-[13px] select-none ${acceptedMarketing ? 'text-emerald-900/80' : 'text-gray-500'}`}>
                                <span className={`font-medium leading-snug block mt-0 ${acceptedMarketing ? 'text-emerald-900' : 'text-gray-700'}`}>
                                    Hozzájárulok, hogy e-mailben értesítést kapjak a <a href="/nyilt-nap-szabalyzat#munkaltatoi-program" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`font-bold underline ${acceptedMarketing ? 'text-[#0B5D3F] hover:text-[#147A55]' : 'text-gray-800'}`}>Rosti munkahelyi prémium zöldség-smoothie programról</a>. A hozzájárulásom bármikor visszavonható.
                                </span>
                            </div>
                        </div>

                        <div className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${acceptedTerms ? 'bg-emerald-50/50 border-[#0B5D3F]/30' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`} onClick={() => setAcceptedTerms(!acceptedTerms)}>
                            <div className={`mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-lg transition-colors ${acceptedTerms ? 'bg-[#0B5D3F] border-[#0B5D3F]' : 'bg-white border-2 border-gray-300'}`}>
                                {acceptedTerms && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <div className={`text-[13px] select-none ${acceptedTerms ? 'text-emerald-900/80' : 'text-gray-500'}`}>
                                <span className={`font-medium leading-snug ${acceptedTerms ? 'text-emerald-900' : 'text-gray-700'}`}>
                                    Elolvastam és elfogadom a <a href="/nyilt-nap-szabalyzat#vasarlas" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`font-bold underline ${acceptedTerms ? 'text-[#0B5D3F] hover:text-[#147A55]' : 'text-gray-800'}`}>Nyílt Napi Vásárlási és Kóstoló Szabályzatot</a>, és tudomásul veszem az <a href="/nyilt-nap-szabalyzat#adatkezeles" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`font-bold underline ${acceptedTerms ? 'text-[#0B5D3F] hover:text-[#147A55]' : 'text-gray-800'}`}>Adatkezelési Tájékoztatót</a>.
                                </span>
                            </div>
                        </div>
                    </div>

                    {submitError && (
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-700 text-center">
                            {submitError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className={`w-full mt-8 py-4 rounded-full font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                            isFormValid && !isSubmitting
                                ? 'bg-[#0B5D3F] text-white hover:bg-[#147A55]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Kóstolójegy igénylése...
                          </>
                        ) : (
                          'Kérem a kóstolójegyem!'
                        )}
                    </button>
                </form>
           </div>
        )}

        {step === 'success' && (
            <div className="animate-fade-up text-center h-full flex flex-col items-center mt-2">
                <div className="bg-white p-6 sm:p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden w-full max-w-sm mx-auto border border-gray-100">
                    <div className="relative z-10 flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti_double_white-bg_PNG.png"
                            alt="Rosti koccintás"
                            className="h-40 w-auto object-contain mb-8 drop-shadow-xl animate-bounce-slow"
                        />

                        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Kész is!</h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-10 text-balance">
                            Mutasd fel ezt a pultnál, és vedd át a friss Rostid!
                        </p>

                        <div className="relative w-full h-40 flex flex-col items-center justify-center -mt-4 mb-4 overflow-visible">
                            {/* Vegetables */}
                            <div className="flex items-end justify-center w-full -space-x-5 px-2 z-20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/tr_png_ce%CC%81kla.png" alt="cékla" className="w-16 h-16 object-contain -rotate-12 animate-bounce drop-shadow-md z-10" style={{ animationDelay: '0ms', animationDuration: '2.5s' }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/tr_png_kaposzta.png" alt="káposzta" className="w-16 h-16 object-contain rotate-6 animate-bounce drop-shadow-md z-20" style={{ animationDelay: '400ms', animationDuration: '2.8s' }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/tr_png_re%CC%81pa.png" alt="répa" className="w-16 h-16 object-contain rotate-12 animate-bounce drop-shadow-md z-10" style={{ animationDelay: '800ms', animationDuration: '2.4s' }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/tr_png_uborka.png" alt="uborka" className="w-14 h-14 object-contain -rotate-6 animate-bounce drop-shadow-md z-30" style={{ animationDelay: '200ms', animationDuration: '2.7s' }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/tr_png_zellergumo.png" alt="zellergumó" className="w-16 h-16 object-contain rotate-12 animate-bounce drop-shadow-md z-20" style={{ animationDelay: '600ms', animationDuration: '2.6s' }} />
                            </div>

                            {/* Floating Texts Bottom */}
                            <div className="font-black text-2xl sm:text-3xl tracking-widest uppercase text-[#0B5D3F] drop-shadow-sm animate-bounce pointer-events-none mt-2" style={{ animationDelay: '700ms', animationDuration: '2.9s' }}>
                                FRISS &bull; NYERS
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-full px-6 py-3 mt-4">
                            <p className="font-mono font-bold text-2xl text-gray-900">#{ticketNumber}</p>
                        </div>

                        {validUntil && (
                            <div className="mt-3 text-center">
                                <p className="text-[#0B5D3F] font-bold text-sm tracking-wide bg-emerald-50 px-4 py-1.5 rounded-full inline-block lowercase">
                                    érvényes: {validUntil.getFullYear()}. {String(validUntil.getMonth() + 1).padStart(2, '0')}. {String(validUntil.getDate()).padStart(2, '0')}. {String(validUntil.getHours()).padStart(2, '0')}:{String(validUntil.getMinutes()).padStart(2, '0')}-ig
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D3F]/5 to-transparent z-0 pointer-events-none"></div>
                </div>

                <div className="mt-6 flex flex-col gap-3 w-full max-w-sm mx-auto">
                    <button
                      onClick={() => router.push('/nyiltnap')}
                      className="w-full py-3 rounded-full bg-transparent text-[#0B5D3F]/80 font-semibold hover:text-[#0B5D3F] hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      Szeretnél még többet? Vásárolj kedvezményesen &rarr;
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
