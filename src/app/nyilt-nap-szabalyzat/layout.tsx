import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nyílt Napi Vásárlási és Kóstoló Szabályzat - Rosti',
  description:
    'A Rosti nyílt napi vásárlási (Click & Collect) és kóstolási feltételei, valamint a kapcsolódó adatkezelési tájékoztató (GDPR).',
  openGraph: {
    title: 'Nyílt Napi Vásárlási és Kóstoló Szabályzat - Rosti',
    description:
      'A Rosti nyílt napi vásárlási és kóstolási feltételei, valamint a kapcsolódó adatkezelési tájékoztató (GDPR).',
    url: 'https://rosti.hu/nyilt-nap-szabalyzat',
    type: 'website',
    locale: 'hu_HU',
    siteName: 'Rosti',
  },
  alternates: {
    canonical: 'https://rosti.hu/nyilt-nap-szabalyzat',
  },
};

export default function NyiltNapSzabalyzatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
