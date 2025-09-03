import { DeliverySettings } from '@/components/admin/delivery-settings';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <Settings className="w-6 h-6 text-gray-400" />
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Delivery Settings
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage delivery options, fees, and providers
            </p>
          </div>
          
          <DeliverySettings />
        </div>
      </div>
    </div>
  );
}
