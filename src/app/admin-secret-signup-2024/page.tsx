'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpInput } from '@/lib/validations';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function SecretSignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError('root', { message: result.error || 'A regisztráció sikertelen' });
      } else {
        // Redirect to sign in page with success message
        router.push('/auth/signin?message=Fiók sikeresen létrehozva');
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
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza a főoldalra
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Fiók létrehozása</h2>
            <p className="text-gray-600">Hozzon létre egy új fiókot</p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                🔒 Ez egy titkos admin oldal fiók létrehozásához
              </p>
            </div>
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
                  placeholder="Hozzon létre egy jelszót (min. 6 karakter)"
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
              {isLoading ? 'Fiók létrehozása...' : 'Fiók létrehozása'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Már van fiókja?{' '}
                <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">
                  Bejelentkezés
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
