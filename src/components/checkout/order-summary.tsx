'use client';

import { formatPrice } from '@/lib/utils';
import { formatDateWithDay } from '@/lib/delivery-dates';
import { Receipt, Calendar } from 'lucide-react';
import { DeliverySelection } from './delivery-selection';

interface OrderSummaryProps {
  items: any[];
  cartTotal: number;
  deliveryFee: number;
  deliveryMethod: string;
  selectedDeliveryDates: Date[];
  finalTotal: number;
  singleOrderTotal: number;
  onDeliveryChange: (method: string, fee: number, data?: any) => void;
}

export function OrderSummary({
  items,
  cartTotal,
  deliveryFee,
  deliveryMethod,
  selectedDeliveryDates,
  finalTotal,
  singleOrderTotal,
  onDeliveryChange,
}: OrderSummaryProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <Receipt className="w-5 h-5 mr-2" />
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.quantity} × {formatPrice(item.price)}
                {selectedDeliveryDates.length > 1 && (
                  <span className="text-blue-600 ml-2">
                    × {selectedDeliveryDates.length} delivery dates
                  </span>
                )}
              </p>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatPrice(item.price * (item.quantity || 1) * Math.max(selectedDeliveryDates.length, 1))}
            </span>
          </div>
        ))}
      </div>

      {/* Delivery Dates Section */}
      {selectedDeliveryDates.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-blue-900 dark:text-blue-300">
              Selected Delivery Dates ({selectedDeliveryDates.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {selectedDeliveryDates.map((date, index) => (
              <div key={index} className="text-sm text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded px-2 py-1">
                {formatDateWithDay(date)}
              </div>
            ))}
          </div>
          {selectedDeliveryDates.length > 1 && (
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
              {selectedDeliveryDates.length} separate orders will be created
            </p>
          )}
        </div>
      )}

      {/* Delivery Selection - moved higher */}
      <div className="border-t dark:border-gray-700 pt-4 mb-4">
        <DeliverySelection
          subtotal={cartTotal}
          onDeliveryChange={onDeliveryChange}
          selectedDeliveryId={deliveryMethod}
        />
      </div>

      <div className="space-y-3 border-t dark:border-gray-700 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-900 dark:text-gray-100 font-medium">Subtotal (per order)</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(cartTotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 dark:text-gray-100 font-medium">Delivery (per order)</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {deliveryFee === 0 ? (
              <span className="text-green-600">INGYEN</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </span>
        </div>

        {selectedDeliveryDates.length > 1 && (
          <div className="flex justify-between">
            <span className="text-gray-900 dark:text-gray-100 font-medium">Number of orders</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{selectedDeliveryDates.length}</span>
          </div>
        )}

        {deliveryFee === 0 && (
          <p className="text-sm text-green-600">
            🎉 Ingyenes szállítás!
          </p>
        )}
      </div>

      <div className="border-t dark:border-gray-700 pt-4 mt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span className="text-gray-900 dark:text-gray-100">Total</span>
          <span className="text-gray-900 dark:text-gray-100">{formatPrice(finalTotal)}</span>
        </div>
        {selectedDeliveryDates.length > 1 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
            {formatPrice(singleOrderTotal)} × {selectedDeliveryDates.length} orders
          </div>
        )}
      </div>
    </div>
  );
}
