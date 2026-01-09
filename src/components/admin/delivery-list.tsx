'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Package, MapPin, Phone, Mail } from 'lucide-react';
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generateDeliveryPDF = async (date: string, deliveries: DeliveryItem[]) => {
    setIsGeneratingPDF(true);
    
    try {
      const response = await fetch('/api/admin/generate-delivery-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, deliveries }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `delivery-list-${date}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    } finally {
      setIsGeneratingPDF(false);
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

  const sortedDates = Object.keys(deliveriesByDate).sort();

  return (
    <div className="space-y-6">
      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming deliveries</h3>
            <p className="text-gray-500">There are no scheduled deliveries at this time.</p>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => {
          const deliveries = deliveriesByDate[date];
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
                    onClick={() => generateDeliveryPDF(date, deliveries)}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download PDF
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
