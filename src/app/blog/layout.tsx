import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rosti Blog - Egészséges Életmód és Táplálkozási Tippek',
  description:
    'Tudományos háttér, tippek és érdekességek az egészséges irodai élethez. Ismerd meg a zöldségitalok jótékony hatásait.',
  openGraph: {
    title: 'Rosti Blog - Egészséges Életmód és Táplálkozási Tippek',
    description:
      'Tudományos háttér, tippek és érdekességek az egészséges irodai élethez.',
    url: 'https://rosti.hu/blog',
    type: 'website',
    locale: 'hu_HU',
    siteName: 'Rosti',
  },
  alternates: {
    canonical: 'https://rosti.hu/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
