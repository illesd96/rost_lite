'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, User, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/components/providers/theme-provider';

interface SiteNavbarProps {
  /** If true, navbar is not fixed/sticky (for pages that manage their own scroll) */
  relative?: boolean;
  /** If true, adds top offset for promo bar */
  hasPromoBar?: boolean;
  /** If true, hides the RENDELEK button and veggie icon (e.g. when already in the shop) */
  hideOrderCta?: boolean;
}

export function SiteNavbar({ relative = false, hasPromoBar = false, hideOrderCta = false }: SiteNavbarProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isLoggedIn = !!session?.user;

  return (
    <nav className={`${relative ? 'sticky top-0' : 'fixed top-0 left-0 right-0'} z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all`}>
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Rosti"
            width={160}
            height={40}
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          {/* User menu / Guest login */}
          {isLoggedIn && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium select-none transition-all bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-24 truncate hidden sm:inline text-xs">{session.user.email}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bejelentkezve</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {theme === 'dark' ? 'Világos mód' : 'Sötét mód'}
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Kijelentkezés
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : hideOrderCta ? (
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest select-none cursor-pointer transition-all shadow-sm bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <User size={14} className="text-gray-400" />
              <span>Bejelentkezés</span>
            </Link>
          ) : null}

          {/* Order CTA */}
          {!hideOrderCta && (
            <Link
              href="/modern-shop"
              className="group flex items-center gap-3 cursor-pointer select-none"
            >
              <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg group-hover:bg-[#147A55] group-hover:shadow-[#0B5D3F]/20 group-hover:scale-105">
                <span>RENDELEK</span>
                <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/ROSTI_WEBSHOP_P_tr.png"
                alt="Friss zöldségek"
                className="h-14 w-auto object-contain hidden sm:block transition-transform duration-300 drop-shadow-sm -mb-2 group-hover:scale-110 group-hover:-rotate-3"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
