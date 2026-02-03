'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Package, MapPin, Phone, Mail, Search, X, Filter, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/modern-shop-utils';

interface DeliveryItem {
  id: string;
  deliveryDate: string;
  deliveryIndex: number;
  isMonday: boolean;
  quantity: number;
  amount: number;
  packageNumber: number;
  totalPackages: number;
  status: string | null;
  order: {
    id: string;
    orderNumber: string;
    billingData: any;
    user: {
      email: string;
    };
  };
}

interface DeliveryListProps {
  deliveriesByDate: Record<string, DeliveryItem[]>;
}

export function DeliveryList({ deliveriesByDate }: DeliveryListProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [generatingDate, setGeneratingDate] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  const generateDeliveryPDF = async (e: React.MouseEvent, date: string, deliveries: DeliveryItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    
    setGeneratingDate(date);
    
    try {
      const response = await fetch('/api/admin/generate-delivery-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, deliveries }),
      });

      if (response.ok) {
        const htmlContent = await response.text();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // Wait for content to load then trigger print dialog
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
      } else {
        alert('Failed to generate delivery list');
      }
    } catch (error) {
      console.error('Error generating delivery list:', error);
      alert('Error generating delivery list');
    } finally {
      setGeneratingDate(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDeliveryAddress = (billingData: any) => {
    const address = billingData?.shippingAddress || billingData?.billingAddress;
    if (!address) return 'No address available';
    
    return `${address.postcode} ${address.city}, ${address.streetName} ${address.streetType} ${address.houseNum}${address.building ? ` ${address.building}` : ''}${address.floor ? ` ${address.floor}` : ''}${address.door ? ` ${address.door}` : ''}`;
  };

  const getContactInfo = (billingData: any) => {
    return {
      name: billingData?.contactName || billingData?.companyName || billingData?.firstName + ' ' + billingData?.lastName || 'N/A',
      phone: billingData?.contactPhone || 'N/A',
      email: billingData?.emailCC1 || 'N/A'
    };
  };

  // Filter deliveries
  const filteredDeliveriesByDate = useMemo(() => {
    const result: Record<string, DeliveryItem[]> = {};
    
    Object.entries(deliveriesByDate).forEach(([date, deliveries]) => {
      // Date range filter
      if (dateFromFilter && date < dateFromFilter) return;
      if (dateToFilter && date > dateToFilter) return;
      
      const filteredDeliveries = deliveries.filter(delivery => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const contact = getContactInfo(delivery.order.billingData);
          const name = contact.name.toLowerCase();
          const email = delivery.order.user.email.toLowerCase();
          const orderNumber = delivery.order.orderNumber.toLowerCase();
          
          if (!name.includes(query) && !email.includes(query) && !orderNumber.includes(query)) {
            return false;
          }
        }
        
        // Status filter
        if (statusFilter !== 'all' && (delivery.status || 'scheduled') !== statusFilter) {
          return false;
        }
        
        // Day filter (Monday/Tuesday)
        if (dayFilter !== 'all') {
          if (dayFilter === 'monday' && !delivery.isMonday) return false;
          if (dayFilter === 'tuesday' && delivery.isMonday) return false;
        }
        
        return true;
      });
      
      if (filteredDeliveries.length > 0) {
        result[date] = filteredDeliveries;
      }
    });
    
    return result;
  }, [deliveriesByDate, searchQuery, statusFilter, dayFilter, dateFromFilter, dateToFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDayFilter('all');
    setDateFromFilter('');
    setDateToFilter('');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dayFilter !== 'all' || dateFromFilter || dateToFilter;

  const sortedDates = Object.keys(filteredDeliveriesByDate).sort();
  const allDates = Object.keys(deliveriesByDate).sort();
  
  // Count totals
  const totalDeliveries = Object.values(deliveriesByDate).flat().length;
  const filteredDeliveries = Object.values(filteredDeliveriesByDate).flat().length;

  return (
    <div className="space-y-6">
      {/* Filters */}
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Keresés (név, email, rendelésszám)..."
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
            <option value="scheduled">Ütemezett</option>
            <option value="delivered">Kiszállítva</option>
            <option value="cancelled">Törölve</option>
            <option value="rescheduled">Átütemezve</option>
          </select>
          
          {/* Day filter */}
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
          >
            <option value="all">Minden nap</option>
            <option value="monday">Hétfő</option>
            <option value="tuesday">Kedd</option>
          </select>
          
          {/* Date from */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Dátumtól"
            />
          </div>
          
          {/* Date to */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Dátumig"
            />
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-3 text-xs text-gray-500">
          {filteredDeliveries} / {totalDeliveries} kiszállítás • {sortedDates.length} / {allDates.length} nap
        </div>
      </div>

      {/* No results */}
      {allDates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nincsenek közelgő kiszállítások</h3>
            <p className="text-gray-500">Jelenleg nincs ütemezett kiszállítás.</p>
          </CardContent>
        </Card>
      ) : sortedDates.length === 0 && hasActiveFilters ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nincs találat</h3>
            <p className="text-gray-500 mb-4">A megadott szűrőkkel nem található kiszállítás.</p>
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
            >
              Szűrők törlése
            </Button>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => {
          const deliveries = filteredDeliveriesByDate[date];
          const totalPackages = deliveries.reduce((sum, d) => sum + d.quantity, 0);
          
          return (
            <Card key={date} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {formatDate(date)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {deliveries.length} deliveries • {totalPackages} bottles total
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={(e) => generateDeliveryPDF(e, date, deliveries)}
                    disabled={generatingDate !== null}
                    className="flex items-center gap-2"
                  >
                    {generatingDate === date ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Print List
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {deliveries.map((delivery) => {
                    const contact = getContactInfo(delivery.order.billingData);
                    const address = getDeliveryAddress(delivery.order.billingData);
                    
                    return (
                      <div key={delivery.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono">
                                {delivery.order.orderNumber}
                              </Badge>
                              <Badge variant="secondary">
                                Package {delivery.packageNumber}/{delivery.totalPackages}
                              </Badge>
                              <Badge 
                                variant={delivery.status === 'scheduled' ? 'default' : 'secondary'}
                              >
                                {delivery.status || 'pending'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Package className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">{delivery.quantity} bottles</span>
                                  <span className="text-gray-500">• {formatCurrency(delivery.amount)}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{delivery.order.user.email}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{contact.phone}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                  <div>
                                    <div className="font-medium">{contact.name}</div>
                                    <div className="text-gray-600">{address}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
