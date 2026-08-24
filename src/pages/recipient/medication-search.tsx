import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShoppingCart, CheckCircle2, Clock, X, FileText, Check, Download } from 'lucide-react';
import { MedicationItem } from '../donor/medication-list';

const calculateUrgency = (expiryDateStr: string): { urgency: 'critical' | 'urgent' | 'eligible'; daysLeft: number } => {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft <= 30) return { urgency: 'critical', daysLeft };
  if (daysLeft <= 60) return { urgency: 'urgent', daysLeft };
  return { urgency: 'eligible', daysLeft };
};

export function MedicationSearch() {
  const [meds, setMeds] = useState<MedicationItem[]>([]);
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [cart, setCart] = useState<string[]>([]);
  
  // Checkout Modal State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [recipientFacility, setRecipientFacility] = useState('Seva Health Charitable Clinic');

  useEffect(() => {
    const saved = localStorage.getItem('ecomeds_inventory');
    if (saved) {
      setMeds(JSON.parse(saved));
    }
  }, []);

  const availableMeds = meds.filter((m) => m.status === 'available');

  const filteredMeds = availableMeds.filter((med) => {
    const { urgency } = calculateUrgency(med.expiryDate);
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase()) || med.donorName.toLowerCase().includes(search.toLowerCase());
    const matchesUrgency = urgencyFilter === 'all' || urgency === urgencyFilter;
    const matchesSource = sourceFilter === 'all' || med.sourceType === sourceFilter;
    return matchesSearch && matchesUrgency && matchesSource;
  });

  const cartItems = meds.filter((m) => cart.includes(m.id));
  const cartTotalValue = cartItems.reduce((acc, curr) => acc + curr.value, 0);

  const toggleCart = (id: string) => {
    setCart((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Mark selected batches as claimed in inventory
    const updatedInventory = meds.map((m) => {
      if (cart.includes(m.id)) {
        return { ...m, status: 'claimed' as const };
      }
      return m;
    });

    localStorage.setItem('ecomeds_inventory', JSON.stringify(updatedInventory));
    setMeds(updatedInventory);
    setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsOrderPlaced(true);
  };

  const closeReceipt = () => {
    setIsOrderPlaced(false);
    setIsCartOpen(false);
    setCart([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-emerald-900 text-white p-6 rounded-3xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800 rounded-full text-xs font-semibold tracking-wide uppercase text-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Recipient & NGO Marketplace
          </div>
          <h1 className="text-2xl font-bold">Rescue Pharmaceutical Catalog</h1>
          <p className="text-emerald-200 text-xs mt-1">Aggregated surplus inventory from verified factories and retail stores.</p>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-3 bg-emerald-800/80 hover:bg-emerald-800 px-4 py-3 rounded-2xl border border-emerald-700 transition cursor-pointer text-left"
        >
          <ShoppingCart className="w-5 h-5 text-emerald-300" />
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-300">Requisition Items</div>
            <div className="text-sm font-bold text-white">{cart.length} Batches Selected</div>
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by drug name or donor facility (e.g. Apollo, SunPharma)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Expiry Windows</option>
          <option value="critical">🔴 Critical (&lt;30 Days)</option>
          <option value="urgent">🟡 Urgent (30-60 Days)</option>
          <option value="eligible">🟢 Safe / Eligible (&gt;60 Days)</option>
        </select>
        
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Donor Sources</option>
          <option value="factory_warehouse">🏭 Direct Factory Warehouses</option>
          <option value="retail_store">🏪 Local Pharmacy Stores</option>
        </select>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMeds.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            No medications matching your current search criteria.
          </div>
        ) : (
          filteredMeds.map((med) => {
            const isSelected = cart.includes(med.id);
            const { urgency, daysLeft } = calculateUrgency(med.expiryDate);

            return (
              <div key={med.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      med.sourceType === 'factory_warehouse' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {med.sourceType === 'factory_warehouse' ? '🏭 Factory Bulk' : '🏪 Local Store'}
                    </span>

                    {urgency === 'critical' && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                        🔴 Critical ({daysLeft}d)
                      </span>
                    )}
                    {urgency === 'urgent' && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        🟡 Urgent ({daysLeft}d)
                      </span>
                    )}
                    {urgency === 'eligible' && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        🟢 Safe ({daysLeft}d)
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{med.name}</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">Donor: {med.donorName}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available Stock:</span>
                      <span className="font-semibold text-slate-800">{med.quantity.toLocaleString()} {med.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expiry Date:</span>
                      <span className="font-semibold text-slate-800">{med.expiryDate}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleCart(med.id)}
                  className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Added to Requisition
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Request Batch
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Cart & Checkout Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            {!isOrderPlaced ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Requisition Batch Review</h3>
                    <p className="text-xs text-slate-500">Confirm requested pharmaceutical supplies.</p>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Your requisition list is currently empty.
                  </div>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Receiving Facility Name</label>
                      <input
                        type="text"
                        required
                        value={recipientFacility}
                        onChange={(e) => setRecipientFacility(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl p-2 bg-slate-50">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <div className="text-[10px] text-slate-500">{item.donorName} • Batch: {item.batch}</div>
                          </div>
                          <div className="font-bold text-slate-800">{item.quantity} {item.unit}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl text-emerald-950 font-bold">
                      <span>Total Value Rescued:</span>
                      <span className="text-sm text-emerald-700">${cartTotalValue.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                      >
                        Confirm Requisition
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* Claim / Transfer Voucher Receipt */
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900">Requisition Authorized</h3>
                  <p className="text-xs text-slate-500">Chain-of-custody transfer voucher generated.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Voucher ID:</span>
                    <span className="font-mono font-bold text-slate-900">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Recipient:</span>
                    <span className="font-bold text-slate-900">{recipientFacility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Batches Claimed:</span>
                    <span className="font-bold text-slate-900">{cart.length} batches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Status:</span>
                    <span className="font-bold text-emerald-600">Reserved for Dispatch</span>
                  </div>
                </div>

                <button
                  onClick={closeReceipt}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Done & Return to Catalog
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationSearch;