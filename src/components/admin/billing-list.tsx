'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  Banknote,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatCurrency } from '@/lib/modern-shop-utils';

interface PaymentGroupItem {
  id: string;
  groupNumber: number;
  amount: number;
  dueDate: string;
  status: string | null;
  description: string | null;
  paidAt: Date | null;
  billCreated: boolean;
  billCreatedAt: Date | null;
  billSent: boolean;
  billSentAt: Date | null;
  billNumber: string | null;
  billNotes: string | null;
  order: {
    id: string;
    orderNumber: string;
    billingData: any;
    paymentPlan: string;
    paymentMethod: string;
    user: {
      email: string;
    };
  };
}

interface BillingListProps {
  paymentGroupsByDate: Record<string, PaymentGroupItem[]>;
}

export function BillingList({ paymentGroupsByDate }: BillingListProps) {
  const [isPending, startTransition] = useTransition();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set(Object.keys(paymentGroupsByDate)));
  const [billNumbers, setBillNumbers] = useState<Record<string, string>>({});
  const [billNotes, setBillNotes] = useState<Record<string, string>>({});

  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const updateBillingStatus = async (
    paymentGroupId: string, 
    action: 'create_bill' | 'send_bill' | 'mark_paid',
    billNumber?: string,
    notes?: string
  ) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/billing/${paymentGroupId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action,
            billNumber: billNumber || billNumbers[paymentGroupId],
            billNotes: notes || billNotes[paymentGroupId]
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update billing status');
        }

        // Refresh the page to show updated data
        window.location.reload();
      } catch (error) {
        console.error('Error updating billing status:', error);
        alert('Failed to update billing status');
      }
    });
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

  const formatDateTime = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Fizetve</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Késedelmes</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Törölve</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Függőben</Badge>;
    }
  };

  const getBillingContact = (billingData: any) => {
    const isCompany = billingData?.isCompany || billingData?.billingAddress?.isCompany;
    
    if (isCompany) {
      return {
        name: billingData?.companyName || billingData?.billingAddress?.companyName || 'N/A',
        type: 'company',
        contactPerson: billingData?.contactName || billingData?.billingAddress?.contactPerson || null,
        taxNumber: billingData?.taxNumber || billingData?.billingAddress?.taxNumber || null,
        email: billingData?.emailCC1 || billingData?.billingAddress?.email || null,
        phone: billingData?.contactPhone || billingData?.billingAddress?.phone || null,
      };
    }
    
    return {
      name: `${billingData?.lastName || ''} ${billingData?.firstName || ''}`.trim() || 
            billingData?.contactName || 
            billingData?.billingAddress?.fullName || 'N/A',
      type: 'person',
      contactPerson: null,
      taxNumber: null,
      email: billingData?.emailCC1 || billingData?.billingAddress?.email || null,
      phone: billingData?.contactPhone || billingData?.billingAddress?.phone || null,
    };
  };

  const getBillingAddress = (billingData: any) => {
    const address = billingData?.billingAddress;
    if (!address) return 'Nincs megadva';
    
    return `${address.postcode || address.postalCode || ''} ${address.city || ''}, ${address.streetName || address.streetAddress || ''} ${address.streetType || ''} ${address.houseNum || address.houseNumber || ''}${address.building ? ` ${address.building}` : ''}${address.floor ? ` ${address.floor}` : ''}${address.door ? ` ${address.door}` : ''}`.trim();
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'transfer':
        return 'Átutalás';
      case 'cash':
        return 'Készpénz';
      default:
        return method;
    }
  };

  const sortedDates = Object.keys(paymentGroupsByDate).sort();

  const isOverdue = (dueDate: string, status: string | null) => {
    if (status === 'paid' || status === 'cancelled') return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  return (
    <div className="space-y-6">
      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nincsenek esedékes számlák</h3>
            <p className="text-gray-500">Jelenleg nincs kiállítandó számla.</p>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map((date) => {
          const paymentGroups = paymentGroupsByDate[date];
          const totalAmount = paymentGroups.reduce((sum, pg) => sum + pg.amount, 0);
          const isExpanded = expandedDates.has(date);
          const isDateOverdue = isOverdue(date, null);
          
          return (
            <Card key={date} className={`overflow-hidden ${isDateOverdue ? 'border-red-300' : ''}`}>
              <CardHeader 
                className={`cursor-pointer transition-colors ${
                  isDateOverdue ? 'bg-red-50' : 'bg-gray-50'
                } hover:bg-gray-100`}
                onClick={() => toggleDate(date)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className={`text-xl font-bold ${isDateOverdue ? 'text-red-700' : 'text-gray-900'}`}>
                        {formatDate(date)}
                        {isDateOverdue && (
                          <AlertCircle className="inline ml-2 h-5 w-5 text-red-500" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {paymentGroups.length} számla • Összesen: {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {paymentGroups.filter(pg => !pg.billCreated).length > 0 && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          {paymentGroups.filter(pg => !pg.billCreated).length} létrehozandó
                        </Badge>
                      )}
                      {paymentGroups.filter(pg => pg.billCreated && !pg.billSent).length > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {paymentGroups.filter(pg => pg.billCreated && !pg.billSent).length} küldendő
                        </Badge>
                      )}
                      {paymentGroups.filter(pg => pg.status === 'paid').length > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {paymentGroups.filter(pg => pg.status === 'paid').length} fizetve
                        </Badge>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {paymentGroups.map((pg) => {
                      const contact = getBillingContact(pg.order.billingData);
                      const address = getBillingAddress(pg.order.billingData);
                      const itemOverdue = isOverdue(pg.dueDate, pg.status);
                      
                      return (
                        <div 
                          key={pg.id} 
                          className={`p-6 ${itemOverdue ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}
                        >
                          <div className="flex justify-between items-start gap-6">
                            {/* Left side - Order & Billing Info */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="font-mono">
                                  {pg.order.orderNumber}
                                </Badge>
                                <Badge variant="secondary">
                                  Fizetési csoport #{pg.groupNumber}
                                </Badge>
                                {getStatusBadge(pg.status)}
                                <Badge variant="outline">
                                  {getPaymentMethodLabel(pg.order.paymentMethod)}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Contact Info */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    {contact.type === 'company' ? (
                                      <Building className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <User className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="font-medium">{contact.name}</span>
                                  </div>
                                  
                                  {contact.contactPerson && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 ml-6">
                                      <span>Kapcsolat: {contact.contactPerson}</span>
                                    </div>
                                  )}
                                  
                                  {contact.taxNumber && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 ml-6">
                                      <span>Adószám: {contact.taxNumber}</span>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span>{pg.order.user.email}</span>
                                  </div>
                                  
                                  {contact.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Phone className="h-4 w-4 text-gray-400" />
                                      <span>{contact.phone}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Billing Address & Amount */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Banknote className="h-4 w-4 text-gray-400" />
                                    <span className="font-bold text-lg">{formatCurrency(pg.amount)}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Határidő: {formatDate(pg.dueDate)}</span>
                                  </div>
                                  
                                  <div className="text-sm text-gray-600">
                                    <div className="font-medium">Számlázási cím:</div>
                                    <div>{address}</div>
                                  </div>
                                  
                                  {pg.description && (
                                    <div className="text-sm text-gray-500 italic">
                                      {pg.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Billing Progress */}
                              <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${pg.billCreated ? 'bg-green-500' : 'bg-gray-300'}`} />
                                  <span className={pg.billCreated ? 'text-green-700' : 'text-gray-500'}>
                                    Számla létrehozva
                                  </span>
                                  {pg.billCreatedAt && (
                                    <span className="text-xs text-gray-400">
                                      ({formatDateTime(pg.billCreatedAt)})
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1.5 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${pg.billSent ? 'bg-green-500' : 'bg-gray-300'}`} />
                                  <span className={pg.billSent ? 'text-green-700' : 'text-gray-500'}>
                                    Számla elküldve
                                  </span>
                                  {pg.billSentAt && (
                                    <span className="text-xs text-gray-400">
                                      ({formatDateTime(pg.billSentAt)})
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1.5 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${pg.status === 'paid' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                  <span className={pg.status === 'paid' ? 'text-green-700' : 'text-gray-500'}>
                                    Fizetve
                                  </span>
                                  {pg.paidAt && (
                                    <span className="text-xs text-gray-400">
                                      ({formatDateTime(pg.paidAt)})
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Bill Number Input */}
                              {!pg.billCreated && (
                                <div className="flex items-center gap-2 pt-2">
                                  <input
                                    type="text"
                                    placeholder="Számlaszám (opcionális)"
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-md w-48"
                                    value={billNumbers[pg.id] || ''}
                                    onChange={(e) => setBillNumbers(prev => ({ ...prev, [pg.id]: e.target.value }))}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                      }
                                    }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Megjegyzés (opcionális)"
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex-1"
                                    value={billNotes[pg.id] || ''}
                                    onChange={(e) => setBillNotes(prev => ({ ...prev, [pg.id]: e.target.value }))}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                      }
                                    }}
                                  />
                                </div>
                              )}
                              
                              {/* Bill Number Display */}
                              {pg.billNumber && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Számlaszám:</span> {pg.billNumber}
                                </div>
                              )}
                              
                              {pg.billNotes && (
                                <div className="text-sm text-gray-500 italic">
                                  <span className="font-medium">Megjegyzés:</span> {pg.billNotes}
                                </div>
                              )}
                            </div>
                            
                            {/* Right side - Action Buttons */}
                            <div className="flex flex-col gap-4 min-w-[180px] pl-4 border-l border-gray-200">
                              {!pg.billCreated && (
                                <Button
                                  type="button"
                                  size="default"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateBillingStatus(pg.id, 'create_bill');
                                  }}
                                  disabled={isPending}
                                  className="w-full bg-orange-600 hover:bg-orange-700 py-3"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Számla létrehozva
                                </Button>
                              )}
                              
                              {pg.billCreated && !pg.billSent && (
                                <Button
                                  type="button"
                                  size="default"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateBillingStatus(pg.id, 'send_bill');
                                  }}
                                  disabled={isPending}
                                  className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Számla elküldve
                                </Button>
                              )}
                              
                              {pg.billSent && pg.status !== 'paid' && (
                                <Button
                                  type="button"
                                  size="default"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateBillingStatus(pg.id, 'mark_paid');
                                  }}
                                  disabled={isPending}
                                  className="w-full bg-green-600 hover:bg-green-700 py-3"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Fizetve jelölés
                                </Button>
                              )}
                              
                              {pg.status === 'paid' && (
                                <div className="flex items-center justify-center gap-2 text-green-600 py-3 bg-green-50 rounded-lg">
                                  <CheckCircle2 className="h-5 w-5" />
                                  <span className="font-medium">Fizetve</span>
                                </div>
                              )}
                              
                              {pg.status !== 'paid' && pg.billSent && (
                                <div className="flex items-center justify-center gap-2 text-amber-600 py-2 bg-amber-50 rounded-lg">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">Várakozás fizetésre</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
