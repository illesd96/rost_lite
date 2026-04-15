'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SiteNavbar } from '../../../components/ui/site-navbar';
import ProfileScreen from '../../../components/modern-shop/profile-screen';

export default function ModernShopProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B5D3F]"></div>
      </div>
    );
  }

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SiteNavbar relative hideOrderCta />
      <ProfileScreen
        userEmail={session.user.email || ''}
        onStartOrder={() => router.push('/modern-shop')}
      />
    </div>
  );
}
