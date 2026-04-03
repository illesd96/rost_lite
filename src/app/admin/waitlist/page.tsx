'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Plus, Search, Mail, Phone, MapPin, Users, Package,
  ChevronDown, MoreHorizontal, X, Trash2, Building2, StickyNote
} from 'lucide-react';

type WaitlistStatus = 'to_contact' | 'contacted' | 'rejected' | 'later' | 'create_account' | 'account_created' | 'sent';

interface WaitlistEntry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  deliveryAddress: string | null;
  officeHeadcount: number | null;
  quantityMin: number | null;
  quantityMax: number | null;
  acceptedTerms: boolean;
  status: WaitlistStatus;
  source: 'form' | 'manual' | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS: { value: WaitlistStatus; label: string; color: string }[] = [
  { value: 'to_contact', label: 'Kapcsolatot felvenni', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  { value: 'contacted', label: 'Kapcsolat felvéve', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  { value: 'rejected', label: 'Elvetendő', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  { value: 'later', label: 'Később', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  { value: 'create_account', label: 'Fiók létrehozása', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  { value: 'account_created', label: 'Fiók létrehozva', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { value: 'sent', label: 'Adatok kiküldve', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
];

function getStatusStyle(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[3];
}

export default function WaitlistPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [notesEditId, setNotesEditId] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<WaitlistStatus | 'all'>('all');

  const [newEntry, setNewEntry] = useState({
    companyName: '', contactName: '', email: '', phone: '+36',
    deliveryAddress: '', officeHeadcount: '', quantityMin: '', quantityMax: '',
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/admin/waitlist');
      const data = await res.json();
      setEntries(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: WaitlistStatus) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    await fetch(`/api/admin/waitlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setMenuOpenId(null);
    await fetch(`/api/admin/waitlist/${id}`, { method: 'DELETE' });
  };

  const handleSaveNotes = async (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, notes: notesValue } : e));
    setNotesEditId(null);
    await fetch(`/api/admin/waitlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: notesValue }),
    });
  };

  const handleAddEntry = async () => {
    const res = await fetch('/api/admin/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries(prev => [entry, ...prev]);
      setShowAddModal(false);
      setNewEntry({
        companyName: '', contactName: '', email: '', phone: '+36',
        deliveryAddress: '', officeHeadcount: '', quantityMin: '', quantityMax: '',
      });
    }
  };

  const handleOpenAsCompany = (entry: WaitlistEntry) => {
    const params = new URLSearchParams({
      fromWaitlist: entry.id,
      companyName: entry.companyName,
      contactName: entry.contactName,
      email: entry.email,
      ...(entry.phone ? { phone: entry.phone } : {}),
      ...(entry.deliveryAddress ? { deliveryAddress: entry.deliveryAddress } : {}),
    });
    router.push(`/admin/companies/new?${params.toString()}`);
  };

  const filtered = entries.filter(e => {
    const matchesSearch = !searchQuery ||
      e.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 justify-between items-center">
          <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <UserPlus className="text-[#0B5D3F]" />
            Jelentkezések
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500">({filtered.length})</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#147A55] transition-colors"
            >
              <Plus size={16} />
              Hozzáadás
            </button>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as WaitlistStatus | 'all')}
                className="appearance-none pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 cursor-pointer"
              >
                <option value="all">Összes státusz</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* Search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-xl transition-colors ${showSearch ? 'bg-[#0B5D3F]/10 text-[#0B5D3F]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Keresés cégnév, kapcsolattartó vagy email alapján..."
              autoFocus
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">Betöltés...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={28} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">Nincs találat</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {entries.length === 0 ? 'Még nem érkezett jelentkezés.' : 'Próbálj más keresési feltételt.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="p-5">Cég / Kapcsolattartó</th>
                  <th className="p-5">Elérhetőség</th>
                  <th className="p-5">Cím / Létszám</th>
                  <th className="p-5">Mennyiség</th>
                  <th className="p-5">Dátum</th>
                  <th className="p-5">Státusz</th>
                  <th className="p-5 text-right">Művelet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {entry.companyName}
                        {entry.source === 'form' ? (
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-[10px] uppercase font-bold tracking-wider">Warm</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] uppercase font-bold tracking-wider">Cold</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{entry.contactName}</div>
                      {entry.notes && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                          <StickyNote size={10} /> {entry.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Mail size={12} className="text-gray-400 dark:text-gray-500 shrink-0" /> {entry.email}
                      </div>
                      {entry.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Phone size={12} className="text-gray-400 dark:text-gray-500 shrink-0" /> {entry.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      {entry.deliveryAddress && (
                        <div className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <MapPin size={12} className="text-gray-400 dark:text-gray-500 shrink-0" /> {entry.deliveryAddress}
                        </div>
                      )}
                      {entry.officeHeadcount && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Users size={12} className="text-gray-400 dark:text-gray-500 shrink-0" /> {entry.officeHeadcount} fő
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      {(entry.quantityMin || entry.quantityMax) && (
                        <div className="text-sm text-gray-900 dark:text-gray-100 font-bold flex items-center gap-2">
                          <Package size={12} className="text-gray-400 dark:text-gray-500 shrink-0" />
                          {entry.quantityMin && entry.quantityMax
                            ? `${entry.quantityMin}-${entry.quantityMax} db`
                            : entry.quantityMin
                              ? `${entry.quantityMin}+ db`
                              : `max ${entry.quantityMax} db`}
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {new Date(entry.createdAt).toLocaleDateString('hu-HU')}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="relative">
                        <select
                          value={entry.status}
                          onChange={e => handleStatusChange(entry.id, e.target.value as WaitlistStatus)}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 dark:focus:ring-gray-600 ${getStatusStyle(entry.status).color}`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === entry.id ? null : entry.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-[#0B5D3F] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {menuOpenId === entry.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                            <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-56">
                              <button
                                onClick={() => { handleOpenAsCompany(entry); setMenuOpenId(null); }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                              >
                                <Building2 size={16} className="text-[#0B5D3F]" />
                                <span className="font-medium">Megnyitás cégként</span>
                              </button>
                              <button
                                onClick={() => {
                                  setNotesEditId(entry.id);
                                  setNotesValue(entry.notes || '');
                                  setMenuOpenId(null);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                              >
                                <StickyNote size={16} className="text-amber-500" />
                                <span className="font-medium">Megjegyzés</span>
                              </button>
                              <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                              >
                                <Trash2 size={16} />
                                <span className="font-medium">Törlés</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notes edit modal */}
      {notesEditId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <StickyNote size={18} className="text-amber-500" /> Megjegyzés
              </h3>
              <button onClick={() => setNotesEditId(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={notesValue}
                onChange={e => setNotesValue(e.target.value)}
                placeholder="Belső megjegyzés..."
                rows={4}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setNotesEditId(null)} className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Mégse
                </button>
                <button
                  onClick={() => handleSaveNotes(notesEditId)}
                  className="px-5 py-2 bg-[#0B5D3F] text-white rounded-xl font-bold text-sm hover:bg-[#147A55] transition-colors"
                >
                  Mentés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">Új jelentkező hozzáadása</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Cégnév *</label>
                <input
                  type="text"
                  value={newEntry.companyName}
                  onChange={e => setNewEntry({ ...newEntry, companyName: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Kapcsolattartó *</label>
                <input
                  type="text"
                  value={newEntry.contactName}
                  onChange={e => setNewEntry({ ...newEntry, contactName: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    value={newEntry.email}
                    onChange={e => setNewEntry({ ...newEntry, email: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Telefon</label>
                  <input
                    type="text"
                    value={newEntry.phone}
                    onChange={e => setNewEntry({ ...newEntry, phone: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Cím</label>
                <input
                  type="text"
                  value={newEntry.deliveryAddress}
                  onChange={e => setNewEntry({ ...newEntry, deliveryAddress: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Létszám</label>
                  <input
                    type="number"
                    value={newEntry.officeHeadcount}
                    onChange={e => setNewEntry({ ...newEntry, officeHeadcount: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Min db</label>
                  <input
                    type="number"
                    value={newEntry.quantityMin}
                    onChange={e => setNewEntry({ ...newEntry, quantityMin: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Max db</label>
                  <input
                    type="number"
                    value={newEntry.quantityMax}
                    onChange={e => setNewEntry({ ...newEntry, quantityMax: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Mégse
              </button>
              <button
                onClick={handleAddEntry}
                disabled={!newEntry.companyName.trim() || !newEntry.contactName.trim() || !newEntry.email.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0B5D3F] text-white rounded-xl font-bold text-sm hover:bg-[#147A55] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Hozzáadás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
