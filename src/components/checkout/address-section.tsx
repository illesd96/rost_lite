'use client';

import { useState, useEffect } from 'react';
import { Building, User, Mail, Phone } from 'lucide-react';
import { AddressForm } from './address-form';
import { hungarianAddressSchema, type HungarianAddress, validateTaxNumber, validateVATNumber } from '@/lib/address-validation';

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
  const [isCompany, setIsCompany] = useState(false);
  
  // Personal/Company data state
  const [personalData, setPersonalData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  
  const [companyData, setCompanyData] = useState({
    companyName: '',
    contactPerson: '',
    taxNumber: '',
    vatNumber: '',
    registrationNumber: '',
  });
  
  // Address data state
  const [deliveryAddressData, setDeliveryAddressData] = useState({
    postalCode: '',
    city: '',
    streetAddress: '',
    houseNumber: '',
    floor: '',
    door: '',
    notes: '',
  });
  
  const [billingAddressData, setBillingAddressData] = useState({
    postalCode: '',
    city: '',
    streetAddress: '',
    houseNumber: '',
    floor: '',
    door: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isDeliveryAddressValid, setIsDeliveryAddressValid] = useState(false);
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(false);

  const handleFieldTouch = (field: string) => {
    setTouchedFields(prev => new Set(Array.from(prev).concat(field)));
  };

  const validatePersonalData = () => {
    const newErrors: Record<string, string> = {};
    
    if (touchedFields.has('fullName') && !personalData.fullName) {
      newErrors.fullName = 'Kötelező mező';
    }
    
    if (touchedFields.has('email') && personalData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email)) {
      newErrors.email = 'Érvénytelen email cím';
    }
    
    return newErrors;
  };

  const validateCompanyData = () => {
    const newErrors: Record<string, string> = {};
    
    if (touchedFields.has('companyName') && !companyData.companyName) {
      newErrors.companyName = 'Kötelező mező';
    }
    
    if (touchedFields.has('taxNumber') && companyData.taxNumber && !validateTaxNumber(companyData.taxNumber)) {
      newErrors.taxNumber = 'Érvénytelen adószám';
    }
    
    if (touchedFields.has('vatNumber') && companyData.vatNumber && !validateVATNumber(companyData.vatNumber)) {
      newErrors.vatNumber = 'Érvénytelen ÁFA szám';
    }
    
    return newErrors;
  };

  const validateAndUpdateAddresses = () => {
    const personalErrors = validatePersonalData();
    const companyErrors = isCompany ? validateCompanyData() : {};
    
    setErrors({ ...personalErrors, ...companyErrors });
    
    const isPersonalValid = Object.keys(personalErrors).length === 0 && personalData.fullName;
    const isCompanyValid = !isCompany || (Object.keys(companyErrors).length === 0 && companyData.companyName);
    const isDataValid = isPersonalValid && isCompanyValid;
    
    if (isDataValid && isDeliveryAddressValid) {
      const fullDeliveryAddress = {
        type: 'delivery',
        isDefault: false,
        isCompany,
        country: 'Hungary',
        ...personalData,
        ...(isCompany ? companyData : {}),
        ...deliveryAddressData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
      
      // Add optional properties if they exist
      if (deliveryAddress && 'id' in deliveryAddress && deliveryAddress.id) {
        fullDeliveryAddress.id = deliveryAddress.id;
      }
      if (deliveryAddress && 'userId' in deliveryAddress && deliveryAddress.userId) {
        fullDeliveryAddress.userId = deliveryAddress.userId;
      }
      if (deliveryAddress && 'createdAt' in deliveryAddress && deliveryAddress.createdAt) {
        fullDeliveryAddress.createdAt = deliveryAddress.createdAt;
      }
      
      onDeliveryAddressChange(fullDeliveryAddress);
    }
    
    onDeliveryValidChange(Boolean(isDataValid && isDeliveryAddressValid));
    
    if (useSameAddress && isDataValid && isDeliveryAddressValid) {
      const fullBillingAddress = {
        type: 'billing',
        isDefault: false,
        isCompany,
        country: 'Hungary',
        ...personalData,
        ...(isCompany ? companyData : {}),
        ...deliveryAddressData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
      
      // Add optional properties if they exist
      if (billingAddress && 'id' in billingAddress && billingAddress.id) {
        fullBillingAddress.id = billingAddress.id;
      }
      if (billingAddress && 'userId' in billingAddress && billingAddress.userId) {
        fullBillingAddress.userId = billingAddress.userId;
      }
      if (billingAddress && 'createdAt' in billingAddress && billingAddress.createdAt) {
        fullBillingAddress.createdAt = billingAddress.createdAt;
      }
      
      onBillingAddressChange(fullBillingAddress);
      onBillingValidChange(true);
    } else if (!useSameAddress && isDataValid && isBillingAddressValid) {
      const fullBillingAddress = {
        type: 'billing',
        isDefault: false,
        isCompany,
        country: 'Hungary',
        ...personalData,
        ...(isCompany ? companyData : {}),
        ...billingAddressData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
      
      // Add optional properties if they exist
      if (billingAddress && 'id' in billingAddress && billingAddress.id) {
        fullBillingAddress.id = billingAddress.id;
      }
      if (billingAddress && 'userId' in billingAddress && billingAddress.userId) {
        fullBillingAddress.userId = billingAddress.userId;
      }
      if (billingAddress && 'createdAt' in billingAddress && billingAddress.createdAt) {
        fullBillingAddress.createdAt = billingAddress.createdAt;
      }
      
      onBillingAddressChange(fullBillingAddress);
      onBillingValidChange(Boolean(isDataValid && isBillingAddressValid));
    } else {
      onBillingValidChange(false);
    }
  };

  useEffect(() => {
    validateAndUpdateAddresses();
  }, [personalData, companyData, deliveryAddressData, billingAddressData, isCompany, useSameAddress, isDeliveryAddressValid, isBillingAddressValid, touchedFields]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Company/Personal Selection */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="address-type"
                checked={!isCompany}
                onChange={() => setIsCompany(false)}
                className="mr-2 text-blue-600"
              />
              <User className="w-4 h-4 mr-1 text-gray-600" />
              <span className="text-gray-900 font-medium">Magánszemély</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="address-type"
                checked={isCompany}
                onChange={() => setIsCompany(true)}
                className="mr-2 text-blue-600"
              />
              <Building className="w-4 h-4 mr-1 text-gray-600" />
              <span className="text-gray-900 font-medium">Vállalat</span>
            </label>
          </div>
        </div>
      </div>

      {/* Company Information */}
      {isCompany && (
        <div className="space-y-4 bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900">Vállalati adatok</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cégnév *
              </label>
              <input
                type="text"
                value={companyData.companyName}
                onChange={(e) => setCompanyData(prev => ({ ...prev, companyName: e.target.value }))}
                onBlur={() => handleFieldTouch('companyName')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.companyName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Vállalat Kft."
              />
              {errors.companyName && (
                <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapcsolattartó
              </label>
              <input
                type="text"
                value={companyData.contactPerson}
                onChange={(e) => setCompanyData(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Kovács János"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adószám *
              </label>
              <input
                type="text"
                value={companyData.taxNumber}
                onChange={(e) => setCompanyData(prev => ({ ...prev, taxNumber: e.target.value }))}
                onBlur={() => handleFieldTouch('taxNumber')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.taxNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="12345678"
                maxLength={8}
              />
              {errors.taxNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.taxNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ÁFA szám
              </label>
              <input
                type="text"
                value={companyData.vatNumber}
                onChange={(e) => setCompanyData(prev => ({ ...prev, vatNumber: e.target.value }))}
                onBlur={() => handleFieldTouch('vatNumber')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.vatNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="HU12345678"
                maxLength={10}
              />
              {errors.vatNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.vatNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cégjegyzékszám
              </label>
              <input
                type="text"
                value={companyData.registrationNumber}
                onChange={(e) => setCompanyData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="01-09-1234"
              />
            </div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-900">Személyes adatok</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teljes név *
            </label>
            <input
              type="text"
              value={personalData.fullName}
              onChange={(e) => setPersonalData(prev => ({ ...prev, fullName: e.target.value }))}
              onBlur={() => handleFieldTouch('fullName')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Kovács János"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={personalData.phone}
              onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="+36 1 234 5678"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email cím
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              value={personalData.email}
              onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
              onBlur={() => handleFieldTouch('email')}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="kovacs.janos@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-8">
        <AddressForm
          title="Szállítási cím"
          address={deliveryAddressData}
          onAddressChange={setDeliveryAddressData}
          onValidChange={setIsDeliveryAddressValid}
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
            title="Számlázási cím"
            address={billingAddressData}
            onAddressChange={setBillingAddressData}
            onValidChange={setIsBillingAddressValid}
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