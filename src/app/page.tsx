import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShoppingBag, Shield, Truck, CreditCard, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  // If user is already logged in, redirect to shop
  if (session) {
    redirect('/shop');
  }

  return (
    <>
      {/* Landing Page Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
                Rosti
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/auth/signin"
                className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2 inline" />
                Enter Shop
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Full-Screen Hero Banner */}
      <div className="relative w-full h-screen">
        <Image
          src="/images/juice-banner.jpg"
          fill
          alt="Premium products and fresh ingredients"
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Rosti
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Discover our exclusive collection of premium products. Quality crafted, naturally sourced, delivered fresh.
            </p>
            <div className="flex justify-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Enter Shop
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column - Main Message */}
            <div className="md:col-span-7">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Real quality. Premium selection. No compromises.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Just pure excellence, carefully curated and delivered by us.
              </p>
            </div>
            
            {/* Right Column - CTA */}
            <div className="md:col-span-5 flex items-center justify-start md:justify-end">
              <div className="text-left md:text-right">
                <p className="text-lg md:text-xl text-gray-700 mb-4 font-medium">
                  Your Daily Dose of Premium Quality
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200 border-b-2 border-primary-600 hover:border-primary-700 pb-1"
                >
                  Explore Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rosti?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a secure, fast, and user-friendly shopping experience with premium products and excellent service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your transactions are protected with Barion&apos;s secure payment gateway and advanced encryption.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery across Hungary with free shipping on orders over 15,000 HUF.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Checkout</h3>
              <p className="text-gray-600">
                Simple and intuitive checkout process with automatic discount calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join Rosti and discover premium products with unbeatable service.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Enter Shop
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Rosti</h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium products and exceptional service.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 Rosti. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
