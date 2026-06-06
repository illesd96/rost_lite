'use client';

import React, { useState, useMemo } from 'react';
import { Ticket, Search, X, Filter, Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KostoloRegistration {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  acceptedMarketing: boolean;
  validUntil: Date;
  createdAt: Date;
}

interface KostoloListProps {
  registrations: KostoloRegistration[];
}

export function KostoloList({ registrations }: KostoloListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [marketingFilter, setMarketingFilter] = useState<string>('all');

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.ticketNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (marketingFilter === 'yes' && !r.acceptedMarketing) return false;
      if (marketingFilter === 'no' && r.acceptedMarketing) return false;
      return true;
    });
  }, [registrations, searchQuery, marketingFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setMarketingFilter('all');
  };

  const hasActiveFilters = searchQuery || marketingFilter !== 'all';

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <Ticket className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">Még nincsenek kóstoló regisztrációk.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          A /kostolo oldalon kiállított kóstolójegyek itt jelennek meg.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Szűrők</span>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-xs h-7">
              <X className="w-3 h-3 mr-1" />
              Szűrők törlése
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Keresés (név, e-mail, jegyszám)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <select
            value={marketingFilter}
            onChange={(e) => setMarketingFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">Minden hozzájárulás</option>
            <option value="yes">Marketing: igen</option>
            <option value="no">Marketing: nem</option>
          </select>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {filtered.length} / {registrations.length} regisztráció
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && hasActiveFilters && (
        <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Nincs találat a megadott szűrőkkel.</p>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="mt-3">
            Szűrők törlése
          </Button>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">Jegyszám</th>
                <th className="px-4 py-3 font-medium">Név</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Marketing</th>
                <th className="px-4 py-3 font-medium">Regisztrált</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">{r.ticketNumber}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <a href={`mailto:${r.email}`} className="hover:text-[#0B5D3F] inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {r.acceptedMarketing ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        <Check className="w-3 h-3" /> Igen
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        Nem
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
