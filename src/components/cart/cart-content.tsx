'use client';

import { useState, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { formatPrice, calculateDeliveryFee } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartContent() {
  const [isClient, setIsClient] = useState(false);
  const { 
    items, 
    isEmpty, 
    totalItems, 
    cartTotal, 
    updateItemQuantity, 
    removeItem,
    emptyCart 
  } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const deliveryFee = calculateDeliveryFee(cartTotal);
  const finalTotal = cartTotal + deliveryFee;

  if (!isClient) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading cart...</h2>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <Link
          href="/shop"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart Items ({totalItems})
              </h2>
              <button
                onClick={emptyCart}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      disabled={(item.quantity || 1) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(cartTotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            
            {deliveryFee === 0 && cartTotal > 0 && (
              <p className="text-sm text-green-600">
                🎉 You qualify for free delivery!
              </p>
            )}
            
            {deliveryFee > 0 && (
              <p className="text-sm text-gray-500">
                Add {formatPrice(15000 - cartTotal)} more for free delivery
              </p>
            )}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 mb-3"
          >
            Proceed to Checkout
          </Link>
          
          <Link
            href="/shop"
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
