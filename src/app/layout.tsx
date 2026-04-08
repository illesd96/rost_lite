import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { CartProvider } from '@/components/providers/cart-provider';
import { KeepAliveProvider } from '@/components/providers/keep-alive-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'Rosti - Friss Zöldségitalok Budapest | Természetes Vitaminok és Rostok',
  description: 'Friss és nyers zöldségekből készült Rosti italok Budapesten. Természetes vitaminok, rostok és tápanyagok. Házhoz szállítás egész Magyarországon. Egészséges életmód, tiszta összetevők.',
  keywords: 'rosti, zöldségital budapest, természetes vitaminok, egészséges italok, friss zöldség, nyers zöldségital, rostok, tápanyagok, házhoz szállítás budapest, egészséges életmód, tiszta összetevők, magyar zöldségital',
  authors: [{ name: 'Rosti Hungary' }],
  creator: 'Rosti',
  publisher: 'Rosti Hungary',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rosti.hu'),
  alternates: {
    canonical: 'https://rosti.hu',
    languages: {
      'hu-HU': 'https://rosti.hu',
    },
  },
  openGraph: {
    title: 'Rosti - Friss Zöldségitalok Budapest | Természetes Vitaminok',
    description: 'Friss és nyers zöldségekből készült Rosti italok Budapesten. Természetes vitaminok, rostok és tápanyagok. Házhoz szállítás egész Magyarországon.',
    url: 'https://rosti.hu',
    siteName: 'Rosti',
    images: [
      {
        url: 'https://rosti.hu/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rosti - Friss Zöldségitalok',
      },
    ],
    locale: 'hu_HU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rosti - Friss Zöldségitalok Budapest',
    description: 'Friss és nyers zöldségekből készült Rosti italok. Természetes vitaminok és rostok.',
    images: ['https://rosti.hu/images/logo.png'],
    creator: '@rosti_hungary',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code-here',
  },
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
    <html lang="hu" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/fav/apple-touch-icon.png" />
        <link rel="manifest" href="/images/fav/site.webmanifest" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <KeepAliveProvider>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors">
                  {children}
                </div>
              </KeepAliveProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
