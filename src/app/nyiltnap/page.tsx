import type { Metadata } from 'next';
import OpenDayScreen from '@/components/open-day/open-day-screen';

const OG_IMAGE = 'https://raw.githubusercontent.com/bal1nt/rosti-img/cb4c756471fe9279fb5a2abaabb4c762c28fbe8f/ROSTI-OG.png';

export const metadata: Metadata = {
  title: 'Rosti. Prémium Zöldség-Smoothie. Friss & Nyers',
  description: '5 féle nyers zöldség és friss citrom egyetlen prémium smoothie-ban.',
  openGraph: {
    type: 'website',
    url: 'https://www.rosti.hu/',
    siteName: 'Rosti',
    title: 'Rosti. Prémium Zöldség-Smoothie. Friss & Nyers',
    description: '5 féle nyers zöldség és friss citrom egyetlen prémium smoothie-ban.',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rosti. Friss & Nyers Prémium Zöldség-Smoothie',
    description: '5 féle nyers zöldség és friss citrom egyetlen prémium smoothie-ban. Nyers, rostos zöldség-smoothie a csapat stabil energiájáért.',
    images: [OG_IMAGE],
  },
};

export default function OpenDayPage() {
  return <OpenDayScreen />;
}
