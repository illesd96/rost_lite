'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useCart } from 'react-use-cart';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';

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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/shop" className="text-xl font-bold text-primary-600">
              Premium WebShop
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/shop"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Orders
            </Link>
            
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-primary-600 p-2 rounded-md"
            >
              <ShoppingCart className="w-5 h-5" />
              {isClient && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {session.user.role === 'admin' && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{session.user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 p-1 rounded-md"
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
