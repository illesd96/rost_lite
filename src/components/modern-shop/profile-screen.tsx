import React, { useState, useEffect } from 'react';
import { Package, User, MapPin, FileText, CheckCircle2, Calendar, Edit2 } from 'lucide-react';
import { formatCurrency } from '../../lib/modern-shop-utils';

interface ProfileScreenProps {
  userEmail: string;
  onStartOrder: () => void;
}

type TabType = 'active-orders' | 'contact' | 'shipping' | 'billing' | 'completed-orders';

interface OrderData {
  id: string;
  orderNumber: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  totalAmount: number;
  deliveryDatesCount: number;
  status: string;
  createdAt: string;
  nextDeliveryDate: string | null;
  lastDeliveryDate: string | null;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userEmail, onStartOrder }) => {
  const [activeTab, setActiveTab] = useState<TabType>('active-orders');
  const [isLoading, setIsLoading] = useState(true);

  // Edit states
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Contact state
  const [contactData, setContactData] = useState({
    primaryName: '',
    primaryPhone: '+36',
    secondaryName: '',
    secondaryPhone: '',
    email1: '',
    email2: ''
  });

  // Shipping state
  const [shippingData, setShippingData] = useState({
    postcode: '',
    city: '',
    streetName: '',
    streetType: '',
    houseNum: '',
    building: '',
    floor: '',
    door: '',
    officeBuilding: ''
  });

  // Billing state
  const [billingData, setBillingData] = useState({
    companyName: '',
    taxId: '',
    postcode: '',
    city: '',
    streetName: '',
    streetType: '',
    houseNum: ''
  });

  // Orders state
  const [activeOrders, setActiveOrders] = useState<OrderData[]>([]);
  const [completedOrders, setCompletedOrders] = useState<OrderData[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [billingRes, ordersRes] = await Promise.all([
          fetch('/api/modern-shop/billing-data'),
          fetch('/api/modern-shop/profile/orders')
        ]);

        if (billingRes.ok) {
          const { billingData: bd } = await billingRes.json();
          if (bd) {
            setContactData({
              primaryName: bd.contactName || '',
              primaryPhone: bd.contactPhone || '+36',
              secondaryName: bd.secondaryContactName || '',
              secondaryPhone: bd.secondaryContactPhone || '',
              email1: bd.emailCC1 || '',
              email2: bd.emailCC2 || ''
            });
            setShippingData({
              postcode: bd.shippingAddress?.postcode || '',
              city: bd.shippingAddress?.city || '',
              streetName: bd.shippingAddress?.streetName || '',
              streetType: bd.shippingAddress?.streetType || '',
              houseNum: bd.shippingAddress?.houseNum || '',
              building: bd.shippingAddress?.building || '',
              floor: bd.shippingAddress?.floor || '',
              door: bd.shippingAddress?.door || '',
              officeBuilding: bd.shippingAddress?.officeBuilding || ''
            });
            setBillingData({
              companyName: bd.companyName || '',
              taxId: bd.taxId || '',
              postcode: bd.billingAddress?.postcode || '',
              city: bd.billingAddress?.city || '',
              streetName: bd.billingAddress?.streetName || '',
              streetType: bd.billingAddress?.streetType || '',
              houseNum: bd.billingAddress?.houseNum || ''
            });
          }
        }

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setActiveOrders(data.activeOrders || []);
          setCompletedOrders(data.completedOrders || []);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveBillingData = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/modern-shop/billing-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingData: {
            type: 'business',
            companyName: billingData.companyName,
            taxId: billingData.taxId,
            billingAddress: {
              postcode: billingData.postcode,
              city: billingData.city,
              streetName: billingData.streetName,
              streetType: billingData.streetType,
              houseNum: billingData.houseNum,
            },
            shippingAddress: {
              postcode: shippingData.postcode,
              city: shippingData.city,
              streetName: shippingData.streetName,
              streetType: shippingData.streetType,
              houseNum: shippingData.houseNum,
              building: shippingData.building,
              floor: shippingData.floor,
              door: shippingData.door,
              officeBuilding: shippingData.officeBuilding,
            },
            isShippingSame: false,
            contactName: contactData.primaryName,
            contactPhone: contactData.primaryPhone,
            secondaryContactName: contactData.secondaryName,
            secondaryContactPhone: contactData.secondaryPhone,
            useSecondaryContact: !!contactData.secondaryName,
            emailCC1: contactData.email1,
            emailCC2: contactData.email2,
          }
        })
      });
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatWeekday = (dateStr: string) => {
    const d = new Date(dateStr);
    const weekday = d.toLocaleDateString('hu-HU', { weekday: 'long' });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  };

  const getInputClass = (isEditing: boolean, isEmpty: boolean = false) =>
    `w-full p-4 border rounded-2xl font-medium outline-none transition-all ${
      isEditing
        ? 'bg-white dark:bg-gray-800 border-[#0B5D3F]/30 focus:ring-2 focus:ring-[#0B5D3F]/20 text-gray-900 dark:text-gray-100'
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
    } ${!isEditing && isEmpty ? 'italic text-gray-400 dark:text-gray-500' : ''}`;

  const tabs = [
    { id: 'active-orders' as TabType, title: 'Aktív rendelések', icon: <Package size={18} /> },
    { id: 'contact' as TabType, title: 'Kapcsolattartási adatok', icon: <User size={18} /> },
    { id: 'shipping' as TabType, title: 'Szállítás', icon: <MapPin size={18} /> },
    { id: 'billing' as TabType, title: 'Számlázás', icon: <FileText size={18} /> },
    { id: 'completed-orders' as TabType, title: 'Teljesített rendelések', icon: <CheckCircle2 size={18} /> },
  ];

  const renderEditFooter = (
    isEditing: boolean,
    onCancel: () => void,
    onSave: () => void
  ) => (
    <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-sm text-gray-500 dark:text-gray-400 w-full md:w-auto text-left" />
      {isEditing && (
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end">
          <span className="text-sm text-amber-600 font-medium text-center md:text-right">
            Az adatokat módosítod, véglegesítéshez kattints a mentés gombra.
          </span>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button onClick={onCancel} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto">
              Mégse
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="bg-[#0B5D3F] hover:bg-[#147A55] text-white px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto disabled:opacity-50"
            >
              {isSaving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveOrders = () => (
    <div className="space-y-6 animate-fade-in">
      {activeOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Jelenleg nincs aktív rendelésed.</p>
          <button onClick={onStartOrder} className="bg-[#0B5D3F] hover:bg-[#147A55] text-white px-8 py-3 rounded-xl font-bold transition-colors">
            Új rendelés
          </button>
        </div>
      ) : (
        activeOrders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Aktív</span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">#{order.orderNumber}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">Heti Rosti csomag - {order.quantity} palack</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[#0B5D3F]">{formatCurrency(order.quantity * order.unitPrice + order.shippingFee)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">/ alkalom</div>
              </div>
            </div>

            {order.nextDeliveryDate && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm flex items-center justify-center text-[#0B5D3F]">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Következő szállítás</div>
                  <div className="text-gray-900 dark:text-gray-100 font-bold">
                    {formatDate(order.nextDeliveryDate)} ({formatWeekday(order.nextDeliveryDate)})
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {activeOrders.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
            <span>Módosítás a szállítást megelőző péntek 15:00-ig lehetséges e-mailen: <a href="mailto:rendeles@rosti.hu" className="text-[#0B5D3F] font-bold hover:underline">rendeles@rosti.hu</a></span>
          </div>
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">Elsődleges kapcsolattartó</h3>
          {!isEditingContact && (
            <button onClick={() => setIsEditingContact(true)} className="text-[#0B5D3F] hover:text-[#147A55] p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
              <Edit2 size={18} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Név</label>
            <input type="text" disabled={!isEditingContact} value={contactData.primaryName} onChange={e => setContactData({...contactData, primaryName: e.target.value})} className={getInputClass(isEditingContact)} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Telefonszám</label>
            <input type="text" disabled={!isEditingContact} value={contactData.primaryPhone} onChange={e => setContactData({...contactData, primaryPhone: e.target.value})} className={getInputClass(isEditingContact)} />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6">Másodlagos kapcsolattartó</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Név</label>
              <input type="text" disabled={!isEditingContact} value={contactData.secondaryName} onChange={e => setContactData({...contactData, secondaryName: e.target.value})} className={getInputClass(isEditingContact)} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Telefonszám</label>
              <input type="text" disabled={!isEditingContact} value={contactData.secondaryPhone} onChange={e => setContactData({...contactData, secondaryPhone: e.target.value})} className={getInputClass(isEditingContact)} />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6">Email másolatok</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Email 1</label>
              <input type="text" disabled={!isEditingContact} value={contactData.email1} onChange={e => setContactData({...contactData, email1: e.target.value})} className={getInputClass(isEditingContact)} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Email 2</label>
              <input type="text" disabled={!isEditingContact} value={contactData.email2} placeholder={isEditingContact ? 'Második email cím' : 'Nincs megadva'} onChange={e => setContactData({...contactData, email2: e.target.value})} className={getInputClass(isEditingContact, !contactData.email2)} />
            </div>
          </div>
        </div>

        {renderEditFooter(isEditingContact, () => setIsEditingContact(false), async () => { await saveBillingData(); setIsEditingContact(false); })}
      </div>
    </div>
  );

  const renderShipping = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">Szállítási cím</h3>
          {!isEditingShipping && (
            <button onClick={() => setIsEditingShipping(true)} className="text-[#0B5D3F] hover:text-[#147A55] p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
              <Edit2 size={18} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Irányítószám</label>
            <input type="text" disabled={!isEditingShipping} value={shippingData.postcode} onChange={e => setShippingData({...shippingData, postcode: e.target.value})} className={getInputClass(isEditingShipping)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Település</label>
            <input type="text" disabled={!isEditingShipping} value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} className={getInputClass(isEditingShipping)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Utca</label>
            <input type="text" disabled={!isEditingShipping} value={shippingData.streetName} onChange={e => setShippingData({...shippingData, streetName: e.target.value})} className={getInputClass(isEditingShipping)} />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Házszám</label>
            <input type="text" disabled={!isEditingShipping} value={shippingData.houseNum} onChange={e => setShippingData({...shippingData, houseNum: e.target.value})} className={getInputClass(isEditingShipping)} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Épület</label>
            <input type="text" disabled={!isEditingShipping} value={shippingData.building} onChange={e => setShippingData({...shippingData, building: e.target.value})} className={`${getInputClass(isEditingShipping)} text-center`} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Emelet</label>
            <input type="text" disabled={!isEditingShipping} value={shippingData.floor} onChange={e => setShippingData({...shippingData, floor: e.target.value})} className={`${getInputClass(isEditingShipping)} text-center`} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Ajtó</label>
            <input type="text" disabled={!isEditingShipping} value={shippingData.door} onChange={e => setShippingData({...shippingData, door: e.target.value})} className={`${getInputClass(isEditingShipping)} text-center`} />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Irodaház neve</label>
          <input type="text" disabled={!isEditingShipping} value={shippingData.officeBuilding} onChange={e => setShippingData({...shippingData, officeBuilding: e.target.value})} className={getInputClass(isEditingShipping)} />
        </div>

        {renderEditFooter(isEditingShipping, () => setIsEditingShipping(false), async () => { await saveBillingData(); setIsEditingShipping(false); })}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">Számlázási adatok</h3>
          {!isEditingBilling && (
            <button onClick={() => setIsEditingBilling(true)} className="text-[#0B5D3F] hover:text-[#147A55] p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
              <Edit2 size={18} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Cégnév</label>
            <input type="text" disabled={!isEditingBilling} value={billingData.companyName} onChange={e => setBillingData({...billingData, companyName: e.target.value})} className={getInputClass(isEditingBilling)} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Adószám</label>
            <input type="text" disabled={!isEditingBilling} value={billingData.taxId} onChange={e => setBillingData({...billingData, taxId: e.target.value})} className={getInputClass(isEditingBilling)} />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Számlázási cím</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Irányítószám</label>
              <input type="text" disabled={!isEditingBilling} value={billingData.postcode} onChange={e => setBillingData({...billingData, postcode: e.target.value})} className={getInputClass(isEditingBilling)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Település</label>
              <input type="text" disabled={!isEditingBilling} value={billingData.city} onChange={e => setBillingData({...billingData, city: e.target.value})} className={getInputClass(isEditingBilling)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Utca</label>
              <input type="text" disabled={!isEditingBilling} value={billingData.streetName} onChange={e => setBillingData({...billingData, streetName: e.target.value})} className={getInputClass(isEditingBilling)} />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 ml-1 tracking-widest">Házszám</label>
              <input type="text" disabled={!isEditingBilling} value={billingData.houseNum} onChange={e => setBillingData({...billingData, houseNum: e.target.value})} className={getInputClass(isEditingBilling)} />
            </div>
          </div>
        </div>

        {renderEditFooter(isEditingBilling, () => setIsEditingBilling(false), async () => { await saveBillingData(); setIsEditingBilling(false); })}
      </div>
    </div>
  );

  const renderCompletedOrders = () => (
    <div className="space-y-4 animate-fade-in">
      {completedOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <p className="text-gray-500 dark:text-gray-400">Még nincs teljesített rendelésed.</p>
        </div>
      ) : (
        completedOrders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Teljesítve</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">#{order.orderNumber}</span>
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">Heti Rosti csomag - {order.quantity} palack</h3>
              {order.lastDeliveryDate && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kiszállítva: {formatDate(order.lastDeliveryDate)}</div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 w-full md:w-auto mt-4 md:mt-0">
              <div className="text-xl font-black text-gray-900 dark:text-gray-100">{formatCurrency(order.totalAmount)}</div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Számla: e-mailen</div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'active-orders': return renderActiveOrders();
      case 'contact': return renderContact();
      case 'shipping': return renderShipping();
      case 'billing': return renderBilling();
      case 'completed-orders': return renderCompletedOrders();
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B5D3F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans pb-20">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">
            {billingData.companyName || userEmail}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0B5D3F] text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.icon}
              {tab.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
