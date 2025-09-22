import { QRAnalyticsDashboard } from '@/components/admin/qr-analytics-dashboard';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analitika</h1>
        <p className="text-gray-600 mt-2">
          Követheted a QR kódok hatékonyságát és a látogatói forgalmat
        </p>
      </div>
      
      <QRAnalyticsDashboard />
    </div>
  );
}

