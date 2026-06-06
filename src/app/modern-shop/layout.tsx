import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rendelés - Rosti Prémium Zöldség-Smoothie | Friss Házhoz Szállítás',
  description:
    'Rendelj friss Rosti prémium zöldség-smoothie-t az irodádba. Egyszerű online rendelés, hűtött házhoz szállítás Budapesten.',
  openGraph: {
    title: 'Rendelés - Rosti Prémium Zöldség-Smoothie',
    description:
      'Rendelj friss Rosti prémium zöldség-smoothie-t az irodádba. Házhoz szállítás Budapesten.',
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
