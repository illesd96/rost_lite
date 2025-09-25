'use client';

import { useState, useEffect } from 'react';
import { User, Building, MapPin, Phone, Mail } from 'lucide-react';
import { hungarianAddressSchema, type HungarianAddress, validateTaxNumber, validateVATNumber, validatePostalCode } from '@/lib/address-validation';

interface AddressFormProps {
  type: 'delivery' | 'billing';
  address?: Partial<HungarianAddress>;
  onAddressChange: (address: HungarianAddress) => void;
  onValidChange: (isValid: boolean) => void;
}

export function AddressForm({ type, address, onAddressChange, onValidChange }: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<HungarianAddress>>({
    type,
    isDefault: false,
    isCompany: false,
    country: 'Hungary',
    ...address,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateForm = async () => {
    setIsValidating(true);
    try {
      const result = hungarianAddressSchema.safeParse(formData);
      
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          if (error.path.length > 0) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        onValidChange(false);
        return false;
      }
      
      // Additional validations
      const newErrors: Record<string, string> = {};
      
      if (formData.taxNumber && !validateTaxNumber(formData.taxNumber)) {
        newErrors.taxNumber = 'Érvénytelen adószám';
      }
      
      if (formData.vatNumber && !validateVATNumber(formData.vatNumber)) {
        newErrors.vatNumber = 'Érvénytelen ÁFA szám';
      }
      
      if (formData.postalCode) {
        const postalValidation = validatePostalCode(formData.postalCode);
        if (!postalValidation.valid) {
          newErrors.postalCode = 'Érvénytelen irányítószám';
        }
      }
      
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      onValidChange(isValid);
      
      if (isValid) {
        onAddressChange(result.data);
      }
      
      return isValid;
    } catch (error) {
      console.error('Validation error:', error);
      onValidChange(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const updateField = (field: keyof HungarianAddress, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isCompany = formData.isCompany;
  const isBilling = type === 'billing';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {type === 'delivery' ? 'Szállítási cím' : 'Számlázási cím'}
        </h3>
      </div>

      {/* Company/Personal Toggle */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name={`${type}-type`}
              checked={!isCompany}
              onChange={() => updateField('isCompany', false)}
              className="mr-2 text-blue-600"
            />
            <User className="w-4 h-4 mr-1" />
            Magánszemély
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={`${type}-type`}
              checked={isCompany}
              onChange={() => updateField('isCompany', true)}
              className="mr-2 text-blue-600"
            />
            <Building className="w-4 h-4 mr-1" />
            Vállalat
          </label>
        </div>
      </div>

      {/* Company Information */}
      {isCompany && (
        <div className="space-y-4 bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900">Vállalati adatok</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cégnév *
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.contactPerson || ''}
                onChange={(e) => updateField('contactPerson', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kovács János"
              />
            </div>
          </div>

          {isBilling && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adószám *
                </label>
                <input
                  type="text"
                  value={formData.taxNumber || ''}
                  onChange={(e) => updateField('taxNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  value={formData.vatNumber || ''}
                  onChange={(e) => updateField('vatNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  value={formData.registrationNumber || ''}
                  onChange={(e) => updateField('registrationNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="01-09-123456"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Személyes adatok</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teljes név *
            </label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+36 1 234 5678"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
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
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="kovacs.janos@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Cím adatok</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Irányítószám *
            </label>
            <input
              type="text"
              value={formData.postalCode || ''}
              onChange={(e) => updateField('postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234"
              maxLength={4}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-600 mt-1">{errors.postalCode}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Város *
            </label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Budapest"
            />
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kerület
            </label>
            <input
              type="text"
              value={formData.district || ''}
              onChange={(e) => updateField('district', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="V."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Utca *
            </label>
            <input
              type="text"
              value={formData.streetAddress || ''}
              onChange={(e) => updateField('streetAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Fő utca"
            />
            {errors.streetAddress && (
              <p className="text-sm text-red-600 mt-1">{errors.streetAddress}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Házszám
            </label>
            <input
              type="text"
              value={formData.houseNumber || ''}
              onChange={(e) => updateField('houseNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emelet/Ajtó
            </label>
            <input
              type="text"
              value={formData.floor && formData.door ? `${formData.floor}/${formData.door}` : ''}
              onChange={(e) => {
                const [floor, door] = e.target.value.split('/');
                updateField('floor', floor?.trim() || '');
                updateField('door', door?.trim() || '');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2/A"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Megjegyzés
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="További információk..."
          />
        </div>
      </div>

      {/* Validation Status */}
      {isValidating && (
        <div className="text-sm text-gray-500 flex items-center">
          <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
          Ellenőrzés...
        </div>
      )}
      
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 font-medium">Kérjük, javítsa a hibákat:</p>
          <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
