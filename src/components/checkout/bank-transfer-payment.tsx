'use client';

import { useState, useEffect } from 'react';
import { QrCode, Copy, Check, CreditCard, Clock, Info, X } from 'lucide-react';
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
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

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

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    if (emailInput.trim() && isValidEmail(emailInput.trim())) {
      const email = emailInput.trim();
      if (email !== userEmail && !additionalEmails.includes(email)) {
        setAdditionalEmails([...additionalEmails, email]);
        setEmailInput('');
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setAdditionalEmails(additionalEmails.filter(email => email !== emailToRemove));
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
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
          Fizessen gyorsan és biztonságosan banki átutalással. Másolja át az adatokat kézi átutaláshoz.
        </p>
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

      {/* Email Input Section */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                E-mail címek a megerősítéshez
              </label>
              
              {/* Email Tags */}
              <div className="flex flex-wrap gap-2 mb-3 p-3 border border-blue-300 rounded-lg bg-blue-50 min-h-[60px]">
                {/* Primary User Email - Cannot be deleted */}
                <div className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  <span>{userEmail}</span>
                  <span className="ml-2 text-blue-200 text-xs">(fő)</span>
                </div>
                
                {/* Additional Emails */}
                {additionalEmails.map((email, index) => (
                  <div key={index} className="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded-full">
                    <span>{email}</span>
                    <button
                      onClick={() => removeEmail(email)}
                      className="ml-2 text-gray-300 hover:text-white"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* Input for new emails */}
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={handleEmailKeyPress}
                  onBlur={addEmail}
                  className="flex-1 min-w-[200px] px-2 py-1 text-sm border-none outline-none bg-transparent placeholder-blue-400"
                  placeholder="További e-mail cím hozzáadása..."
                />
              </div>
              
              <p className="text-xs text-blue-700">
                A rendelés megerősítését és fizetési instrukciót ezekre az e-mail címekre küldjük.
              </p>
            </div>
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
