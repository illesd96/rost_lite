import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adatkezelési Tájékoztató - Rosti',
  description:
    'A Rosti B2B online felület adatkezelési tájékoztatója. Tudj meg mindent személyes adataid kezeléséről.',
  openGraph: {
    title: 'Adatkezelési Tájékoztató - Rosti',
    description: 'A Rosti adatkezelési tájékoztatója.',
    url: 'https://rosti.hu/adatkezeles',
    type: 'website',
    locale: 'hu_HU',
    siteName: 'Rosti',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://rosti.hu/adatkezeles',
  },
};

export default function AdatkezelesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
