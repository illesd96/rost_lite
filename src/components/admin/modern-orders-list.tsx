'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Calendar, CreditCard, Truck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentGroup {
  id: string;
  groupNumber: number;
  amount: number;
  dueDate: string;
  status: string | null;
  description: string | null;
}

interface DeliveryScheduleItem {
  id: string;
  deliveryDate: string;
  packageNumber: number;
  totalPackages: number;
  quantity: number;
  isMonday: boolean;
  status: string | null;
}

interface ModernOrder {
  id: string;
  orderNumber: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string | null;
  paymentPlan: string;
  paymentMethod: string;
  appliedCoupon: string | null;
  discountAmount: number | null;
  billingData: any;
  createdAt: Date;
  confirmedAt: Date | null;
  user: {
    email: string;
  } | null;
  paymentGroups: PaymentGroup[];
  deliverySchedule: DeliveryScheduleItem[];
}

interface ModernOrdersListProps {
  orders: ModernOrder[];
}

export function ModernOrdersList({ orders }: ModernOrdersListProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string | null) => {
    const s = status || 'pending';
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Függőben' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Megerősítve' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Feldolgozás' },
      delivered: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Kiszállítva' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Törölve' }
    };
    const config = statusConfig[s] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusSummary = (paymentGroups: PaymentGroup[]) => {
    const total = paymentGroups.length;
    const paid = paymentGroups.filter(pg => pg.status === 'paid').length;
    if (total === 0) return null;
    if (paid === total) return { label: 'Fizetve', color: 'text-green-600' };
    if (paid > 0) return { label: `${paid}/${total} fizetve`, color: 'text-amber-600' };
    return { label: 'Fizetésre vár', color: 'text-gray-500' };
  };

  const getNextDelivery = (deliverySchedule: DeliveryScheduleItem[]) => {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = deliverySchedule
      .filter(d => d.deliveryDate >= today && d.status !== 'delivered' && d.status !== 'cancelled')
      .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
    return upcoming[0] || null;
  };

  const getCustomerName = (billingData: any) => {
    if (billingData?.type === 'business' || billingData?.isCompany) {
      return billingData?.companyName || 'Cég';
    }
    const firstName = billingData?.firstName || '';
    const lastName = billingData?.lastName || '';
    return `${lastName} ${firstName}`.trim() || 'N/A';
  };

  const getPaymentPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      full: 'Egyszeri',
      monthly: 'Havi',
      delivery: 'Szállításonként'
    };
    return labels[plan] || plan;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      transfer: 'Átutalás',
      cash: 'Készpénz'
    };
    return labels[method] || method;
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Még nincsenek modern shop rendelések.</p>
        <p className="text-sm text-gray-400 mt-2">
          A rendelések itt jelennek meg, amikor ügyfelek leadják őket.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        const paymentStatus = getPaymentStatusSummary(order.paymentGroups);
        const nextDelivery = getNextDelivery(order.deliverySchedule);
        const customerName = getCustomerName(order.billingData);

        return (
          <div 
            key={order.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Collapsed Header - Always Visible */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Order info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-semibold text-gray-900">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                      <Badge variant="outline" className="text-xs">
                        {order.quantity} palack
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {customerName}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{order.user?.email}</span>
                      <span>•</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount and status indicators */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  {/* Quick status indicators */}
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    {paymentStatus && (
                      <span className={`flex items-center gap-1 ${paymentStatus.color}`}>
                        <CreditCard className="w-4 h-4" />
                        {paymentStatus.label}
                      </span>
                    )}
                    {nextDelivery && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Truck className="w-4 h-4" />
                        {new Date(nextDelivery.deliveryDate).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getPaymentPlanLabel(order.paymentPlan)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Payment Groups */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Fizetési csoportok ({order.paymentGroups?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.paymentGroups?.length > 0 ? (
                          order.paymentGroups.map((group) => (
                            <div key={group.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                              <div>
                                <p className="font-medium text-sm">Csoport {group.groupNumber}</p>
                                {group.description && (
                                  <p className="text-xs text-gray-500">{group.description}</p>
                                )}
                                <p className="text-xs text-gray-400">
                                  Határidő: {new Date(group.dueDate).toLocaleDateString('hu-HU')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm">{formatCurrency(group.amount)}</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  group.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                  group.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {group.status === 'paid' ? 'Fizetve' : 
                                   group.status === 'overdue' ? 'Késedelmes' : 'Függőben'}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">Nincs fizetési csoport</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Schedule */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Szállítási ütemezés ({order.deliverySchedule?.length || 0})
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {order.deliverySchedule?.length > 0 ? (
                          order.deliverySchedule.map((delivery) => (
                            <div key={delivery.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                              <div>
                                <p className="font-medium text-sm">
                                  Csomag {delivery.packageNumber}/{delivery.totalPackages}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {delivery.quantity} palack
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(delivery.deliveryDate).toLocaleDateString('hu-HU')} 
                                  <span className="ml-1">({delivery.isMonday ? 'Hétfő' : 'Kedd'})</span>
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                delivery.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {delivery.status === 'delivered' ? 'Kiszállítva' : 
                                 delivery.status === 'cancelled' ? 'Törölve' : 'Ütemezett'}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">Nincs szállítási ütemezés</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Fizetési terv</p>
                        <p className="font-medium">{getPaymentPlanLabel(order.paymentPlan)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fizetési mód</p>
                        <p className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Kupon</p>
                        <p className="font-medium">{order.appliedCoupon || 'Nincs'}</p>
                      </div>
                      {order.confirmedAt && (
                        <div>
                          <p className="text-gray-500">Megerősítve</p>
                          <p className="font-medium text-green-600">{formatDate(order.confirmedAt)}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Billing Info Summary */}
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Számlázási adatok</p>
                      <p className="text-sm font-medium">{customerName}</p>
                      <p className="text-sm text-gray-600">{order.user?.email}</p>
                      {order.billingData?.contactPhone && (
                        <p className="text-sm text-gray-600">{order.billingData.contactPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
