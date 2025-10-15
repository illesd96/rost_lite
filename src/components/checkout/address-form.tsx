'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { validatePostalCode } from '@/lib/address-validation';

interface AddressData {
  postalCode: string;
  city: string;
  streetAddress: string;
  houseNumber: string;
  floor: string;
  door: string;
  notes: string;
}

interface AddressFormProps {
  title: string;
  address?: Partial<AddressData>;
  onAddressChange: (address: AddressData) => void;
  onValidChange: (isValid: boolean) => void;
  forceValidation?: boolean;
}

export function AddressForm({ title, address, onAddressChange, onValidChange, forceValidation = false }: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<AddressData>>({
    postalCode: '',
    city: '',
    streetAddress: '',
    houseNumber: '',
    floor: '',
    door: '',
    notes: '',
    ...address,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate touched fields
    if (touchedFields.has('postalCode') && !formData.postalCode) {
      newErrors.postalCode = 'Kötelező mező';
    } else if (touchedFields.has('postalCode') && formData.postalCode) {
      const postalValidation = validatePostalCode(formData.postalCode);
      if (!postalValidation.valid) {
        newErrors.postalCode = 'Érvénytelen irányítószám';
      }
    }
    
    if (touchedFields.has('city') && !formData.city) {
      newErrors.city = 'Kötelező mező';
    }
    
    if (touchedFields.has('streetAddress') && !formData.streetAddress) {
      newErrors.streetAddress = 'Kötelező mező';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0 && 
                   formData.postalCode && 
                   formData.city && 
                   formData.streetAddress;
    
    onValidChange(!!isValid);
    
    if (isValid) {
      onAddressChange(formData as AddressData);
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData, touchedFields]);

  const updateField = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldTouch = (field: string) => {
    setTouchedFields(prev => new Set(Array.from(prev).concat(field)));
  };

  // Force validation when forceValidation prop changes
  useEffect(() => {
    if (forceValidation) {
      const requiredFields = ['postalCode', 'city', 'streetAddress'];
      setTouchedFields(new Set(requiredFields));
    }
  }, [forceValidation]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        {title}
      </h4>
      
      {/* Address Information */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Irányítószám *
          </label>
          <input
            type="text"
            value={formData.postalCode || ''}
            onChange={(e) => updateField('postalCode', e.target.value)}
            onBlur={() => handleFieldTouch('postalCode')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
              errors.postalCode ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="1234"
            maxLength={4}
          />
          {errors.postalCode && (
            <p className="text-sm text-red-600 mt-1">Required</p>
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
            onBlur={() => handleFieldTouch('city')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
              errors.city ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Budapest"
          />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">Required</p>
          )}
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
            onBlur={() => handleFieldTouch('streetAddress')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
              errors.streetAddress ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Fő utca"
          />
          {errors.streetAddress && (
            <p className="text-sm text-red-600 mt-1">Required</p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="123"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emelet/Ajtó
          </label>
          <input
            type="text"
            value={formData.floor && formData.door ? `${formData.floor}/${formData.door}` : formData.floor || formData.door || ''}
            onChange={(e) => {
              const [floor, door] = e.target.value.split('/');
              updateField('floor', floor?.trim() || '');
              updateField('door', door?.trim() || '');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          placeholder="További információk..."
        />
      </div>
    </div>
  );
}