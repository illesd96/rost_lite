'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Plus, UserPlus } from 'lucide-react';

interface Company {
  id: string;
  companyName: string;
  taxId: string | null;
  billingCity: string | null;
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/companies')
      .then(res => res.json())
      .then(data => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Cégek</h1>
        <Link
          href="/admin/companies/new"
          className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#147A55] transition-colors shadow-lg"
        >
          <Plus size={16} />
          Új cég regisztrációja
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">Betöltés...</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">Még nincs regisztrált cég</h2>
          <p className="text-gray-400 dark:text-gray-500 mb-6">Hozd létre az első céget az &ldquo;Új cég regisztrációja&rdquo; gombbal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map(company => (
            <div key={company.id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
              <Link href={`/admin/companies/${company.id}`} className="flex-1 group">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#0B5D3F] transition-colors">{company.companyName}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {company.taxId && <span>{company.taxId}</span>}
                  {company.billingCity && <span>{company.billingCity}</span>}
                  <span>{new Date(company.createdAt).toLocaleDateString('hu-HU')}</span>
                </div>
              </Link>
              <Link
                href={`/admin/companies/${company.id}/register-user`}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#0B5D3F] hover:bg-[#0B5D3F]/10 px-3 py-2 rounded-lg transition-colors shrink-0 ml-4"
              >
                <UserPlus size={14} />
                Felhasználó regisztrálása
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
