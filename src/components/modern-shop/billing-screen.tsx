import React, { useState, useEffect } from 'react';
import { OrderState, BillingData, Address, UserType } from '../../types/modern-shop';
import { ChevronLeft, Check } from 'lucide-react';
import { formatTaxId, formatPhone } from '../../lib/modern-shop-utils';

interface BillingScreenProps {
  orderState: OrderState;
  updateBilling: (data: Partial<BillingData>) => void;
  onBack: () => void;
  onNext: () => void;
}

const BillingScreen: React.FC<BillingScreenProps> = ({ orderState, updateBilling, onBack, onNext }) => {
  const { billingData } = orderState;
  const [isDemoActive, setIsDemoActive] = useState(true);

  const updateAddress = (type: 'billingAddress' | 'shippingAddress', field: keyof Address, value: string) => {
    updateBilling({
      [type]: { ...billingData[type], [field]: value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const fillDemoData = (targetType: UserType) => {
    const commonData = {
      billingAddress: { postcode: '1055', city: 'Budapest', streetName: 'Kossuth Lajos', streetType: 'tér', houseNum: '1-3.', building: 'A', floor: '2', door: '12', officeBuilding: 'Rosti HQ' },
      isShippingSame: true,
      shippingAddress: { postcode: '1055', city: 'Budapest', streetName: 'Kossuth Lajos', streetType: 'tér', houseNum: '1-3.', building: 'A', floor: '2', door: '12', officeBuilding: 'Rosti HQ' },
      contactName: 'Minta János',
      contactPhone: '+36301234567',
      emailCC1: 'penzugy@rosti.demo',
      notifyMinutes: 30 as const
    };

    if (targetType === 'business') {
      updateBilling({
        ...commonData,
        type: 'business',
        companyName: 'Rosti Demo Kft.',
        taxId: '12345678-2-42',
        useGroupTaxId: false,
        firstName: '',
        lastName: ''
      });
    } else {
      updateBilling({
        ...commonData,
        type: 'private',
        firstName: 'János',
        lastName: 'Minta',
        companyName: '',
        taxId: '',
        groupTaxId: '',
        useGroupTaxId: false
      });
    }
  };

  useEffect(() => {
    const isBusinessEmpty = billingData.type === 'business' && !billingData.companyName;
    const isPrivateEmpty = billingData.type === 'private' && !billingData.lastName;

    if (isDemoActive && (isBusinessEmpty || isPrivateEmpty)) {
      fillDemoData(billingData.type);
    }
  }, []);

  const handleTypeChange = (newType: UserType) => {
    if (isDemoActive) {
      fillDemoData(newType);
    } else {
      updateBilling({ type: newType });
    }
  };

  const toggleDemoData = () => {
    if (!isDemoActive) {
      fillDemoData(billingData.type);
      setIsDemoActive(true);
    } else {
      // Clear data
      updateBilling({
        companyName: '',
        taxId: '',
        groupTaxId: '',
        useGroupTaxId: false,
        firstName: '',
        lastName: '',
        billingAddress: { postcode: '', city: '', streetName: '', streetType: '', houseNum: '', building: '', floor: '', door: '', officeBuilding: '' },
        shippingAddress: { postcode: '', city: '', streetName: '', streetType: '', houseNum: '', building: '', floor: '', door: '', officeBuilding: '' },
        isShippingSame: true,
        contactName: '',
        contactPhone: '+36',
        secondaryContactName: '',
        secondaryContactPhone: '',
        useSecondaryContact: false,
        emailCC1: '',
        emailCC2: '',
        notifyMinutes: null
      });
      setIsDemoActive(false);
    }
  };

  const renderAddressFields = (type: 'billingAddress' | 'shippingAddress') => {
    const data = billingData[type];
    return (
      <div className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-balance text-left">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Irányítószám</label>
            <input 
              type="text" 
              maxLength={4} 
              required={type === 'billingAddress' || !billingData.isShippingSame}
              value={data.postcode}
              onChange={e => updateAddress(type, 'postcode', e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Település</label>
            <input 
              type="text" 
              required={type === 'billingAddress' || !billingData.isShippingSame}
              value={data.city}
              onChange={e => updateAddress(type, 'city', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 text-left">
          <div className="md:col-span-3 text-balance text-left">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Közterület neve</label>
            <input 
              type="text" 
              required={type === 'billingAddress' || !billingData.isShippingSame}
              value={data.streetName}
              onChange={e => updateAddress(type, 'streetName', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700"
            />
          </div>
          <div className="md:col-span-2 text-left">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Típusa</label>
            <div className="relative text-left">
              <select 
                required={type === 'billingAddress' || !billingData.isShippingSame}
                value={data.streetType}
                onChange={e => updateAddress(type, 'streetType', e.target.value)}
                className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer text-left ${data.streetType === '' ? 'text-gray-400' : 'text-gray-700'}`}
              >
                <option value="" disabled>Válassz</option>
                <option value="utca">utca</option>
                <option value="út">út</option>
                <option value="tér">tér</option>
                <option value="köz">köz</option>
                <option value="körút">körút</option>
                <option value="rakpart">rakpart</option>
                <option value="sétány">sétány</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Házszám</label>
            <input 
              type="text" 
              required={type === 'billingAddress' || !billingData.isShippingSame}
              value={data.houseNum}
              onChange={e => updateAddress(type, 'houseNum', e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-left">
          <div className="grid grid-cols-3 gap-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Épület</label>
              <input type="text" maxLength={3} value={data.building || ''} onChange={e => updateAddress(type, 'building', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-center text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Emelet</label>
              <input type="text" maxLength={2} value={data.floor || ''} onChange={e => updateAddress(type, 'floor', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-center text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest text-nowrap text-left">Ajtó</label>
              <input type="text" maxLength={4} value={data.door || ''} onChange={e => updateAddress(type, 'door', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-center text-gray-700" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest opacity-60 text-left">Irodaház neve</label>
            <input type="text" value={data.officeBuilding || ''} onChange={e => updateAddress(type, 'officeBuilding', e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl text-left animate-fade-in flex-grow text-balance">
      <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-700 mb-8 transition-colors group focus:outline-none">
        <ChevronLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Vissza a kosárhoz és a szállítási naptárhoz
      </button>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 text-balance text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase text-left">Számlázási adatok</h2>
        
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full md:w-auto text-balance text-left">
          <button onClick={() => handleTypeChange('business')} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-balance transition-all ${billingData.type === 'business' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Céges</button>
          <button onClick={() => handleTypeChange('private')} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-balance transition-all ${billingData.type === 'private' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Magánszemély</button>
        </div>
      </div>

      <div 
        onClick={toggleDemoData}
        className="mb-8 flex items-center gap-4 group cursor-pointer select-none text-balance text-left"
      >
        <div className={`w-12 h-6 rounded-full relative flex items-center px-1 border transition-colors ${isDemoActive ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-200 border-gray-200'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDemoActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">előző rendelésben használt adatok betöltése</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-left text-balance">
        {/* BASE INFO */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-6 text-left">
          <div className={`grid grid-cols-1 ${billingData.type === 'private' ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-6 text-left`}>
             {billingData.type === 'business' ? (
                 <>
                    <div className="text-left">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Cégnév</label>
                        <input type="text" required placeholder="Legjobb Munkahely Kft." value={billingData.companyName} onChange={e => updateBilling({ companyName: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
                    </div>
                    <div className="text-left">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Adószám</label>
                        <input type="text" required placeholder="________-_-__" maxLength={13} value={billingData.taxId} onChange={e => updateBilling({ taxId: formatTaxId(e.target.value) })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left font-mono text-gray-700" />
                        <label className="mt-3 flex items-center gap-3 px-1 text-left cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input 
                                    type="checkbox" 
                                    checked={billingData.useGroupTaxId} 
                                    onChange={e => updateBilling({ useGroupTaxId: e.target.checked })} 
                                    className="peer sr-only" 
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all shadow-sm group-hover:border-emerald-400"></div>
                                <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider select-none text-left group-hover:text-emerald-600 transition-colors">csoportos adószám megadása</span>
                        </label>
                    </div>
                 </>
             ) : (
                <>
                    <div className="text-left">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Vezetéknév</label>
                        <input type="text" required value={billingData.lastName} onChange={e => updateBilling({ lastName: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
                    </div>
                    <div className="text-left">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Keresztnév</label>
                        <input type="text" required value={billingData.firstName} onChange={e => updateBilling({ firstName: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
                    </div>
                </>
             )}
          </div>
          {billingData.type === 'business' && billingData.useGroupTaxId && (
            <div className="animate-fade-in pt-2 text-left">
                <div className="w-full md:w-1/2 md:pr-3 text-left">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Csoportos adószám</label>
                    <input type="text" maxLength={13} value={billingData.groupTaxId} onChange={e => updateBilling({ groupTaxId: formatTaxId(e.target.value) })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left font-mono text-gray-700" />
                </div>
            </div>
          )}
        </div>

        {/* ADDRESS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-6 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 text-balance text-left">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-left">
                    {billingData.isShippingSame ? 'Számlázási és szállítási cím' : 'Számlázási cím'}
                </h3>
                {billingData.type === 'business' && (
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full md:w-auto text-left">
                        <button type="button" onClick={() => updateBilling({ isShippingSame: true })} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${billingData.isShippingSame ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500'}`}>Azonos</button>
                        <button type="button" onClick={() => updateBilling({ isShippingSame: false })} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${!billingData.isShippingSame ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500'}`}>Eltérő</button>
                    </div>
                )}
            </div>
            {renderAddressFields('billingAddress')}
            
            {!billingData.isShippingSame && (
                <div className="animate-fade-in pt-10 border-t border-gray-100 space-y-6 text-left">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-left">Szállítási cím</h3>
                    {renderAddressFields('shippingAddress')}
                </div>
            )}
        </div>

        {/* CONTACT */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-6 text-left">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Kapcsolattartó neve</label>
                    <input type="text" required value={billingData.contactName} onChange={e => updateBilling({ contactName: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Telefonszám</label>
                    <input type="tel" required value={billingData.contactPhone} onChange={e => updateBilling({ contactPhone: formatPhone(e.target.value) })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all font-mono text-left text-gray-700" />
                </div>
                {/* Secondary Contact */}
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Második kapcsolattartó neve <span className="font-normal text-gray-300 normal-case tracking-normal ml-1">(opcionális)</span></label>
                    <input type="text" value={billingData.secondaryContactName || ''} onChange={e => updateBilling({ secondaryContactName: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Telefonszám <span className="font-normal text-gray-300 normal-case tracking-normal ml-1">(opcionális)</span></label>
                    <input type="tel" value={billingData.secondaryContactPhone || ''} onChange={e => updateBilling({ secondaryContactPhone: formatPhone(e.target.value) })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all font-mono text-left text-gray-700" />
                </div>
             </div>
             
             {billingData.type === 'business' && (
                <div className="text-[10px] font-medium text-gray-400 leading-relaxed px-1 text-balance text-left -mt-5">
                    Annak érdekében, hogy távollét, szabadság esetén is zökkenőmentes legyen a szállítás.
                </div>
             )}

             <div className="pt-8 border-t border-gray-50 text-left">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-left">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Email másolat 1</label>
                        <input type="email" value={billingData.emailCC1} onChange={e => updateBilling({ emailCC1: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Email másolat 2</label>
                        <input type="email" value={billingData.emailCC2} onChange={e => updateBilling({ emailCC2: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all text-left text-gray-700" />
                    </div>
                 </div>
                 <p className="text-[10px] font-medium text-gray-500 leading-relaxed px-1 text-balance text-left">
                    {billingData.type === 'business' 
                        ? 'Adj meg további e-mail címeket (például penzugy@, szamlazas@), és a számlát és a visszaigazolást automatikusan elküldjük nekik is, hogy segítsük a munkátokat.'
                        : 'Ha többen együtt rendeltek, segítünk, és elküldjük a visszaigazolást és a számlát a többiek címére is :)'}
                 </p>
             </div>
             <div className="pt-6 border-t border-gray-50 text-left">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600 font-semibold text-sm text-left">
                    <span className="whitespace-nowrap text-left">Kérlek, kb.</span>
                    <div className="flex gap-2 text-left">
                        {[60, 30, 15].map(min => (
                            <div 
                                key={min}
                                onClick={() => updateBilling({ notifyMinutes: billingData.notifyMinutes === min ? null : min as any })}
                                className={`notification-chip w-14 h-14 rounded-2xl text-lg transition-all cursor-pointer border-2 flex items-center justify-center font-bold
                                    ${billingData.notifyMinutes === min ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}
                                `}
                            >
                                {min}
                            </div>
                        ))}
                    </div>
                    <span className="text-balance text-left">perccel a Rostik érkezése előtt telefonáljatok</span>
                </div>
             </div>
        </div>

        <div className="space-y-4">
            <button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-black py-6 rounded-2xl text-xl shadow-xl transition transform active:scale-[0.98]">
                Tovább az összesítéshez
            </button>
            <div className="bg-gray-50 rounded-[2.5rem] p-8 flex flex-col sm:flex-row justify-between items-center gap-6 border border-gray-100 text-balance text-left">
                <div className="text-left">
                    <div className="flex items-baseline gap-2 text-nowrap text-left">
                        <span className="text-6xl font-black text-gray-900 tracking-tighter">{orderState.quantity}</span>
                        <span className="text-gray-500 font-bold ml-2 uppercase text-sm tracking-widest text-left">Palack</span>
                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 text-left">friss és nyers <span className="text-green-700 font-black">Rosti</span></p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-green-700 text-nowrap text-left">{orderState.schedule.length} hétre</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-left">beütemezve</p>
                </div>
            </div>
        </div>
      </form>
    </main>
  );
};

export default BillingScreen;
