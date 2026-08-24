import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, Search, X, ShieldCheck, Factory, Store, TrendingUp, AlertTriangle } from 'lucide-react';
import { AuthUser } from '../LandingPage';

export interface MedicationItem {
  id: string;
  donorEmail: string;
  donorName: string;
  name: string;
  ndc: string;
  category: string;
  quantity: number;
  unit: string;
  batch: string;
  expiryDate: string;
  value: number;
  sourceType: 'factory_warehouse' | 'retail_store';
  status: 'available' | 'reserved' | 'in_transit' | 'claimed';
  urgency: 'critical' | 'urgent' | 'eligible';
}

const calculateUrgency = (expiryDateStr: string): { urgency: 'critical' | 'urgent' | 'eligible'; daysLeft: number } => {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft <= 30) return { urgency: 'critical', daysLeft };
  if (daysLeft <= 60) return { urgency: 'urgent', daysLeft };
  return { urgency: 'eligible', daysLeft };
};

const SEED_MEDS: MedicationItem[] = [
  { id: '1', donorEmail: 'factory@sunpharma.com', donorName: 'SunPharma Plant #4', name: 'Amoxicillin 500mg (Pallet Batch)', ndc: '0093-3109-53', category: 'Antibiotics', quantity: 2400, unit: 'capsules', batch: 'WH-NOV-881', expiryDate: '2026-09-15', value: 3400, sourceType: 'factory_warehouse', status: 'available', urgency: 'urgent' },
  { id: '2', donorEmail: 'factory@sunpharma.com', donorName: 'SunPharma Plant #4', name: 'Insulin Glargine (Cold Storage)', ndc: '0088-2220-33', category: 'Diabetes', quantity: 120, unit: 'vials', batch: 'WH-INS-102', expiryDate: '2026-08-30', value: 2400, sourceType: 'factory_warehouse', status: 'reserved', urgency: 'critical' },
  { id: '3', donorEmail: 'apollopharmacy121@gmail.com', donorName: 'Apollo Pharmacy, Sanath Nagar', name: 'Dolo 650mg Paracetamol', ndc: '50090-2851-0', category: 'Analgesics', quantity: 120, unit: 'tablets', batch: 'BAT-5123', expiryDate: '2026-09-30', value: 300, sourceType: 'retail_store', status: 'available', urgency: 'urgent' },
];

export function MedicationList({ user }: { user: AuthUser }) {
  const [allMeds, setAllMeds] = useState<MedicationItem[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    ndc: '',
    category: 'Antibiotics',
    quantity: '',
    unit: user.donorType === 'enterprise' ? 'cartons' : 'tablets',
    batch: '',
    expiryDate: '',
    unitPrice: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('ecomeds_inventory');
    if (saved) {
      setAllMeds(JSON.parse(saved));
    } else {
      localStorage.setItem('ecomeds_inventory', JSON.stringify(SEED_MEDS));
      setAllMeds(SEED_MEDS);
    }
  }, []);

  const myInventory = allMeds.filter(
    (m) => m.donorEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.expiryDate) return;

    const { urgency } = calculateUrgency(formData.expiryDate);
    const qty = parseInt(formData.quantity) || 100;
    const price = parseFloat(formData.unitPrice) || 2.5;

    const newMed: MedicationItem = {
      id: Date.now().toString(),
      donorEmail: user.email.toLowerCase(),
      donorName: user.orgName,
      name: formData.name,
      ndc: formData.ndc || '8839-2910-12',
      category: formData.category,
      quantity: qty,
      unit: formData.unit,
      batch: formData.batch || `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: formData.expiryDate,
      value: Math.round(qty * price),
      sourceType: user.donorType === 'enterprise' ? 'factory_warehouse' : 'retail_store',
      status: 'available',
      urgency,
    };

    const updated = [newMed, ...allMeds];
    setAllMeds(updated);
    localStorage.setItem('ecomeds_inventory', JSON.stringify(updated));
    setIsModalOpen(false);

    setFormData({
      name: '',
      ndc: '',
      category: 'Antibiotics',
      quantity: '',
      unit: user.donorType === 'enterprise' ? 'cartons' : 'tablets',
      batch: '',
      expiryDate: '',
      unitPrice: '',
    });
  };

  const filtered = myInventory.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.batch.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = myInventory.reduce((acc, curr) => acc + curr.value, 0);
  const totalCO2Diverted = Math.round(myInventory.reduce((acc, curr) => acc + curr.quantity * 0.15, 0));
  const criticalItemsCount = myInventory.filter((m) => calculateUrgency(m.expiryDate).urgency === 'critical').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Donor Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              user.donorType === 'enterprise' 
                ? 'bg-purple-950 text-purple-300 border-purple-800' 
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}>
              {user.donorType === 'enterprise' ? <Factory className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
              {user.donorType === 'enterprise' ? 'Enterprise / Factory Outlet' : 'Local Retail Pharmacy'}
            </span>
            <span className="text-xs text-emerald-400 font-bold">Facility: {user.orgName}</span>
          </div>
          <h1 className="text-2xl font-black">My Surplus Inventory & Listed Batches</h1>
          <p className="text-slate-400 text-xs mt-1">
            Private dashboard for <strong>{user.email}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
              {user.esgScore || 85}
            </div>
            <div>
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">My ESG Rating</div>
              <div className="text-xs font-extrabold text-white flex items-center gap-1">
                Tier 1 Verified <TrendingUp className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-lg transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            {user.donorType === 'enterprise' ? 'List Pallet Batch' : 'List Store Surplus'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-medium">My Listed Inventory Value</div>
          <div className="text-2xl font-black text-slate-900 mt-1">${totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-medium">My Landfill Emissions Diverted</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalCO2Diverted} kg CO2</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Critical Batches (&lt;30 Days)</div>
          <div className="text-2xl font-black text-red-600 mt-1">{criticalItemsCount} Urgent Items</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by drug name or batch ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Table with Red / Yellow / Green Expiry Urgency */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="font-bold text-slate-700">No medications listed yet for {user.orgName}</div>
            <p className="text-xs text-slate-400">Click the green button above to list a batch.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Medication</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Expiry Date & Urgency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tax Relief Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const { urgency, daysLeft } = calculateUrgency(item.expiryDate);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Batch: {item.batch}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {item.quantity.toLocaleString()} <span className="text-slate-400 font-normal">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{item.expiryDate}</span>
                        {urgency === 'critical' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            🔴 Critical ({daysLeft}d)
                          </span>
                        )}
                        {urgency === 'urgent' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            🟡 Urgent ({daysLeft}d)
                          </span>
                        )}
                        {urgency === 'eligible' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            🟢 Safe ({daysLeft}d)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize bg-slate-100 text-slate-700">
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600">
                      ${item.value.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {user.donorType === 'enterprise' ? 'Register Factory Pallet Batch' : 'Register Retail Store Surplus'}
                </h3>
                <p className="text-xs text-slate-500">Listing under: <strong>{user.orgName}</strong></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Drug Name & Strength *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dolo 650mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity *</label>
                  <input
                    required
                    type="number"
                    placeholder="120"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batch #</label>
                  <input
                    type="text"
                    placeholder="BAT-5123"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expiration Date *</label>
                  <input
                    required
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Publish Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationList;