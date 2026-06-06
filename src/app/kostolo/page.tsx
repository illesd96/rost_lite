import type { Metadata } from 'next';
import KostoloScreen from '@/components/kostolo/kostolo-screen';

export const metadata: Metadata = {
  title: 'Rosti Kóstoló | Igényeld a kóstolójegyed',
  description: 'Válaszolj 3 rövid kérdésre, és igényeld a digitális Rosti kóstolójegyed a nyílt napra.',
};

export default function KostoloPage() {
  return <KostoloScreen />;
}
