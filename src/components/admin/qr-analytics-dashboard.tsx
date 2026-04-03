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
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        Nem sikerült betölteni az adatokat
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            QR Kód Analitika
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Követheted, hányan látogatják meg az oldalt QR kódból
          </p>
        </div>

        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value={7}>Utolsó 7 nap</option>
          <option value={30}>Utolsó 30 nap</option>
          <option value={90}>Utolsó 90 nap</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Összes látogatás</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.totalVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <QrCode className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Összetevők oldal</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.osszetevokDirectVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Főoldal (QR)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.mainPageNoReferrerVisits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ma</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.todayVisits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Effectiveness */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          QR Kód Hatékonyság
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Összetevők oldal (direkt QR)</span>
              <span>{analytics.osszetevokDirectVisits} látogatás</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
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
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
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
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Legutóbbi látogatások
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Oldal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Időpont
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Eszköz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Direkt látogatás
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {analytics.recentVisits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      visit.page === '/osszetevok'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                    }`}>
                      {visit.page === '/osszetevok' ? 'Összetevők' : 'Főoldal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(visit.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getDeviceInfo(visit.userAgent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.isDirectVisit ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        Igen (QR valószínű)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
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
