import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { CartProvider } from '@/components/providers/cart-provider';
import { KeepAliveProvider } from '@/components/providers/keep-alive-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rosti - Friss és Természetes Zöldségitalok',
  description: 'Friss és nyers zöldségekből készült Rosti italok. Természetes vitaminok és rostok a napi egészségért.',
  keywords: 'rosti, zöldségital, természetes, egészséges, vitaminok, rostok, friss, nyers zöldségek',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/fav/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/images/fav/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/images/fav/site.webmanifest' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/fav/apple-touch-icon.png" />
        <link rel="manifest" href="/images/fav/site.webmanifest" />
      </head>
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
