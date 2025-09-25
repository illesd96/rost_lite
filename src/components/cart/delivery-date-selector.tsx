'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Package } from 'lucide-react';
import { 
  DeliverySettings, 
  DeliveryDate, 
  getAvailableDeliveryDates, 
  getQuickSelectDates,
  getNearestAvailableDate,
  formatDateWithDay
} from '@/lib/delivery-dates';

interface DeliveryDateSelectorProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  deliverySettings: DeliverySettings;
}

export function DeliveryDateSelector({ 
  selectedDates, 
  onDatesChange, 
  deliverySettings 
}: DeliveryDateSelectorProps) {
  const [availableDates, setAvailableDates] = useState<DeliveryDate[]>([]);

  useEffect(() => {
    const dates = getAvailableDeliveryDates(deliverySettings);
    setAvailableDates(dates);
    
    // Auto-select nearest date if no dates selected
    if (selectedDates.length === 0) {
      const nearest = getNearestAvailableDate(dates);
      if (nearest) {
        onDatesChange([nearest]);
      }
    }
  }, [deliverySettings, selectedDates.length, onDatesChange]);

  const toggleDate = (date: Date) => {
    // Normalize the date to avoid time differences
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateTime = normalizedDate.getTime();
    
    const isSelected = selectedDates.some(d => {
      const normalizedSelected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      return normalizedSelected.getTime() === dateTime;
    });
    
    console.log('Toggle date:', normalizedDate, 'isSelected:', isSelected, 'selectedDates:', selectedDates);
    
    if (isSelected) {
      // If already selected, remove it (deselect)
      const newDates = selectedDates.filter(d => {
        const normalizedSelected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return normalizedSelected.getTime() !== dateTime;
      });
      onDatesChange(newDates);
    } else {
      // If not selected, add it (select)
      onDatesChange([...selectedDates, normalizedDate]);
    }
  };

  const handleQuickSelect = (type: 'weekly' | 'biweekly') => {
    const quickDates = getQuickSelectDates(deliverySettings, type);
    // Filter only available dates
    const availableQuickDates = quickDates.filter(date => 
      availableDates.some(ad => 
        ad.date.getTime() === date.getTime() && ad.isAvailable
      )
    );
    onDatesChange(availableQuickDates);
  };

  const isDateSelected = (date: Date) => {
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return selectedDates.some(d => {
      const normalizedSelected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      return normalizedSelected.getTime() === normalizedDate.getTime();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Kiszállítási dátumok</h3>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleQuickSelect('weekly')}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Heti 1x
          <span className="block text-xs opacity-90">Következő 4 hétfő</span>
        </button>
        <button
          onClick={() => handleQuickSelect('biweekly')}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Heti 2x
          <span className="block text-xs opacity-90">Hétfő + Szerda (4 hét)</span>
        </button>
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {availableDates.map((deliveryDate, index) => {
          const isSelected = isDateSelected(deliveryDate.date);
          const isDisabled = !deliveryDate.isAvailable;
          const formattedWithDay = formatDateWithDay(deliveryDate.date);
          
          return (
            <button
              key={index}
              onClick={() => !isDisabled && toggleDate(deliveryDate.date)}
              disabled={isDisabled}
              className={`
                p-3 rounded-lg border-2 text-center transition-all
                ${isSelected 
                  ? 'border-green-500 bg-green-100 text-green-800 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
                ${isDisabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                  : 'cursor-pointer'
                }
              `}
            >
              <div className={`font-medium text-sm ${isSelected ? 'text-green-800' : 'text-black'}`}>
                {formattedWithDay}
              </div>
              {isDisabled && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-500">Lejárt</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Dates Summary */}
      {selectedDates.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">
              Kiválasztott dátumok ({selectedDates.length} db)
            </span>
          </div>
          <div className="text-sm text-blue-800">
            {selectedDates.length} rendelés lesz létrehozva a különböző dátumokra.
          </div>
        </div>
      )}

      {selectedDates.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-amber-800 text-sm">
            Kérjük, válasszon legalább egy kiszállítási dátumot.
          </div>
        </div>
      )}
    </div>
  );
}

