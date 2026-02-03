'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Package, Calendar, CreditCard, Truck, User, Search, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  showFilters?: boolean;
}

export function ModernOrdersList({ orders, showFilters = true }: ModernOrdersListProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentPlanFilter, setPaymentPlanFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

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

  const getCustomerName = (billingData: any) => {
    if (billingData?.type === 'business' || billingData?.isCompany) {
      return billingData?.companyName || 'Cég';
    }
    const firstName = billingData?.firstName || '';
    const lastName = billingData?.lastName || '';
    return `${lastName} ${firstName}`.trim() || 'N/A';
  };

  const getOrderPaymentStatus = (paymentGroups: PaymentGroup[]) => {
    if (paymentGroups.length === 0) return 'none';
    const paid = paymentGroups.filter(pg => pg.status === 'paid').length;
    if (paid === paymentGroups.length) return 'paid';
    if (paid > 0) return 'partial';
    return 'pending';
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const customerName = getCustomerName(order.billingData).toLowerCase();
        const email = order.user?.email?.toLowerCase() || '';
        const orderNumber = order.orderNumber.toLowerCase();
        
        if (!customerName.includes(query) && !email.includes(query) && !orderNumber.includes(query)) {
          return false;
        }
      }
      
      // Status filter
      if (statusFilter !== 'all' && (order.status || 'pending') !== statusFilter) {
        return false;
      }
      
      // Payment plan filter
      if (paymentPlanFilter !== 'all' && order.paymentPlan !== paymentPlanFilter) {
        return false;
      }
      
      // Payment method filter
      if (paymentMethodFilter !== 'all' && order.paymentMethod !== paymentMethodFilter) {
        return false;
      }
      
      // Payment status filter
      if (paymentStatusFilter !== 'all') {
        const paymentStatus = getOrderPaymentStatus(order.paymentGroups);
        if (paymentStatus !== paymentStatusFilter) {
          return false;
        }
      }
      
      return true;
    });
  }, [orders, searchQuery, statusFilter, paymentPlanFilter, paymentMethodFilter, paymentStatusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentPlanFilter('all');
    setPaymentMethodFilter('all');
    setPaymentStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || paymentPlanFilter !== 'all' || paymentMethodFilter !== 'all' || paymentStatusFilter !== 'all';

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
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Szűrők</span>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto text-xs h-7"
              >
                <X className="w-3 h-3 mr-1" />
                Szűrők törlése
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Keresés..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="all">Minden státusz</option>
              <option value="pending">Függőben</option>
              <option value="confirmed">Megerősítve</option>
              <option value="processing">Feldolgozás</option>
              <option value="delivered">Kiszállítva</option>
              <option value="cancelled">Törölve</option>
            </select>
            
            {/* Payment plan filter */}
            <select
              value={paymentPlanFilter}
              onChange={(e) => setPaymentPlanFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="all">Minden fizetési terv</option>
              <option value="full">Egyszeri</option>
              <option value="monthly">Havi</option>
              <option value="delivery">Szállításonként</option>
            </select>
            
            {/* Payment method filter */}
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="all">Minden fizetési mód</option>
              <option value="transfer">Átutalás</option>
              <option value="cash">Készpénz</option>
            </select>
            
            {/* Payment status filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="all">Minden fizetési állapot</option>
              <option value="paid">Fizetve</option>
              <option value="partial">Részben fizetve</option>
              <option value="pending">Fizetésre vár</option>
            </select>
          </div>
          
          {/* Results count */}
          <div className="mt-3 text-xs text-gray-500">
            {filteredOrders.length} / {orders.length} rendelés
          </div>
        </div>
      )}

      {/* No results message */}
      {filteredOrders.length === 0 && hasActiveFilters && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nincs találat a megadott szűrőkkel.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="mt-3"
          >
            Szűrők törlése
          </Button>
        </div>
      )}

      {/* Orders list */}
      {filteredOrders.map((order) => {
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
