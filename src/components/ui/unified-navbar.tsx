'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

interface UnifiedNavbarProps {
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
}

export function UnifiedNavbar({ 
  showBackButton = false, 
  backHref = "/", 
  backText = "Vissza" 
}: UnifiedNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Back button or spacer */}
          <div className="flex items-center">
            {/* Temporarily commented out back button
            {showBackButton ? (
              <Link 
                href={backHref} 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {backText}
              </Link>
            ) : (
              <div className="w-16"></div> // Spacer for center alignment
            )}
            */}
          </div>

          {/* Center - Logo */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo.png"
                alt="Rosti"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Right side - Shop icon only */}
          <div className="flex items-center">
            {/* Temporarily commented out shop icon
            <Link
              href="/auth/signin"
              className="text-gray-700 hover:text-gray-900 p-3 transition-colors"
              title="Enter Shop"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            */}
          </div>
        </div>
      </div>
    </nav>
  );
}
