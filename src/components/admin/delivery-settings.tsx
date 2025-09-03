'use client';

import { useState } from 'react';
import { DELIVERY_OPTIONS, type DeliveryOption } from '@/lib/delivery';
import { formatPrice } from '@/lib/utils';
import { Truck, ToggleLeft, ToggleRight, Edit } from 'lucide-react';

export function DeliverySettings() {
  const [deliveryOptions, setDeliveryOptions] = useState(DELIVERY_OPTIONS);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(15000);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

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

  return (
    <div className="p-6 space-y-6">
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
