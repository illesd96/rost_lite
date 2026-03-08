'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/lib/validations';
import { Eye, EyeOff, ChevronLeft, ChevronDown, Users } from 'lucide-react';
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
        router.push('/shop');
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
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background.jpeg')" }}
    >
      <main className="w-full max-w-6xl mx-auto py-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left card */}
          <div className="flex flex-col w-full items-center lg:items-start">
            <div
              onClick={handleScrollDown}
              className="hidden lg:flex flex-col items-center text-white mb-2 animate-bounce cursor-pointer hover:text-emerald-300 transition-colors w-full"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest mb-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">Miért a Rosti?</span>
              <ChevronDown size={24} strokeWidth={2.5} className="drop-shadow-md" />
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 w-full max-w-lg">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-900 tracking-tight leading-tight">
                Minőség <span className="text-green-600">elsőként.</span>
              </h2>

              <div className="h-1.5 w-16 bg-emerald-500 rounded-full mb-5"></div>

              <div className="text-lg leading-relaxed text-gray-700">
                <p>
                  Kézműves, nem tömegtermékkel dolgozunk. <br className="hidden sm:inline" />
                  <span className="text-green-600 font-bold">A prémium minőség garantálásához <br className="hidden sm:inline" />a Rosti vásárlói közösséget fokozatosan bővítjük.</span>
                </p>
              </div>

              <div className="border-t border-gray-100 my-5"></div>

              <p className="text-sm text-gray-500 mb-3">Még nincs fiókod?</p>

              <button
                type="button"
                onClick={() => setShowWaitlist(true)}
                className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer group w-full text-left"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Users className="w-6 h-6 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Új partnereknek</p>
                  <p className="text-sm font-semibold text-gray-900">Várólistára jelentkezem</p>
                </div>
              </button>

              <p className="text-sm text-gray-500 mt-4">
                vagy <a href="mailto:rendeles@rosti.hu" className="font-bold text-green-600 hover:text-green-700 transition-colors no-underline">írj nekünk emailt</a>
              </p>
            </div>
          </div>

          {/* Right card - Login form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-auto border border-gray-100 relative">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-700 mb-8 transition-colors group no-underline"
            >
              <ChevronLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Vissza a főoldalra
            </Link>

            <header className="mb-8">
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 text-gray-900 tracking-tight leading-tight whitespace-nowrap">
                <span className="text-green-600">Rosti</span> rendelés
              </h1>
              <p className="text-gray-500 mt-2 text-sm">Jelentkezz be a következő rendelésed leadásához</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm font-medium">{errors.root.message}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 ml-1">Email cím</label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="írd be az email címed"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900 disabled:opacity-50"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 ml-1">Jelszó</label>
                <div className="relative group">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="írd be a jelszavad"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none"
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
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Bejelentkezés...' : 'Belépés'}
                </button>
              </div>
            </form>

            <footer className="mt-10 text-center border-t border-gray-100 pt-8">
              <p className="text-sm text-gray-500">
                Probléma a belépéssel?{' '}
                <a href="mailto:rendeles@rosti.hu" className="font-bold text-gray-900 hover:text-emerald-700 transition-colors underline underline-offset-2">
                  Írj nekünk
                </a>
              </p>

              <div
                onClick={handleScrollDown}
                className="mt-8 flex flex-col items-center justify-center text-gray-400 lg:hidden animate-bounce cursor-pointer hover:text-emerald-600 transition-colors"
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
