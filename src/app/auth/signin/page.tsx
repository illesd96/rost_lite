'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/lib/validations';
import { Eye, EyeOff, ArrowLeft, ChevronDown, Users, ArrowRight } from 'lucide-react';
import WaitlistModal from '@/components/modern-shop/waitlist-modal';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('root', { message: 'Érvénytelen email cím vagy jelszó' });
      } else {
        await getSession();
        router.push('/modern-shop');
        router.refresh();
      }
    } catch {
      setError('root', { message: 'Valami hiba történt. Kérjük, próbálja újra.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 animate-fade-in bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background.jpeg')" }}
    >
      {/* Floating back button */}
      <button
        onClick={() => router.push('/modern-shop')}
        className="absolute top-6 left-6 z-40 flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg hover:bg-white/30 transition-all group"
      >
        <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>

      <main className="relative z-10 w-full max-w-6xl mx-auto py-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left card */}
          <div className="flex flex-col w-full items-center lg:items-start">
            <div
              onClick={handleScrollDown}
              className="hidden lg:flex flex-col items-center text-white mb-2 animate-bounce cursor-pointer hover:text-[#0B5D3F] transition-colors w-full"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest mb-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">Miért a Rosti?</span>
              <ChevronDown size={24} strokeWidth={2.5} className="drop-shadow-md" />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 w-full max-w-lg">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                Minőség. <span className="text-[#0B5D3F]">Kompromisszumok nélkül.</span>
              </h2>

              <div className="h-1.5 w-16 bg-[#0B5D3F] rounded-full mb-5"></div>

              <div className="text-lg leading-relaxed">
                <p className="text-gray-700 font-medium">
                  Legszívesebben minden irodai hűtőt feltöltenénk, de a frissességből nem engedünk. Nincs tömeggyártás, a napi kapacitásunk véges.
                </p>
                <p className="text-[#0B5D3F] font-bold mt-3">
                  Biztosítsd be az irodád helyét előre, és elsők között értesítünk, amint szállítani tudunk hozzátok.
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 my-5"></div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Még nincs fiókod?</p>

              <button
                type="button"
                onClick={() => setShowWaitlist(true)}
                className="group flex items-center gap-3 text-left w-full p-4 rounded-2xl border-2 border-dashed border-[#0B5D3F]/20 hover:border-[#0B5D3F] hover:bg-[#EDF7F3] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center group-hover:bg-[#0B5D3F] transition-colors">
                  <Users className="w-6 h-6 text-[#0B5D3F] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">ÚJ IRODÁKNAK</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Szóljatok, ha tölthetem a hűtőt!</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#0B5D3F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                vagy <a href="mailto:rendeles@rosti.hu" className="font-bold text-[#0B5D3F] hover:text-[#147A55] transition-colors no-underline">írj nekünk</a>
              </p>
            </div>
          </div>

          {/* Right card - Login form */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-auto border border-gray-100 dark:border-gray-800 relative">
            <header className="mb-8">
              <img src="/images/logo.png" alt="Rosti" className="h-10 sm:h-12 w-auto object-contain mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Lépj be, és töltsd fel a csapat hűtőjét.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errors.root && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-700 text-sm font-medium">{errors.root.message}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 ml-1">Email cím</label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="írd be az email címed"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B5D3F] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 ml-1">Jelszó</label>
                <div className="relative group">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="írd be a jelszavad"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B5D3F] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-[#0B5D3F] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0B5D3F] text-white hover:bg-[#147A55] font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0B5D3F]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Bejelentkezés...' : 'Belépés'}
                </button>
              </div>
            </form>

            <footer className="mt-10 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Probléma a belépéssel?{' '}
                <a href="mailto:rendeles@rosti.hu" className="font-bold text-gray-900 dark:text-gray-100 hover:text-[#147A55] transition-colors underline underline-offset-2">
                  Írj nekünk
                </a>
              </p>

              <div
                onClick={handleScrollDown}
                className="mt-8 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 lg:hidden animate-bounce cursor-pointer hover:text-[#0B5D3F] transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Miért a Rosti?</span>
                <ChevronDown size={20} strokeWidth={2.5} />
              </div>
            </footer>
          </div>
        </div>
      </main>

      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </div>
  );
}
