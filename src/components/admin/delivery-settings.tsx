'use client';

import { useState, useEffect } from 'react';
import { DELIVERY_OPTIONS, type DeliveryOption } from '@/lib/delivery';
import { formatPrice } from '@/lib/utils';
import { Truck, ToggleLeft, ToggleRight, Edit, Calendar, Clock, Save } from 'lucide-react';
import { DeliverySettings as DeliverySettingsType, DeliveryDay } from '@/lib/delivery-dates';

export function DeliverySettings() {
  const [deliveryOptions, setDeliveryOptions] = useState(DELIVERY_OPTIONS);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(15000);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  
  // Delivery date settings
  const [deliveryDateSettings, setDeliveryDateSettings] = useState<DeliverySettingsType>({
    deliveryDays: ['monday', 'wednesday'],
    weeksInAdvance: 4,
    cutoffHours: 24,
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDeliveryDateSettings();
  }, []);

  const fetchDeliveryDateSettings = async () => {
    try {
      const response = await fetch('/api/delivery-settings');
      if (response.ok) {
        const data = await response.json();
        setDeliveryDateSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch delivery settings:', error);
    }
  };

  const saveDeliveryDateSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/delivery-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryDateSettings),
      });
      
      if (response.ok) {
        alert('Delivery settings saved successfully!');
      } else {
        alert('Failed to save delivery settings');
      }
    } catch (error) {
      console.error('Failed to save delivery settings:', error);
      alert('Failed to save delivery settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleOption = (optionId: string) => {
    setDeliveryOptions(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
  };

  const handlePriceEdit = (optionId: string, currentPrice: number) => {
    setEditingOption(optionId);
    setEditPrice(currentPrice);
  };

  const handlePriceSave = (optionId: string) => {
    setDeliveryOptions(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, price: editPrice }
          : option
      )
    );
    setEditingOption(null);
  };

  const handlePriceCancel = () => {
    setEditingOption(null);
    setEditPrice(0);
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'own':
        return 'bg-blue-100 text-blue-800';
      case 'foxpost':
        return 'bg-orange-100 text-orange-800';
      case 'posta':
        return 'bg-green-100 text-green-800';
      case 'packeta':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const dayOptions: { value: DeliveryDay; label: string }[] = [
    { value: 'monday', label: 'Hétfő' },
    { value: 'tuesday', label: 'Kedd' },
    { value: 'wednesday', label: 'Szerda' },
    { value: 'thursday', label: 'Csütörtök' },
    { value: 'friday', label: 'Péntek' },
    { value: 'saturday', label: 'Szombat' },
    { value: 'sunday', label: 'Vasárnap' }
  ];

  const toggleDeliveryDay = (day: DeliveryDay) => {
    setDeliveryDateSettings(prev => ({
      ...prev,
      deliveryDays: prev.deliveryDays.includes(day)
        ? prev.deliveryDays.filter(d => d !== day)
        : [...prev.deliveryDays, day]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Delivery Date Settings */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Kiszállítási dátumok beállítása</h3>
        </div>
        
        <div className="space-y-4">
          {/* Delivery Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kiszállítási napok
            </label>
            <div className="grid grid-cols-4 gap-2">
              {dayOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleDeliveryDay(value)}
                  className={`p-2 text-sm rounded-lg border-2 transition-colors ${
                    deliveryDateSettings.deliveryDays.includes(value)
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Weeks in Advance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hány hét előre
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={deliveryDateSettings.weeksInAdvance}
                onChange={(e) => setDeliveryDateSettings(prev => ({
                  ...prev,
                  weeksInAdvance: parseInt(e.target.value) || 4
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rendelési határidő (órák)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={deliveryDateSettings.cutoffHours}
                onChange={(e) => setDeliveryDateSettings(prev => ({
                  ...prev,
                  cutoffHours: parseInt(e.target.value) || 24
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-green-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Jelenlegi beállítás:</p>
                <p>
                  Kiszállítás: {deliveryDateSettings.deliveryDays.map(day => 
                    dayOptions.find(opt => opt.value === day)?.label
                  ).join(', ')}
                </p>
                <p>
                  {deliveryDateSettings.weeksInAdvance} hét előre, {deliveryDateSettings.cutoffHours} órás határidő
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={saveDeliveryDateSettings}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Mentés...' : 'Dátum beállítások mentése'}
          </button>
        </div>
      </div>

      {/* Free Delivery Threshold */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Ingyenes szállítás küszöb</h3>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Minimum rendelési érték:</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(parseInt(e.target.value))}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
            />
            <span className="text-sm text-gray-600">HUF</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {formatPrice(freeDeliveryThreshold)} feletti rendelések esetén ingyenes a saját szállítás
        </p>
      </div>

      {/* Delivery Options */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Szállítási lehetőségek</h3>
        <div className="space-y-3">
          {deliveryOptions.map((option) => (
            <div key={option.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleOption(option.id)}
                    className="text-2xl"
                  >
                    {option.enabled ? (
                      <ToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    {option.logo && (
                      <img 
                        src={option.logo} 
                        alt={option.name}
                        className="w-8 h-8"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <Truck className="w-5 h-5 text-gray-500" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getProviderColor(option.provider)}`}>
                        {option.provider.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-xs text-gray-500">{option.estimatedDays}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {editingOption === option.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseInt(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                      />
                      <span className="text-xs text-gray-500">HUF</span>
                      <button
                        onClick={() => handlePriceSave(option.id)}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handlePriceCancel}
                        className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-lg">
                        {formatPrice(option.price)}
                      </span>
                      <button
                        onClick={() => handlePriceEdit(option.id, option.price)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <button className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200">
          Beállítások mentése
        </button>
      </div>
    </div>
  );
}
