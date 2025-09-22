import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rosti Összetevők | Természetes Zöldségek és Gyümölcsök | Budapest',
  description: 'Ismerd meg a Rosti zöldségitalok természetes összetevőit: cékla, sárgarépa, uborka, lilakáposzta és zeller. Friss, nyers és egészséges alapanyagok vitaminokkal és rostokkal.',
  keywords: 'rosti összetevők, természetes zöldségek, cékla, sárgarépa, uborka, lilakáposzta, zeller, vitaminok, rostok, egészséges táplálkozás, természetes antioxidánsok, budapest',
  openGraph: {
    title: 'Rosti Összetevők - Természetes Zöldségek és Gyümölcsök',
    description: 'Ismerd meg a Rosti zöldségitalok természetes összetevőit. Friss, nyers és egészséges alapanyagok.',
    url: 'https://rosti.hu/osszetevok',
    images: [
      {
        url: 'https://rosti.hu/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rosti Összetevők',
      },
    ],
  },
};

export default function OsszetevokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

