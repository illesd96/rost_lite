'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShopPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to modern shop
    router.replace('/modern-shop');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rosti-cream via-white to-rosti-cream-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Átirányítás az új webshopba...</p>
      </div>
    </div>
  );
}
