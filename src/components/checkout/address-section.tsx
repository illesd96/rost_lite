'use client';

import { useState } from 'react';
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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <AddressForm
          type="delivery"
          onAddressChange={onDeliveryAddressChange}
          onValidChange={onDeliveryValidChange}
        />
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useSameAddress}
              onChange={(e) => setUseSameAddress(e.target.checked)}
              className="mr-2 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              Számlázási cím megegyezik a szállítási címmel
            </span>
          </label>
        </div>
        
        {!useSameAddress && (
          <AddressForm
            type="billing"
            onAddressChange={onBillingAddressChange}
            onValidChange={onBillingValidChange}
          />
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
    </div>
  );
}
