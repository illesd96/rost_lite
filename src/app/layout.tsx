import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { CartProvider } from '@/components/providers/cart-provider';
import { KeepAliveProvider } from '@/components/providers/keep-alive-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebShop - Premium Products',
  description: 'Your trusted webshop for premium products with secure payment and fast delivery.',
  keywords: 'webshop, online store, premium products, secure payment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <KeepAliveProvider>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {children}
              </div>
            </KeepAliveProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
