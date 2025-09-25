'use client';

import { useState } from 'react';
import { Building } from 'lucide-react';
import { AddressForm } from './address-form';
import { type HungarianAddress } from '@/lib/address-validation';

interface AddressSectionProps {
  deliveryAddress: HungarianAddress | null;
  billingAddress: HungarianAddress | null;
  onDeliveryAddressChange: (address: HungarianAddress) => void;
  onBillingAddressChange: (address: HungarianAddress) => void;
  onDeliveryValidChange: (isValid: boolean) => void;
  onBillingValidChange: (isValid: boolean) => void;
}

export function AddressSection({
  deliveryAddress,
  billingAddress,
  onDeliveryAddressChange,
  onBillingAddressChange,
  onDeliveryValidChange,
  onBillingValidChange,
}: AddressSectionProps) {
  const [useSameAddress, setUseSameAddress] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Delivery Address */}
      <div className="mb-8">
        <AddressForm
          type="delivery"
          onAddressChange={onDeliveryAddressChange}
          onValidChange={onDeliveryValidChange}
        />
      </div>

      {/* Billing Address Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Számlázási cím
        </h3>
        
        {/* Same Address Checkbox */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useSameAddress}
              onChange={(e) => setUseSameAddress(e.target.checked)}
              className="mr-2 text-blue-600"
            />
            <span className="text-sm text-gray-900 font-medium">
              Számlázási cím megegyezik a szállítási címmel
            </span>
          </label>
        </div>
      </div>

      {/* Billing Address Form */}
      {!useSameAddress && (
        <div>
          <AddressForm
            type="billing"
            onAddressChange={onBillingAddressChange}
            onValidChange={onBillingValidChange}
          />
        </div>
      )}
      
      {useSameAddress && deliveryAddress && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Számlázási cím:</p>
          <p className="text-sm text-gray-900 whitespace-pre-line">
            {deliveryAddress.isCompany && deliveryAddress.companyName && `${deliveryAddress.companyName}\n`}
            {deliveryAddress.fullName}
            {deliveryAddress.streetAddress} {deliveryAddress.houseNumber}
            {deliveryAddress.floor && ` ${deliveryAddress.floor}. emelet`}
            {deliveryAddress.door && ` ${deliveryAddress.door}. ajtó`}
            {`\n${deliveryAddress.postalCode} ${deliveryAddress.city}`}
            {deliveryAddress.district && ` ${deliveryAddress.district}. kerület`}
          </p>
        </div>
      )}
    </div>
  );
}
