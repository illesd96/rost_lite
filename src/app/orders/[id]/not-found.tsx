import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function OrderNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        
        <Link
          href="/orders"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
      </div>
    </div>
  );
}
