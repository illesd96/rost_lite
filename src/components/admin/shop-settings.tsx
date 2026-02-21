'use client';

import React, { useState, useEffect } from 'react';

interface ShopSetting {
  id: string;
  key: string;
  value: string;
  label: string | null;
  description: string | null;
}

export function ShopSettings() {
  const [settings, setSettings] = useState<ShopSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/shop-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleSetting = async (key: string, currentValue: string) => {
    setUpdatingKey(key);
    const newValue = currentValue === 'true' ? 'false' : 'true';
    
    try {
      const response = await fetch('/api/admin/shop-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: newValue }),
      });

      if (response.ok) {
        setSettings(prev => prev.map(s => 
          s.key === key ? { ...s, value: newValue } : s
        ));
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setUpdatingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (settings.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        Nincsenek beállítások. Futtasd a migrációt a kezdeti beállítások létrehozásához.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {settings.map((setting) => {
        const isEnabled = setting.value === 'true';
        const isUpdating = updatingKey === setting.key;
        
        return (
          <div key={setting.key} className="p-6 flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {setting.label || setting.key}
              </div>
              {setting.description && (
                <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
              )}
              <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {isEnabled ? 'Bekapcsolva' : 'Kikapcsolva'}
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => toggleSetting(setting.key, setting.value)}
              disabled={isUpdating}
              className={`relative w-14 h-7 rounded-full transition-colors flex items-center px-1 ${
                isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'
              } ${isEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                isEnabled ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
