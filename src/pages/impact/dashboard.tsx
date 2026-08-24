import React, { useState } from 'react';
import { 
  Leaf, 
  HeartHandshake, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Droplets, 
  Sparkles, 
  Globe2, 
  Award,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export function ImpactDashboard() {
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'all'>('all');

  // Multipliers based on timeframe
  const multiplier = timeframe === '30d' ? 0.35 : timeframe === '90d' ? 0.7 : 1.0;

  const totalRescuedUnits = Math.round(18450 * multiplier);
  const financialValue = Math.round(142850 * multiplier);
  const carbonOffsetKg = Math.round(3620 * multiplier);
  const waterProtectedLiters = Math.round(89400 * multiplier);
  const treatmentsFunded = Math.round(4120 * multiplier);

  const topDonors = [
    { name: 'Apex Health Systems', units: Math.round(6200 * multiplier), value: Math.round(48500 * multiplier), badge: 'Gold Contributor' },
    { name: 'Metro General Hospital', units: Math.round(4900 * multiplier), value: Math.round(39200 * multiplier), badge: 'Silver Contributor' },
    { name: 'CareFirst Regional Clinics', units: Math.round(3850 * multiplier), value: Math.round(31150 * multiplier), badge: 'Silver Contributor' },
    { name: 'BioMed Logistics Network', units: Math.round(3500 * multiplier), value: Math.round(24000 * multiplier), badge: 'Bronze Contributor' },
  ];

  const categoryBreakdown = [
    { name: 'Antibiotics & Anti-infectives', percentage: 38, color: 'bg-emerald-500', units: Math.round(7011 * multiplier) },
    { name: 'Cardiovascular & Hypertension', percentage: 24, color: 'bg-teal-500', units: Math.round(4428 * multiplier) },
    { name: 'Diabetes & Metabolic Care', percentage: 20, color: 'bg-cyan-500', units: Math.round(3690 * multiplier) },
    { name: 'Respiratory & Inhalers', percentage: 12, color: 'bg-sky-500', units: Math.round(2214 * multiplier) },
    { name: 'Analgesics & Pain Relief', percentage: 6, color: 'bg-slate-400', units: Math.round(1107 * multiplier) },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-7 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/60">
                <Globe2 className="w-3.5 h-3.5" /> Circular Healthcare Index
              </span>
              <span className="text-xs text-slate-300 font-medium">Real-Time ESG Reporting</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Sustainability & ESG Impact</h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
              Quantifying waste reduction, toxic landfill diversion, and direct patient access delivered by the EcoMeds network.
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 self-start md:self-auto border border-white/10">
            {(['30d', '90d', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  timeframe === period
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                {period === '30d' ? 'Last 30 Days' : period === '90d' ? 'Quarterly' : 'All-Time Cumulative'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wide">Medications Rescued</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalRescuedUnits.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +28% vs previous period
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wide">Financial Value Saved</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-700">${financialValue.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-2">Direct drug acquisition savings for NGOs</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wide">Carbon Footprint Avoided</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{carbonOffsetKg.toLocaleString()} kg</div>
          <div className="text-xs text-slate-400 mt-2">Equivalent to ~150 tree seedlings for 10 yrs</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wide">Watershed Contamination Prevented</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-700">{waterProtectedLiters.toLocaleString()} L</div>
          <div className="text-xs text-slate-400 mt-2">Diverted from sewage & incineration</div>
        </div>
      </div>

      {/* SDG Alignment & Visual Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category Diversion Progress */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Therapeutic Class Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">Distribution of active ingredients re-routed to certified health centers.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5" /> Updated hourly
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 font-semibold">{cat.name}</span>
                  <span className="text-slate-500">{cat.units.toLocaleString()} units ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-700 ease-out`} 
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SDG Goal Badges */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                SDG 3
              </div>
              <div className="text-xs">
                <div className="font-bold text-red-950">Good Health & Well-Being</div>
                <p className="text-red-800/80 mt-0.5">{treatmentsFunded.toLocaleString()} acute and chronic prescriptions completed.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                SDG 12
              </div>
              <div className="text-xs">
                <div className="font-bold text-amber-950">Responsible Consumption</div>
                <p className="text-amber-800/80 mt-0.5">99.4% circular reuse rate on verified donations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Top Donor Leaderboard */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900">Leaderboard</h2>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-xs text-slate-500">Top healthcare contributors to the circular supply chain.</p>

          <div className="space-y-3 pt-2">
            {topDonors.map((donor, idx) => (
              <div key={donor.name} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-800 truncate max-w-[150px]">{donor.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {donor.badge}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 mt-1">
                  <span>{donor.units.toLocaleString()} units</span>
                  <span className="font-semibold text-emerald-700">${donor.value.toLocaleString()} value</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImpactDashboard;