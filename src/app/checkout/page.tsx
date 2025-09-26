import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-brand-cream-bg">
      <Navbar />
      
      <div className="mx-auto px-4 sm:px-6 lg:px-[8.33%] py-8 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <CheckoutForm userEmail={session.user.email} />
      </div>
    </div>
  );
}
