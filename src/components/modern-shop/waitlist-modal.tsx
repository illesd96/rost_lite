import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, Users, Package } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    officeHeadcount: '',
    quantityMin: '',
    quantityMax: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, acceptedTerms }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Hiba történt');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt a jelentkezés során');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900";
  const labelClass = "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl p-6 pb-4 border-b border-gray-100 z-10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            Csatlakozás a<br />
            <span className="text-green-600">Rosti közösséghez</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Add meg az alábbi adatokat, és értesítünk, amint tudunk szállítani nektek.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Köszönjük a jelentkezést!</h3>
            <p className="text-gray-500 text-sm mb-6">Hamarosan felvesszük veled a kapcsolatot.</p>
            <button
              onClick={onClose}
              className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Bezárás
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className={labelClass}>
                <Building2 className="w-3.5 h-3.5" /> Cégnév
              </label>
              <input
                name="companyName"
                required
                value={form.companyName}
                onChange={handleChange}
                placeholder="vállalkozásotok neve"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <User className="w-3.5 h-3.5" /> Kapcsolattartó neve
              </label>
              <input
                name="contactName"
                required
                value={form.contactName}
                onChange={handleChange}
                placeholder="teljes neved"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3">
                <label className={labelClass}>
                  <Mail className="w-3.5 h-3.5" /> Email cím
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="név @ cég . hu"
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>
                  <Phone className="w-3.5 h-3.5" /> Telefonszám
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+36"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <MapPin className="w-3.5 h-3.5" /> Szállítási cím
              </label>
              <input
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleChange}
                placeholder="irodátok címe"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Users className="w-3.5 h-3.5" /> Irodai átlagos létszám
              </label>
              <input
                name="officeHeadcount"
                type="number"
                min="1"
                value={form.officeHeadcount}
                onChange={handleChange}
                placeholder="hányan dolgoztok az irodában?"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Package className="w-3.5 h-3.5" /> Tervezett mennyiség / alkalom
              </label>
              <div className="flex items-center gap-2">
                <input
                  name="quantityMin"
                  type="number"
                  min="1"
                  value={form.quantityMin}
                  onChange={handleChange}
                  placeholder="min"
                  className={`${inputClass} w-24 text-center`}
                />
                <span className="text-gray-400">—</span>
                <input
                  name="quantityMax"
                  type="number"
                  min="1"
                  value={form.quantityMax}
                  onChange={handleChange}
                  placeholder="max"
                  className={`${inputClass} w-24 text-center`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">palack</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={e => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  A Jelentkezés elküldésére kattintva beleegyezel az{' '}
                  <a href="/dokumentumok/adatvedelmi" target="_blank" className="font-bold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                    adatkezelési tájékoztatóban
                  </a>{' '}
                  foglaltakhoz és az{' '}
                  <a href="/dokumentumok/aszf" target="_blank" className="font-bold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                    általános szerződési feltételekhez
                  </a>.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !acceptedTerms}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Küldés...' : 'Jelentkezés elküldése'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
