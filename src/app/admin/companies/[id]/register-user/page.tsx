'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Plus, X, Check, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Account {
  email: string;
  password: string;
}

interface Company {
  id: string;
  companyName: string;
  taxId: string | null;
}

export default function RegisterUserPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([
    { email: '', password: '' },
  ]);

  useEffect(() => {
    fetch('/api/admin/companies')
      .then(res => res.json())
      .then((data: Company[]) => {
        const found = data.find(c => c.id === companyId);
        setCompany(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [companyId]);

  const addAccount = () => {
    setAccounts(prev => [...prev, { email: '', password: '' }]);
  };

  const removeAccount = (index: number) => {
    if (accounts.length <= 1) return;
    setAccounts(prev => prev.filter((_, i) => i !== index));
  };

  const updateAccount = (index: number, field: keyof Account, value: string) => {
    setAccounts(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const handleSubmit = async () => {
    const validAccounts = accounts.filter(a => a.email.trim() && a.password.trim());
    if (validAccounts.length === 0) {
      setError('Legalább egy fiókot meg kell adni email címmel és jelszóval.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/companies/${companyId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts: validAccounts }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Hiba történt.');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/companies'), 1500);
    } catch {
      setError('Hiba történt a mentés során.');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Betöltés...</div>;
  }

  if (!company) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-400 mb-4">Cég nem található</h2>
        <Link href="/admin/companies" className="text-[#0B5D3F] font-bold hover:underline">Vissza a cégekhez</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Fiókok sikeresen létrehozva!</h2>
          <p className="text-gray-500">Átirányítás...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div>
        <Link href="/admin/companies" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-[#0B5D3F] mb-4 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Vissza a cégekhez
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Felhasználó regisztrálása</h1>
        <p className="text-gray-500 mt-1">Cég: <span className="font-bold text-gray-900">{company.companyName}</span></p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
          <X size={16} /> {error}
        </div>
      )}

      {/* FIÓK LÉTREHOZÁSA */}
      <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-xl text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Lock className="text-emerald-400" />
            Fiók létrehozása
          </h2>
          <button onClick={addAccount}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-400/10 px-3 py-2 rounded-lg transition-colors">
            <Plus size={14} /> Új fiók
          </button>
        </div>

        <div className="space-y-4">
          {accounts.map((account, i) => (
            <div key={i} className="bg-gray-800 p-5 rounded-xl border border-gray-700 relative">
              {accounts.length > 1 && (
                <button onClick={() => removeAccount(i)}
                  className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <X size={14} />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Bejelentkezési Email</label>
                  <input type="email" value={account.email}
                    onChange={e => updateAccount(i, 'email', e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Jelszó (Kezdeti)</label>
                  <div className="relative">
                    <input type="text" value={account.password}
                      onChange={e => updateAccount(i, 'password', e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono tracking-wider outline-none focus:border-emerald-500" />
                    {company.taxId && (
                      <button onClick={() => updateAccount(i, 'password', company.taxId!)}
                        className="absolute right-2 top-2.5 p-1 text-[10px] bg-gray-700 hover:bg-gray-600 rounded text-gray-300 font-bold">
                        Adószám
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Az ügyfél az első bejelentkezéskor köteles módosítani.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => router.push('/admin/companies')}
          className="px-6 py-3 text-gray-500 hover:text-gray-700 font-bold text-sm transition-colors">
          Mégse
        </button>
        <button onClick={handleSubmit} disabled={saving}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
            saving
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}>
          {saving ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Mentés...
            </>
          ) : (
            <>
              <UserPlus size={20} />
              Fiókok létrehozása
            </>
          )}
        </button>
      </div>
    </div>
  );
}
