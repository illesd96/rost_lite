'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Eye, Edit, Package, Truck, CheckCircle } from 'lucide-react';
import { OrderDetailsModal } from './order-details-modal';

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

interface OrderManagementProps {
  orders: Order[];
}

export function OrderManagement({ orders: initialOrders }: OrderManagementProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsLoading(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      alert('Failed to update order status');
    } finally {
      setIsLoading(null);
    }
  };

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

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PAID':
        return 'SHIPPED';
      case 'SHIPPED':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="p-6">
        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'FAILED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status} ({status === 'ALL' ? orders.length : orders.filter(o => o.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.userEmail || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatPrice(order.totalHuf)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {nextStatus && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, nextStatus)}
                          disabled={isLoading === order.id}
                          className={`text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                            isLoading === order.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={`Mark as ${nextStatus.toLowerCase()}`}
                        >
                          {getStatusIcon(nextStatus)}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No orders found for the selected filter.</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
