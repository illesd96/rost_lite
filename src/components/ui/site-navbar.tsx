'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, User, LogOut, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

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

  const isLoggedIn = !!session?.user;

  return (
    <nav className={`${relative ? 'sticky top-0' : 'fixed top-0 left-0 right-0'} z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all`}>
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Rosti"
            width={160}
            height={40}
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          {/* User menu (when logged in) */}
          {isLoggedIn && session?.user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium select-none transition-all bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-24 truncate hidden sm:inline text-xs">{session.user.email}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
                      <p className="text-xs text-gray-500">Bejelentkezve</p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Kijelentkezés
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Order CTA */}
          {!hideOrderCta && (
            <Link
              href="/modern-shop"
              className="group flex items-center gap-3 cursor-pointer select-none"
            >
              <span className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg group-hover:bg-[#147A55] group-hover:shadow-[#0B5D3F]/20 group-hover:scale-105">
                <span>RENDELEK</span>
                <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </span>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.imgur.com/h8taJcy.png"
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
