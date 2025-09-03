'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Shield, LogOut, Home } from 'lucide-react';

export function AdminNavbar() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center text-xl font-bold text-primary-600">
              <Shield className="w-6 h-6 mr-2" />
              Admin Panel
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/shop"
              className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Home className="w-4 h-4 mr-1" />
              View Shop
            </Link>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {session?.user.email}
              </span>
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Admin
              </span>
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
