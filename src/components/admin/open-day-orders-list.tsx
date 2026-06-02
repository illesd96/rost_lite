'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, PartyPopper, CreditCard, User, Mail, MapPin, Search, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OpenDayOrder {
  id: string;
  orderNumber: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  name: string;
  email: string;
  postcode: string | null;
  city: string | null;
  streetName: string | null;
  streetType: string | null;
  houseNum: string | null;
  paymentMethod: string;
  status: string;
  stripeSessionId: string | null;
  notes: string | null;
  createdAt: Date;
  confirmedAt: Date | null;
}

interface OpenDayOrdersListProps {
  orders: OpenDayOrder[];
}

export function OpenDayOrdersList({ orders }: OpenDayOrdersListProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

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

  const getAddress = (order: OpenDayOrder) => {
    const parts = [
      order.postcode,
      order.city,
      [order.streetName, order.streetType, order.houseNum].filter(Boolean).join(' '),
    ].filter(Boolean);
    return parts.join(', ') || 'Nincs cím';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending_payment: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', label: 'Fizetésre vár' },
      confirmed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', label: 'Megerősítve' },
      cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', label: 'Törölve' }
    };
    const config = statusConfig[status] || statusConfig.pending_payment;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      card: 'Bankkártya',
      transfer: 'Átutalás',
    };
    return labels[method] || method;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          order.name.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.orderNumber.toLowerCase().includes(query);
        if (!matches) return false;
      }
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (paymentMethodFilter !== 'all' && order.paymentMethod !== paymentMethodFilter) return false;
      return true;
    });
  }, [orders, searchQuery, statusFilter, paymentMethodFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || paymentMethodFilter !== 'all';

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <PartyPopper className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">Még nincsenek nyíltnapi rendelések.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          A nyíltnapon leadott rendelések itt jelennek meg.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Szűrők</span>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-xs h-7">
              <X className="w-3 h-3 mr-1" />
              Szűrők törlése
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Keresés (név, e-mail, rendelésszám)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">Minden státusz</option>
            <option value="pending_payment">Fizetésre vár</option>
            <option value="confirmed">Megerősítve</option>
            <option value="cancelled">Törölve</option>
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">Minden fizetési mód</option>
            <option value="card">Bankkártya</option>
            <option value="transfer">Átutalás</option>
          </select>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {filteredOrders.length} / {orders.length} rendelés
        </div>
      </div>

      {/* No results */}
      {filteredOrders.length === 0 && hasActiveFilters && (
        <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Nincs találat a megadott szűrőkkel.</p>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="mt-3">
            Szűrők törlése
          </Button>
        </div>
      )}

      {/* Orders list */}
      {filteredOrders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);

        return (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                      <Badge variant="outline" className="text-xs">
                        {order.quantity} palack
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {order.name}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{order.email}</span>
                      <span>•</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="hidden md:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard className="w-4 h-4" />
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(order.unitPrice)} / palack
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer / billing */}
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Vásárló adatai
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{order.name}</p>
                      <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-3.5 h-3.5" /> {order.email}
                      </p>
                      <p className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 mt-0.5" /> {getAddress(order)}
                      </p>
                    </div>
                  </div>

                  {/* Order / payment */}
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Rendelés és fizetés
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Mennyiség</p>
                        <p className="font-medium">{order.quantity} palack</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Egységár</p>
                        <p className="font-medium">{formatCurrency(order.unitPrice)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Fizetési mód</p>
                        <p className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Összesen</p>
                        <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      {order.confirmedAt && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Megerősítve</p>
                          <p className="font-medium text-green-600 dark:text-green-400">{formatDate(order.confirmedAt)}</p>
                        </div>
                      )}
                    </div>
                    {order.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Megjegyzés</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 break-all">{order.notes}</p>
                      </div>
                    )}
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
