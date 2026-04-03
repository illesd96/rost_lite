import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rendelés - Rosti Zöldségitalok | Friss Házhoz Szállítás',
  description:
    'Rendelj friss Rosti zöldségitalokat az irodádba. Egyszerű online rendelés, hűtött házhoz szállítás Budapesten.',
  openGraph: {
    title: 'Rendelés - Rosti Zöldségitalok',
    description:
      'Rendelj friss Rosti zöldségitalokat az irodádba. Házhoz szállítás Budapesten.',
    url: 'https://rosti.hu/modern-shop',
    type: 'website',
    locale: 'hu_HU',
    siteName: 'Rosti',
  },
  alternates: {
    canonical: 'https://rosti.hu/modern-shop',
  },
};

export default function ModernShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
