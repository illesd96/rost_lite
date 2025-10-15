'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from 'react-use-cart';
import { User, LogOut, Settings } from 'lucide-react';
import { WebshopIcon } from './webshop-icon';

export function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const { totalItems } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (!session) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/shop" className="hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo.png"
                alt="Rosti"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/shop"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Orders
            </Link>
            
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-gray-900 p-0 rounded-lg transition-colors"
            >
              <WebshopIcon className="w-5 h-5" />
              {isClient && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>

            {session.user.role === 'admin' && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-gray-900 p-2 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}

            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{session.user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-red-600 p-1 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
