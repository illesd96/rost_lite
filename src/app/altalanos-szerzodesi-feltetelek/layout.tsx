import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Általános Szerződési Feltételek (ÁSZF) - Rosti',
  description:
    'A Rosti B2B online felület általános szerződési feltételei. Rendelés, fizetés, szállítás és garancia részletei.',
  openGraph: {
    title: 'Általános Szerződési Feltételek - Rosti',
    description: 'A Rosti ÁSZF részletei.',
    url: 'https://rosti.hu/altalanos-szerzodesi-feltetelek',
    type: 'website',
    locale: 'hu_HU',
    siteName: 'Rosti',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://rosti.hu/altalanos-szerzodesi-feltetelek',
  },
};

export default function AszfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
