'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/lib/validations';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        // Refresh session and redirect
        await getSession();
        router.push('/shop');
        router.refresh();
      }
    } catch (error) {
      setError('root', { message: 'Valami hiba történt. Kérjük, próbálja újra.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: 'url(/images/login-background.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay with low opacity */}
      <div className="absolute inset-0 bg-white bg-opacity-20"></div>
      
      {/* Container for both boxes */}
      <div className="max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Quality First Box - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Minőség elsőként.</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Kézműves, nem tömegtermékekkel dolgozunk. 
                  A prémium minőség garantálásához a Rosti 
                  vásárlói közösséget fokozatosan bővítjük.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <p className="text-center text-gray-600">
                    Ha érdekel a Rosti, <span className="text-primary-600 font-semibold">írj nekünk</span>, felvesszük a 
                    kapcsolatot az első szállítás egyeztetéséhez.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="w-full">
            {/* Quality First Box - Shown only on mobile */}
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Minőség elsőként.</h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Kézműves, nem tömegtermékekkel dolgozunk. 
                    A prémium minőség garantálásához a Rosti 
                    vásárlói közösséget fokozatosan bővítjük.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <p className="text-center text-gray-600 text-sm">
                      Ha érdekel a Rosti, <span className="text-primary-600 font-semibold">írj nekünk</span>, felvesszük a 
                      kapcsolatot az első szállítás egyeztetéséhez.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Vissza a főoldalra
                </Link>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Rosti rendelési portál</h2>
                <p className="text-gray-600">Jelentkezz be a következő rendelésed leadásához</p>
              </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email cím
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Adja meg az email címét"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Jelszó
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Adja meg a jelszavát"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Nincs még fiókja?{' '}
                <a 
                  href="mailto:info@webshop.com?subject=Fiók létrehozása kérés&body=Kedves Webshop csapat,%0D%0A%0D%0AKérem, hozzanak létre egy fiókot a következő email címmel:%0D%0A%0D%0AEmail: [ide írja be az email címét]%0D%0A%0D%0AKöszönettel"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Írj nekünk
                </a>
              </p>
            </div>
          </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
