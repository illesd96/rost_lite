'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { WebshopIcon } from './webshop-icon';
import { Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
  const pathname = usePathname();
  const showHomeIcon = pathname?.includes('/osszetevok');
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-950/50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Cart icon linking to /shop */}
          <div className="flex items-center">
            <Link
              href="/modern-shop"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg transition-colors"
              aria-label="Shop"
              title="Shop"
            >
              <WebshopIcon className="w-5 h-5 md:w-12 md:h-12" />
            </Link>
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

          {/* Right side - Theme toggle + Home icon */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {showHomeIcon ? (
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg transition-colors"
                aria-label="Home"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </Link>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
