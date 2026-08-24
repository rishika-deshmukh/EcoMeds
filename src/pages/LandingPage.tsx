import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  HeartHandshake, 
  Building2, 
  Store, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Globe2, 
  Lock, 
  Mail, 
  Sparkles,
  X,
  Factory,
  AlertCircle
} from 'lucide-react';

export interface AuthUser {
  email: string;
  orgName: string;
  role: 'donor' | 'recipient';
  donorType?: 'enterprise' | 'retail';
  esgScore?: number;
}

interface StoredAccount extends AuthUser {
  password?: string;
}

interface LandingPageProps {
  onLogin: (user: AuthUser) => void;
}

// Initial seed accounts if none exist
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    email: 'factory@sunpharma.com',
    password: 'password123',
    orgName: 'SunPharma Plant #4',
    role: 'donor',
    donorType: 'enterprise',
    esgScore: 94
  },
  {
    email: 'apollopharmacy121@gmail.com',
    password: 'password123',
    orgName: 'Apollo Pharmacy, Sanath Nagar',
    role: 'donor',
    donorType: 'retail',
    esgScore: 84
  },
  {
    email: 'contact@sevahealth.org',
    password: 'password123',
    orgName: 'Seva Health Charitable Clinic',
    role: 'recipient'
  }
];

export function LandingPage({ onLogin }: LandingPageProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [selectedRole, setSelectedRole] = useState<'donor' | 'recipient'>('donor');
  const [donorType, setDonorType] = useState<'enterprise' | 'retail'>('enterprise');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize accounts in localStorage
  useEffect(() => {
    const existing = localStorage.getItem('ecomeds_accounts');
    if (!existing) {
      localStorage.setItem('ecomeds_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const savedAccounts: StoredAccount[] = JSON.parse(localStorage.getItem('ecomeds_accounts') || '[]');

    if (authMode === 'signup') {
      // Check if account already exists
      const accountExists = savedAccounts.some(acc => acc.email.toLowerCase() === email.trim().toLowerCase());
      if (accountExists) {
        setErrorMessage('An account with this email already exists. Please log in.');
        return;
      }

      if (!orgName.trim()) {
        setErrorMessage('Please enter your organization or shop name.');
        return;
      }

      // Create new account
      const newAccount: StoredAccount = {
        email: email.trim().toLowerCase(),
        password,
        orgName: orgName.trim(),
        role: selectedRole,
        donorType: selectedRole === 'donor' ? donorType : undefined,
        esgScore: selectedRole === 'donor' ? (donorType === 'enterprise' ? 90 : 80) : undefined,
      };

      const updated = [...savedAccounts, newAccount];
      localStorage.setItem('ecomeds_accounts', JSON.stringify(updated));

      onLogin(newAccount);
    } else {
      // Login mode
      const matched = savedAccounts.find(acc => acc.email.toLowerCase() === email.trim().toLowerCase());

      if (!matched) {
        setErrorMessage('Account does not exist! Please check your email or create a new account.');
        return;
      }

      if (matched.password && matched.password !== password) {
        setErrorMessage('Incorrect password. Please try again.');
        return;
      }

      onLogin(matched);
    }
  };

  const openAuth = (role: 'donor' | 'recipient', dType: 'enterprise' | 'retail' = 'enterprise', mode: 'login' | 'signup' = 'signup') => {
    setSelectedRole(role);
    setDonorType(dType);
    setAuthMode(mode);
    setErrorMessage('');
    setEmail('');
    setPassword('');
    setOrgName('');
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                EcoMeds <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">SDG 3 & 12</span>
              </div>
              <p className="text-[11px] text-slate-400">Pharmaceutical Circular Economy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => openAuth('donor', 'enterprise', 'login')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition"
            >
              Sign In
            </button>
            <button 
              onClick={() => openAuth('donor', 'enterprise', 'signup')}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-sm transition active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" /> Corporate ESG & Community Waste Redistribution Exchange
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Stop Medicine Destruction. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Boost ESG Ratings & Save Lives.
            </span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Direct surplus redistribution for <strong>factory warehouses</strong> and <strong>local retail stores</strong> to verified non-profit dispensaries with automated CSR tax credits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button 
              onClick={() => openAuth('donor', 'enterprise', 'signup')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow transition text-xs"
            >
              <Factory className="w-4 h-4" /> Enterprise / Factory Donor
            </button>
            <button 
              onClick={() => openAuth('donor', 'retail', 'signup')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow transition text-xs"
            >
              <Store className="w-4 h-4" /> Local Pharmacy / Store Donor
            </button>
            <button 
              onClick={() => openAuth('recipient', 'enterprise', 'signup')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-5 py-3 rounded-xl shadow transition text-xs"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" /> Recipient NGO Portal
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Impact Stats */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">ESG & BRSR Ready</div>
              <div className="text-xs text-slate-500">Certified environmental waste diversion reports</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 md:border-l border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">3.6 Tons CO2 Diverted</div>
              <div className="text-xs text-slate-500">Zero-incineration pharmaceutical recovery</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 md:border-l border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">4,120+ Batches</div>
              <div className="text-xs text-slate-500">Routed to accredited charitable clinics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Verified Partner Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Trusted Across the Supply Chain</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "As a manufacturing plant manager, donating bulk pallet overstock boosted our quarterly corporate ESG rating to 94 while ensuring life-saving antibiotics didn't end up in incinerators."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                FK
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Farhan Khan</div>
                <div className="text-[11px] text-slate-400">Logistics Director, SunPharma Factory</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Our retail pharmacy used to write off 15-20 near-expiry packs a month as pure loss. EcoMeds gave us digital tax receipts and zero-waste community certification."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                AM
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Ananya Mehta</div>
                <div className="text-[11px] text-slate-400">Owner, Apollo Pharmacy</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "We provide primary care to underserved families. Getting access to donor insulin and respiratory medications directly from warehouses saved our NGO thousands."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                DR
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. Rajesh Varma</div>
                <div className="text-[11px] text-slate-400">Head Physician, Seva Health Trust</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-7 shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-extrabold text-xl text-slate-900">
                {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'signup' ? 'Register your facility or organization.' : 'Sign in to access your private inventory.'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Role Switch */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedRole('donor')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedRole === 'donor' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Donor Account
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('recipient')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedRole === 'recipient' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" /> Recipient NGO
              </button>
            </div>

            {/* Sub-role: Enterprise vs Retail */}
            {selectedRole === 'donor' && authMode === 'signup' && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
                <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                  Donor Classification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDonorType('enterprise')}
                    className={`p-2.5 rounded-xl text-left border transition ${
                      donorType === 'enterprise'
                        ? 'bg-white border-emerald-500 text-emerald-950 shadow-sm'
                        : 'border-emerald-200/60 text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Factory className="w-3.5 h-3.5 text-emerald-600" /> Enterprise
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Factory / Warehouse</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDonorType('retail')}
                    className={`p-2.5 rounded-xl text-left border transition ${
                      donorType === 'retail'
                        ? 'bg-white border-emerald-500 text-emerald-950 shadow-sm'
                        : 'border-emerald-200/60 text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Store className="w-3.5 h-3.5 text-emerald-600" /> Retail Store
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Local Chemist / Shop</div>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
              {authMode === 'signup' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {selectedRole === 'donor' 
                      ? (donorType === 'enterprise' ? 'Company / Factory Entity Name' : 'Shop / Pharmacy Name')
                      : 'NGO / Community Dispensary Name'}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={selectedRole === 'donor' ? (donorType === 'enterprise' ? 'e.g. SunPharma Plant #4' : 'e.g. Apollo Pharmacy, Sanath Nagar') : 'e.g. Seva Health NGO'}
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    type="email"
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition text-xs flex items-center justify-center gap-1.5 mt-2"
              >
                {authMode === 'signup' 
                  ? `Register as ${selectedRole === 'donor' ? (donorType === 'enterprise' ? 'Corporate Factory' : 'Retail Store') : 'Recipient'}` 
                  : 'Log In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
              {authMode === 'signup' ? (
                <span>Already have an account? <button onClick={() => { setAuthMode('login'); setErrorMessage(''); }} className="font-bold text-emerald-600 hover:underline">Log in</button></span>
              ) : (
                <span>Need an account? <button onClick={() => { setAuthMode('signup'); setErrorMessage(''); }} className="font-bold text-emerald-600 hover:underline">Sign up</button></span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;