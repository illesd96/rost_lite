'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, User, Plus, Lock, X, Check, ChevronDown, Save, ArrowLeft
} from 'lucide-react';

interface Address {
  postcode: string;
  city: string;
  streetName: string;
  streetType: string;
  houseNum: string;
  building: string;
  floor: string;
  door: string;
  officeBuilding: string;
}

interface Contact {
  name: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

const EMPTY_ADDRESS: Address = {
  postcode: '', city: '', streetName: '', streetType: '',
  houseNum: '', building: '', floor: '', door: '', officeBuilding: '',
};

function AddressForm({ data, onChange }: { data: Address; onChange: (field: keyof Address, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Irányítószám</label>
          <input type="text" maxLength={4} value={data.postcode}
            onChange={e => onChange('postcode', e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-gray-700 dark:text-gray-300" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Település</label>
          <input type="text" value={data.city} onChange={e => onChange('city', e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-gray-700 dark:text-gray-300" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-3">
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Közterület neve</label>
          <input type="text" value={data.streetName} onChange={e => onChange('streetName', e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-gray-700 dark:text-gray-300" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Típusa</label>
          <div className="relative">
            <select value={data.streetType} onChange={e => onChange('streetType', e.target.value)}
              className={`w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all appearance-none cursor-pointer ${data.streetType === '' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
              <option value="" disabled>Válassz</option>
              <option value="utca">utca</option>
              <option value="út">út</option>
              <option value="tér">tér</option>
              <option value="köz">köz</option>
              <option value="körút">körút</option>
              <option value="rakpart">rakpart</option>
              <option value="sétány">sétány</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400 dark:text-gray-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Házszám</label>
          <input type="text" value={data.houseNum} onChange={e => onChange('houseNum', e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-gray-700 dark:text-gray-300" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Épület</label>
            <input type="text" maxLength={3} value={data.building} onChange={e => onChange('building', e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-center text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Emelet</label>
            <input type="text" maxLength={2} value={data.floor} onChange={e => onChange('floor', e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-center text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Ajtó</label>
            <input type="text" maxLength={4} value={data.door} onChange={e => onChange('door', e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-center text-gray-700 dark:text-gray-300" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest opacity-60">Irodaház neve</label>
          <input type="text" value={data.officeBuilding} onChange={e => onChange('officeBuilding', e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 transition-all text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Company data
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [groupTaxId, setGroupTaxId] = useState('');
  const [useGroupTaxId, setUseGroupTaxId] = useState(false);
  const [billingAddress, setBillingAddress] = useState<Address>({ ...EMPTY_ADDRESS });
  const [shippingAddress, setShippingAddress] = useState<Address>({ ...EMPTY_ADDRESS });
  const [isShippingSame, setIsShippingSame] = useState(true);
  const [emailCC1, setEmailCC1] = useState('');
  const [emailCC2, setEmailCC2] = useState('');
  const [internalShippingNote, setInternalShippingNote] = useState('');
  const [notifyMinutes, setNotifyMinutes] = useState<number>(60);

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load company data
  useEffect(() => {
    fetch(`/api/admin/companies/${companyId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(({ company, contacts: dbContacts }) => {
        setCompanyName(company.companyName || '');
        setTaxId(company.taxId || '');
        setGroupTaxId(company.groupTaxId || '');
        setUseGroupTaxId(company.useGroupTaxId || false);
        setBillingAddress({
          postcode: company.billingPostcode || '',
          city: company.billingCity || '',
          streetName: company.billingStreetName || '',
          streetType: company.billingStreetType || '',
          houseNum: company.billingHouseNum || '',
          building: company.billingBuilding || '',
          floor: company.billingFloor || '',
          door: company.billingDoor || '',
          officeBuilding: company.billingOfficeBuilding || '',
        });
        setIsShippingSame(company.isShippingSame ?? true);
        setShippingAddress({
          postcode: company.shippingPostcode || '',
          city: company.shippingCity || '',
          streetName: company.shippingStreetName || '',
          streetType: company.shippingStreetType || '',
          houseNum: company.shippingHouseNum || '',
          building: company.shippingBuilding || '',
          floor: company.shippingFloor || '',
          door: company.shippingDoor || '',
          officeBuilding: company.shippingOfficeBuilding || '',
        });
        setEmailCC1(company.emailCC1 || '');
        setEmailCC2(company.emailCC2 || '');
        setInternalShippingNote(company.internalShippingNote || '');
        setNotifyMinutes(company.notifyMinutes ?? 60);

        if (dbContacts && dbContacts.length > 0) {
          setContacts(dbContacts.map((c: { name: string; phone: string | null; email: string | null; isPrimary: boolean }) => ({
            name: c.name || '',
            phone: c.phone || '+36',
            email: c.email || '',
            isPrimary: c.isPrimary || false,
          })));
        } else {
          setContacts([{ name: '', phone: '+36', email: '', isPrimary: true }]);
        }

        setLoading(false);
      })
      .catch(() => {
        setError('Cég nem található.');
        setLoading(false);
      });
  }, [companyId]);

  const updateBillingAddress = (field: keyof Address, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const updateShippingAddress = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const addContact = () => {
    setContacts(prev => [...prev, { name: '', phone: '+36', email: '', isPrimary: false }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length <= 1) return;
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: keyof Contact, value: string | boolean) => {
    setContacts(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      company: {
        companyName,
        taxId,
        groupTaxId: useGroupTaxId ? groupTaxId : null,
        useGroupTaxId,
        billingPostcode: billingAddress.postcode,
        billingCity: billingAddress.city,
        billingStreetName: billingAddress.streetName,
        billingStreetType: billingAddress.streetType,
        billingHouseNum: billingAddress.houseNum,
        billingBuilding: billingAddress.building,
        billingFloor: billingAddress.floor,
        billingDoor: billingAddress.door,
        billingOfficeBuilding: billingAddress.officeBuilding,
        isShippingSame,
        shippingPostcode: isShippingSame ? null : shippingAddress.postcode,
        shippingCity: isShippingSame ? null : shippingAddress.city,
        shippingStreetName: isShippingSame ? null : shippingAddress.streetName,
        shippingStreetType: isShippingSame ? null : shippingAddress.streetType,
        shippingHouseNum: isShippingSame ? null : shippingAddress.houseNum,
        shippingBuilding: isShippingSame ? null : shippingAddress.building,
        shippingFloor: isShippingSame ? null : shippingAddress.floor,
        shippingDoor: isShippingSame ? null : shippingAddress.door,
        shippingOfficeBuilding: isShippingSame ? null : shippingAddress.officeBuilding,
        emailCC1,
        emailCC2,
        internalShippingNote,
        notifyMinutes,
      },
      contacts: contacts.filter(c => c.name.trim()),
    };

    try {
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Hiba történt.');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Hiba történt a mentés során.');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400 dark:text-gray-500">Betöltés...</div>;
  }

  if (error && !companyName) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-4">{error}</h2>
        <Link href="/admin/companies" className="text-[#0B5D3F] font-bold hover:underline">Vissza a cégekhez</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div>
        <Link href="/admin/companies" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-[#0B5D3F] mb-4 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Vissza a cégekhez
        </Link>
        <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Cég szerkesztése</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
          <X size={16} /> {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 text-sm font-medium flex items-center gap-2">
          <Check size={16} /> Változások sikeresen mentve!
        </div>
      )}

      {/* CÉGADATOK */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
          <Building2 className="text-[#0B5D3F]" />
          Cégadatok
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Cégnév *</label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Adószám</label>
            <input type="text" value={taxId} onChange={e => setTaxId(e.target.value.replace(/[^0-9-]/g, ''))} placeholder="12345678-1-42"
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20" />
            <div className="mt-2 flex items-center gap-2">
              <input type="checkbox" id="groupTax" checked={useGroupTaxId}
                onChange={e => setUseGroupTaxId(e.target.checked)}
                className="rounded text-[#0B5D3F] focus:ring-[#0B5D3F]" />
              <label htmlFor="groupTax" className="text-xs font-medium text-gray-500 dark:text-gray-400">Csoportos adószám megadása</label>
            </div>
          </div>
        </div>

        {useGroupTaxId && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Csoportos Adószám</label>
            <input type="text" value={groupTaxId} onChange={e => setGroupTaxId(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20" />
          </div>
        )}

        <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 mt-8">Számlázási Cím</h3>
        <AddressForm data={billingAddress} onChange={updateBillingAddress} />

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Szállítási Cím</h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button onClick={() => setIsShippingSame(true)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${isShippingSame ? 'bg-white dark:bg-gray-900 shadow-sm text-[#0B5D3F]' : 'text-gray-500 dark:text-gray-400'}`}>
                Azonos
              </button>
              <button onClick={() => setIsShippingSame(false)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!isShippingSame ? 'bg-white dark:bg-gray-900 shadow-sm text-[#0B5D3F]' : 'text-gray-500 dark:text-gray-400'}`}>
                Eltérő
              </button>
            </div>
          </div>
          {!isShippingSame && (
            <AddressForm data={shippingAddress} onChange={updateShippingAddress} />
          )}
        </div>

        {/* Internal Shipping Note */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-xl border-yellow-100">
          <label className="block text-xs font-black text-yellow-600 uppercase mb-2 flex items-center gap-2">
            <Lock size={12} />
            Belsős megjegyzés a szállításhoz
          </label>
          <textarea value={internalShippingNote} onChange={e => setInternalShippingNote(e.target.value)}
            placeholder="Pl. kapukód, emelet infó, portás neve..."
            className="w-full p-3 bg-white dark:bg-gray-900 border border-yellow-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400/20 text-sm"
            rows={3} />
        </div>

        {/* Extra Emails */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Email másolatok</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email másolat 1</label>
              <input type="email" value={emailCC1} onChange={e => setEmailCC1(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email másolat 2</label>
              <input type="email" value={emailCC2} onChange={e => setEmailCC2(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20" />
            </div>
          </div>
        </div>

        {/* KAPCSOLATTARTÓK */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <User size={18} className="text-[#0B5D3F]" />
                Kapcsolattartók
              </h3>
              <button onClick={addContact}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] hover:bg-[#0B5D3F]/10 px-3 py-2 rounded-lg transition-colors">
                <Plus size={14} /> Új kapcsolattartó
              </button>
            </div>

            <div className="space-y-4">
              {contacts.map((contact, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 relative">
                  {contacts.length > 1 && (
                    <button onClick={() => removeContact(i)}
                      className="absolute top-3 right-3 p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  {i === 0 && (
                    <span className="text-[9px] font-black text-[#0B5D3F] uppercase tracking-widest mb-3 block">Elsődleges</span>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Név</label>
                      <input type="text" value={contact.name}
                        onChange={e => updateContact(i, 'name', e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Telefonszám</label>
                      <input type="text" value={contact.phone}
                        onChange={e => updateContact(i, 'phone', e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">Email</label>
                      <input type="email" value={contact.email}
                        onChange={e => updateContact(i, 'email', e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3F]/20 text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/admin/companies"
          className="px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-bold text-sm transition-colors">
          Vissza
        </Link>
        <button onClick={handleSubmit} disabled={saving || !companyName.trim()}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
            saving || !companyName.trim()
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-[#0B5D3F] hover:bg-[#147A55] text-white'
          }`}>
          {saving ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Mentés...
            </>
          ) : (
            <>
              <Save size={20} />
              Változások mentése
            </>
          )}
        </button>
      </div>
    </div>
  );
}
