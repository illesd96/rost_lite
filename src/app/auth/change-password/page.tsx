'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validations';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError('root', { message: result.error || 'Hiba történt a jelszó módosítása közben.' });
        return;
      }

      setSuccess(true);
      // Update the session to reflect the password change
      await update({ requirePasswordChange: false });
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/modern-shop');
        router.refresh();
      }, 2000);
    } catch {
      setError('root', { message: 'Valami hiba történt. Kérjük, próbálja újra.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 animate-fade-in bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background.jpeg')" }}
    >
      <main className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 dark:border-gray-800">
          <header className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#0B5D3F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {success ? (
                <ShieldCheck className="w-8 h-8 text-[#0B5D3F]" />
              ) : (
                <Lock className="w-8 h-8 text-[#0B5D3F]" />
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {success ? 'Jelszó megváltoztatva!' : 'Jelszó módosítása'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {success
                ? 'Átirányítás a főoldalra...'
                : 'Az első bejelentkezéshez kötelező új jelszót beállítani.'}
            </p>
          </header>

          {success ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                A jelszavad sikeresen megváltozott. Átirányítunk...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errors.root && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-700 text-sm font-medium">{errors.root.message}</p>
                </div>
              )}

              <div>
                <label htmlFor="currentPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  Jelenlegi jelszó
                </label>
                <div className="relative">
                  <input
                    {...register('currentPassword')}
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    placeholder="Írd be a jelenlegi jelszavad"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B5D3F] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#0B5D3F] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  Új jelszó
                </label>
                <div className="relative">
                  <input
                    {...register('newPassword')}
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    placeholder="Írd be az új jelszavad"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B5D3F] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#0B5D3F] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">Min. 8 karakter, 1 nagybetű, 1 kisbetű, 1 szám</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  Új jelszó megerősítése
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="Írd be újra az új jelszavad"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B5D3F] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#0B5D3F] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0B5D3F] text-white hover:bg-[#147A55] font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0B5D3F]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Mentés...' : 'Jelszó módosítása'}
                </button>
              </div>
            </form>
          )}

          <footer className="mt-6 text-center">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#0B5D3F] transition-colors"
            >
              Kijelentkezés
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
