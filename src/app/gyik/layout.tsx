import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gyakran Ismételt Kérdések (GYIK) - Rosti',
  description:
    'Válaszok a leggyakrabban feltett kérdésekre a Rosti zöldségitalokról: szállítás, fizetés, összetevők, allergének és rendelés módosítása.',
  openGraph: {
    title: 'Gyakran Ismételt Kérdések - Rosti',
    description:
      'Válaszok a Rosti zöldségitalokkal kapcsolatos kérdésekre: szállítás, fizetés, összetevők.',
    url: 'https://rosti.hu/gyik',
    type: 'website',
    locale: 'hu_HU',
    siteName: 'Rosti',
  },
  alternates: {
    canonical: 'https://rosti.hu/gyik',
  },
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Mikor és hogyan érkezik a Rosti az irodába?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Rostikat a kiszállítást megelőző este készítjük. A szállítás a kiválasztott napokon (hétfőn vagy kedden), 08:00 és 14:00 óra között hűtve történik az irodába.',
      },
    },
    {
      '@type': 'Question',
      name: 'Rendelhetek hétfőtől és keddtől eltérő napra is?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kézműves kapacitásaink miatt az állandó szállításunk hétfőre és keddre korlátozódik. Egyedi esetekben (pl. irodai rendezvény, workshop) van lehetőség ettől eltérni.',
      },
    },
    {
      '@type': 'Question',
      name: 'Meddig áll el a Rosti a hűtőben?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A csúcsminőséget a készítést követő 60 órában garantáljuk, amennyiben az átvétel után azonnal hűtőbe kerül (szigorúan 2–4°C közötti tárolás mellett).',
      },
    },
    {
      '@type': 'Question',
      name: 'Meddig tudom módosítani vagy lemondani a rendelést?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A rendelés módosítására vagy lemondására legkésőbb a szállítást megelőző utolsó munkanap 15:00-ig van lehetőség a rendeles@rosti.hu e-mail címen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hogyan történik a fizetés és a számlázás?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A rendelések ellenértékének kiegyenlítése előre, a Stripe biztonságos online bankkártyás rendszerén keresztül történik. A visszaigazolást és a számlát a sikeres fizetést követő 24 órán belül küldjük e-mailben.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tartalmaz a Rosti allergéneket?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Rosti tej-, glutén- és tartósítószer-mentes, hozzáadott cukrot nem tartalmaz. Állandó allergénként azonban szerepel benne a zeller.',
      },
    },
  ],
};

export default function GyikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {children}
    </>
  );
}
