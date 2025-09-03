import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CheckoutFailurePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-8">
            Unfortunately, your payment could not be processed. This can happen for various reasons.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-red-900 mb-3">Common reasons for payment failure:</h3>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Card expired or blocked</li>
              <li>• Incorrect card details entered</li>
              <li>• Bank declined the transaction</li>
              <li>• Network connection issues</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What you can do:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your card details and try again</li>
              <li>• Use a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
              <li>• Try the payment again in a few minutes</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you continue to experience issues, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
