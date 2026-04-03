'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { X, Package, Truck, User, CreditCard, Calendar } from 'lucide-react';

interface Order {
  id: string;
  createdAt: Date;
  status: string;
  subtotalHuf: number;
  deliveryFeeHuf: number;
  totalHuf: number;
  userEmail: string | null;
  userId: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  unitPriceHuf: number;
  discountAppliedHuf: number;
  product: {
    id: string;
    name: string;
    sku: string;
  };
}

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${order.id}/details`);
        if (response.ok) {
          const data = await response.json();
          setOrderItems(data.items);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'SHIPPED':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'DELIVERED':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Order Details #{order.id.slice(0, 8)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Order Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Order Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                <span className="font-medium">#{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium">{order.createdAt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-bold text-lg">{formatPrice(order.totalHuf)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium">{order.userEmail || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                <span className="font-medium">{order.userId ? order.userId.slice(0, 8) + '...' : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment method:</span>
                <span className="font-medium">Stripe</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Delivery Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Delivery Fee:</span>
                <span className="font-medium">
                  {order.deliveryFeeHuf > 0 ? formatPrice(order.deliveryFeeHuf) : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Region:</span>
                <span className="font-medium">Hungary</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Order Items</h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Loading order items...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      SKU
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Discount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {item.product.sku}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(item.unitPriceHuf)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {item.discountAppliedHuf > 0
                          ? `-${formatPrice(item.discountAppliedHuf)}`
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatPrice((item.unitPriceHuf * item.quantity) - item.discountAppliedHuf)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium">{formatPrice(order.subtotalHuf)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Delivery Fee:</span>
              <span className="font-medium">
                {order.deliveryFeeHuf > 0 ? formatPrice(order.deliveryFeeHuf) : 'FREE'}
              </span>
            </div>
            <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatPrice(order.totalHuf)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
