import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LandingPage, AuthUser } from './pages/LandingPage';
import { MedicationList } from './pages/donor/medication-list';
import { MedicationSearch } from './pages/recipient/medication-search';
import { ImpactDashboard } from './pages/impact/dashboard';
import { Building2, HeartHandshake, BarChart3, Leaf, LogOut } from 'lucide-react';

function NavigationHeader({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              EcoMeds <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">Active Portal</span>
            </div>
            <p className="text-[10px] text-slate-400">{user.orgName}</p>
          </div>
        </div>

        {/* Role Navigation */}
        <nav className="flex items-center gap-2">
          {user.role === 'donor' ? (
            <Link
              to="/donor"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                location.pathname.startsWith('/donor')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              Donor Batches
            </Link>
          ) : (
            <Link
              to="/recipient"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                location.pathname.startsWith('/recipient')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              Requisition Marketplace
            </Link>
          )}

          <Link
            to="/impact"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              location.pathname.startsWith('/impact')
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Impact & ESG Ratings
          </Link>
        </nav>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-slate-800 capitalize">
              {user.role === 'donor' ? (user.donorType === 'enterprise' ? 'Enterprise Donor' : 'Retail Store Donor') : 'Verified NGO'}
            </div>
            <div className="text-[10px] text-slate-400">{user.email}</div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        {!user ? (
          <LandingPage onLogin={(userData) => setUser(userData)} />
        ) : (
          <>
            <NavigationHeader user={user} onLogout={() => setUser(null)} />
            <main className="flex-1">
              <Routes>
                <Route 
                  path="/donor" 
                  element={user.role === 'donor' ? <MedicationList user={user} /> : <Navigate to="/recipient" replace />} 
                />
                <Route 
                  path="/recipient" 
                  element={user.role === 'recipient' ? <MedicationSearch /> : <Navigate to="/donor" replace />} 
                />
                <Route path="/impact" element={<ImpactDashboard />} />
                <Route 
                  path="*" 
                  element={<Navigate to={user.role === 'donor' ? '/donor' : '/recipient'} replace />} 
                />
              </Routes>
            </main>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}