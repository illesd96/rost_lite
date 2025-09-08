'use client';

import { useState, useEffect } from 'react';
import { QrCode, Copy, Check, CreditCard, Clock, Info } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { 
  generateHungarianPaymentData, 
  generateBankTransferInfo, 
  formatIBANForDisplay,
  type BankTransferInfo 
} from '@/lib/hungarian-payment';

interface BankTransferPaymentProps {
  amount: number;
  orderId: string;
  userEmail: string;
  onOrderConfirm: () => void;
  isProcessing: boolean;
}

export function BankTransferPayment({
  amount,
  orderId,
  userEmail,
  onOrderConfirm,
  isProcessing
}: BankTransferPaymentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [bankTransferInfo, setBankTransferInfo] = useState<BankTransferInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    // Generate bank transfer information
    const transferInfo = generateBankTransferInfo(amount, orderId);
    setBankTransferInfo(transferInfo);

    // Generate QR code for Hungarian instant payment
    generateQRCode();
  }, [amount, orderId]);

  const generateQRCode = async () => {
    try {
      const paymentData = generateHungarianPaymentData(amount, orderId);
      
      // Call API to generate QR code
      const response = await fetch('/api/payment/qr-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const result = await response.json();
        setQrCodeUrl(result.qrCodeUrl);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatValidUntil = (date: Date): string => {
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!bankTransferInfo) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Banki átutalás
      </h2>

      {/* Payment Method Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-green-900 mb-2">Azonnali fizetés</h3>
        <p className="text-sm text-green-700">
          Fizessen gyorsan és biztonságosan banki átutalással. Használja a QR kódot az azonnali fizetéshez, 
          vagy másolja át az adatokat kézi átutaláshoz.
        </p>
      </div>

      {/* QR Code Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">QR kód - Azonnali fizetés</h3>
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <QrCode className="w-4 h-4 mr-1" />
            {showQRCode ? 'QR kód elrejtése' : 'QR kód megjelenítése'}
          </button>
        </div>

        {showQRCode && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            {qrCodeUrl ? (
              <div>
                <img 
                  src={qrCodeUrl} 
                  alt="Payment QR Code" 
                  className="mx-auto mb-3 bg-white p-2 rounded"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
                <p className="text-sm text-gray-600">
                  Olvassa be a QR kódot mobilbanki alkalmazásával
                </p>
              </div>
            ) : (
              <div className="py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">QR kód generálása...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual Transfer Details */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Átutalási adatok</h3>
        
        <div className="space-y-4">
          {/* Recipient Name */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kedvezményezett neve</label>
              <span className="text-gray-900">{bankTransferInfo.recipientName}</span>
            </div>
            <button
              onClick={() => copyToClipboard(bankTransferInfo.recipientName, 'recipient')}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Másolás"
            >
              {copiedField === 'recipient' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* IBAN */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Számlaszám (IBAN)</label>
              <span className="text-gray-900 font-mono">{formatIBANForDisplay(bankTransferInfo.iban)}</span>
            </div>
            <button
              onClick={() => copyToClipboard(bankTransferInfo.iban, 'iban')}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Másolás"
            >
              {copiedField === 'iban' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Összeg</label>
              <span className="text-gray-900 text-lg font-semibold">
                {formatPrice(bankTransferInfo.amount)} {bankTransferInfo.currency}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(bankTransferInfo.amount.toString(), 'amount')}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Másolás"
            >
              {copiedField === 'amount' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Reference */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Közlemény</label>
              <span className="text-gray-900">{bankTransferInfo.reference}</span>
            </div>
            <button
              onClick={() => copyToClipboard(bankTransferInfo.reference, 'reference')}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Másolás"
            >
              {copiedField === 'reference' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Validity and Email Info */}
      <div className="mb-6 space-y-4">
        {bankTransferInfo.validUntil && (
          <div className="flex items-start text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
            <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Fizetési határidő</p>
              <p>{formatValidUntil(bankTransferInfo.validUntil)}</p>
            </div>
          </div>
        )}

        <div className="flex items-start text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
          <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">E-mail cím</p>
            <p>{userEmail}</p>
            <p className="text-xs mt-1">A fizetés megerősítését erre az e-mail címre küldjük.</p>
          </div>
        </div>
      </div>

      {/* Confirm Order Button */}
      <button
        onClick={onOrderConfirm}
        disabled={isProcessing}
        className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Rendelés feldolgozása...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Rendelés megerősítése - {formatPrice(amount)}
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          A &quot;Rendelés megerősítése&quot; gombra kattintva elfogadja az általános szerződési feltételeinket és adatvédelmi szabályzatunkat.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          A rendelés után kérjük, hajtsa végre a banki átutalást a megadott adatok alapján.
        </p>
      </div>
    </div>
  );
}
