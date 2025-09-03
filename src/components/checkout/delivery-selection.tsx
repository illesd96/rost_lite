'use client';

import { useState, useEffect } from 'react';
import { 
  getAvailableDeliveryOptions, 
  calculateDeliveryFee, 
  getPickupPoints,
  type DeliveryOption,
  type PickupPoint 
} from '@/lib/delivery';
import { formatPrice } from '@/lib/utils';
import { Truck, MapPin, Clock, Info } from 'lucide-react';

interface DeliverySelectionProps {
  subtotal: number;
  onDeliveryChange: (deliveryMethod: string, deliveryFee: number, deliveryData?: any) => void;
  selectedDeliveryId?: string;
}

export function DeliverySelection({ 
  subtotal, 
  onDeliveryChange, 
  selectedDeliveryId 
}: DeliverySelectionProps) {
  const [selectedDelivery, setSelectedDelivery] = useState(selectedDeliveryId || 'own-delivery');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showPickupPoints, setShowPickupPoints] = useState(false);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);

  const deliveryOptions = getAvailableDeliveryOptions();

  useEffect(() => {
    const selectedOption = deliveryOptions.find(option => option.id === selectedDelivery);
    if (selectedOption?.type === 'pickup_point') {
      const points = getPickupPoints(selectedOption.provider);
      setPickupPoints(points);
      setShowPickupPoints(true);
    } else {
      setShowPickupPoints(false);
      setSelectedPickupPoint('');
    }
  }, [selectedDelivery]);

  useEffect(() => {
    const deliveryFee = calculateDeliveryFee(subtotal, selectedDelivery);
    const deliveryData = {
      deliveryAddress: selectedDelivery.includes('home') ? deliveryAddress : undefined,
      pickupPointId: selectedPickupPoint || undefined,
    };
    
    onDeliveryChange(selectedDelivery, deliveryFee, deliveryData);
  }, [selectedDelivery, deliveryAddress, selectedPickupPoint, subtotal]);

  const handleDeliveryChange = (deliveryId: string) => {
    setSelectedDelivery(deliveryId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Truck className="w-5 h-5 mr-2" />
        Szállítási mód kiválasztása
      </h3>

      <div className="space-y-3">
        {deliveryOptions.map((option) => {
          const deliveryFee = calculateDeliveryFee(subtotal, option.id);
          const isFree = deliveryFee === 0;
          
          return (
            <div key={option.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={selectedDelivery === option.id}
                  onChange={() => handleDeliveryChange(option.id)}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      {option.logo && (
                        <img 
                          src={option.logo} 
                          alt={option.name}
                          className="w-6 h-6 mr-2"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <span className="font-medium text-gray-900">{option.name}</span>
                    </div>
                    <div className="text-right">
                      {isFree ? (
                        <span className="text-green-600 font-semibold">INGYEN</span>
                      ) : (
                        <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {option.estimatedDays}
                  </div>
                  
                  {option.id === 'own-delivery' && subtotal < 15000 && (
                    <div className="mt-2 text-xs text-blue-600 flex items-start">
                      <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                      <span>
                        Még {formatPrice(15000 - subtotal)} vásárlás és ingyen szállítjuk!
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {/* Home Delivery Address */}
      {selectedDelivery.includes('home') && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Szállítási cím *
          </label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Írja be a teljes szállítási címet (név, irányítószám, város, utca, házszám)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>
      )}

      {/* Pickup Point Selection */}
      {showPickupPoints && pickupPoints.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Átvételi pont kiválasztása *
          </label>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {pickupPoints.map((point) => (
              <label key={point.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-white cursor-pointer">
                <input
                  type="radio"
                  name="pickupPoint"
                  value={point.id}
                  checked={selectedPickupPoint === point.id}
                  onChange={() => setSelectedPickupPoint(point.id)}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                  required
                />
                
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{point.name}</div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {point.address}, {point.city} {point.postalCode}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1 inline" />
                    {point.openingHours}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
