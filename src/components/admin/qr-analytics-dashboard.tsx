'use client';

import { useState, useEffect } from 'react';
import { QrCode, Eye, Calendar, TrendingUp, Users, BarChart3 } from 'lucide-react';

interface QRAnalytics {
  totalVisits: number;
  osszetevokDirectVisits: number;
  mainPageNoReferrerVisits: number;
  todayVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
  recentVisits: QRVisit[];
}

interface QRVisit {
  id: string;
  page: string;
  timestamp: string;
  userAgent: string;
  referrer: string | null;
  isDirectVisit: boolean;
  sessionId: string;
}

export function QRAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<QRAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/qr-code?days=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceInfo = (userAgent: string) => {
    if (!userAgent) return 'Ismeretlen';
    
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return 'Mobil';
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      return 'Tablet';
    } else {
      return 'Asztali';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nem sikerült betölteni az adatokat
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            QR Kód Analitika
          </h2>
          <p className="text-gray-600 mt-1">
            Követheted, hányan látogatják meg az oldalt QR kódból
          </p>
        </div>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Utolsó 7 nap</option>
          <option value={30}>Utolsó 30 nap</option>
          <option value={90}>Utolsó 90 nap</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Összes látogatás</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <QrCode className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Összetevők oldal</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.osszetevokDirectVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Főoldal (QR)</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.mainPageNoReferrerVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ma</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.todayVisits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Effectiveness */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          QR Kód Hatékonyság
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Összetevők oldal (direkt QR)</span>
              <span>{analytics.osszetevokDirectVisits} látogatás</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ 
                  width: `${analytics.totalVisits > 0 ? (analytics.osszetevokDirectVisits / analytics.totalVisits) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span>Főoldal (lehetséges QR)</span>
              <span>{analytics.mainPageNoReferrerVisits} látogatás</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ 
                  width: `${analytics.totalVisits > 0 ? (analytics.mainPageNoReferrerVisits / analytics.totalVisits) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Legutóbbi látogatások
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oldal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Időpont
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eszköz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Direkt látogatás
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.recentVisits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      visit.page === '/osszetevok' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {visit.page === '/osszetevok' ? 'Összetevők' : 'Főoldal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(visit.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getDeviceInfo(visit.userAgent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.isDirectVisit ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Igen (QR valószínű)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Nem
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

