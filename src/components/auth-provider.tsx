"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/db/client';
import { Profile } from '@/lib/db/types';
import { mockProfiles } from '@/lib/mock-data';

interface AuthContextType {
  user: any;
  profile: Profile | null;
  userRole: 'donor' | 'recipient' | 'admin';
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  userRole: 'donor',
  loading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profileData);
      } else {
        // Use mock data for development
        setProfile(mockProfiles[0]);
      }

      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const userRole = profile?.role || 'donor';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      userRole,
      loading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};</arg_value>

Now let's update the main.tsx to include the AuthProvider:

<dyad-write path="src/main.tsx" description="Updating main.tsx with AuthProvider">
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);</arg_value>

Now let's create a simple component to display the current user info:

<dyad-write path="src/components/user-info.tsx" description="Creating user info component">
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function UserInfo() {
  const { profile, userRole } = useAuth();

  if (!profile) return null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{profile.organization_name}</h3>
            <p className="text-sm text-muted-foreground">{profile.contact_email}</p>
          </div>
          <Badge variant={userRole === 'donor' ? 'default' : userRole === 'recipient' ? 'default' : 'default'}>
            {userRole}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}</arg_value>

Now let's update the medication list to show the user info:

<dyad-write path="src/pages/donor/medication-list.tsx" description="Updating medication list with user info">
"use client";

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/db/client';
import { Medication } from '@/lib/db/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ThermometerSnowflake, AlertCircle, Plus } from 'lucide-react';
import { formatDistanceToStart } from 'date-fns';
import { UserInfo } from '@/components/user-info';

export function MedicationList() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('medications')
        .select('*')
        .order('expiry_date', { ascending: true });

      setMedications(data || []);
      setLoading(false);
    };

    fetchMedications();
  }, []);

  const getExpiryStatus = (expiryDate: string) => {
    const daysLeft = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysLeft < 0) return { status: 'expired', color: 'destructive', label: 'Expired' };
    if (daysLeft < 30) return { status: 'critical', color: 'destructive', label: 'Critical' };
    if (daysLeft < 60) return { status: 'urgent', color: 'warning', label: 'Urgent' };
    if (daysLeft < 90) return { status: 'eligible', color: 'success', label: 'Eligible' };
    return { status: 'healthy', color: 'success', label: 'Healthy' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'reserved': return 'warning';
      case 'in_transit': return 'info';
      case 'claimed': return 'warning';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <UserInfo />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Medication Inventory</h1>
          <Link to="/donor/request">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              List New Medicine
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <CardTitle className="h-6 w-3/4 bg-muted rounded" />
                <CardDescription className="h-4 w-1/2 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <UserInfo />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medication Inventory</h1>
        <Link to="/donor/request">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List New Medicine
          </Button>
        </Link>
      </div>

      {medications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No medications listed</h3>
            <p className="text-muted-foreground mb-4">
              Start by listing a medication to help combat pharmaceutical waste
            </p>
            <Link to="/donor/request">
              <Button>List Your First Medicine</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((med) => {
            const expiryInfo = getExpiryStatus(med.expiry_date);
            const daysLeft = Math.ceil(
              (new Date(med.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <Card key={med.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{med.name}</CardTitle>
                    <Badge variant={getStatusColor(med.status) as any}>
                      {med.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{med.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Days Until Expiry</span>
                        <span className={expiryInfo.color === 'destructive' ? 'text-destructive' : 'text-foreground'}>
                          {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                        </span>
                      </div>
                      <Progress 
                        value={Math.max(0, Math.min(100, (daysLeft / 365) * 100))} 
                        className={`h-2 ${expiryInfo.color === 'destructive' ? 'bg-destructive' : 'bg-emerald-500'}`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{med.quantity} {med.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <p className="font-medium">${med.original_value_usd?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ThermometerSnowflake className="h-4 w-4 mr-1" />
                      <span className="capitalize">{med.storage_requirements} storage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}</arg_value>

Now let's create a simple CSS file to ensure proper styling:

<dyad-write path="src/index.css" description="Creating index.css">
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

/* Healthcare Sustainability Theme */
@layer utilities {
  .bg-emerald {
    background-color: hsl(168 73% 52%);
  }
  
  .text-emerald {
    color: hsl(168 73% 52%);
  }
  
  .border-emerald {
    border-color: hsl(168 73% 52%);
  }
  
  .bg-rose {
    background-color: hsl(340 82% 52%);
  }
  
  .text-rose {
    color: hsl(340 82% 52%);
  }
  
  .border-rose {
    border-color: hsl(340 82% 52%);
  }
  
  .bg-warning {
    background-color: hsl(38 92% 54%);
  }
  
  .text-warning {
    color: hsl(38 92% 54%);
  }
  
  .border-warning {
    border-color: hsl(38 92% 54%);
  }
  
  .bg-success {
    background-color: hsl(168 73% 52%);
  }
  
  .text-success {
    color: hsl(168 73% 52%);
  }
  
  .border-success {
    border-color: hsl(168 73% 52%);
  }
  
  .bg-info {
    background-color: hsl(210 40% 96.1%);
  }
  
  .text-info {
    color: hsl(210 40% 46.9%);
  }
  
  .border-info {
    border-color: hsl(210 40% 96.1%);
  }
  
  .bg-destructive {
    background-color: hsl(0 84.2% 60.2%);
  }
  
  .text-destructive {
    color: hsl(0 84.2% 60.2%);
  }
  
  .border-destructive {
    border-color: hsl(0 84.2% 60.2%);
  }
}</arg_value>

Now let's create a simple test to verify the routing works. Let me check if there are any issues with the imports and create a simple index.css if needed:

<dyad-write path="src/styles/index.css" description="Creating index.css">
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

/* Healthcare Sustainability Theme */
@layer utilities {
  .bg-emerald {
    background-color: hsl(168 73% 52%);
  }
  
  .text-emerald {
    color: hsl(168 73% 52%);
  }
  
  .border-emerald {
    border-color: hsl(168 73% 52%);
  }
  
  .bg-rose {
    background-color: hsl(340 82% 52%);
  }
  
  .text-rose {
    color: hsl(340 82% 52%);
  }
  
  .border-rose {
    border-color: hsl(340 82% 52%);
  }
  
  .bg-warning {
    background-color: hsl(38 92% 54%);
  }
  
  .text-warning {
    color: hsl(38 92% 54%);
  }
  
  .border-warning {
    border-color: hsl(38 92% 54%);
  }
  
  .bg-success {
    background-color: hsl(168 73% 52%);
  }
  
  .text-success {
    color: hsl(168 73% 52%);
  }
  
  .border-success {
    border-color: hsl(168 73% 52%);
  }
  
  .bg-info {
    background-color: hsl(210 40% 96.1%);
  }
  
  .text-info {
    color: hsl(210 40% 46.9%);
  }
  
  .border-info {
    border-color: hsl(210 40% 96.1%);
  }
  
  .bg-destructive {
    background-color: hsl(0 84.2% 60.2%);
  }
  
  .text-destructive {
    color: hsl(0 84.2% 60.2%);
  }
  
  .border-destructive {
    border-color: hsl(0 84.2% 60.2%);
  }
}</arg_value>

Now let's update the main.tsx to import the correct CSS file:

<dyad-write path="src/main.tsx" description="Updating main.tsx with correct CSS import">
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/components/auth-provider";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);</arg_value>

Now let's create a simple test to verify the routing works. Let me check if there are any issues with the imports and create a simple index.css if needed:

<dyad-write path="src/pages/Test.tsx" description="Creating test page">
"use client";

export default function TestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-muted-foreground">
        This is a test page to verify routing is working correctly.
      </p>
    </div>
  );
}</arg_value>

Now let's update the App.tsx to add the test route and fix any potential issues:

<dyad-write path="src/App.tsx" description="Final update to App.tsx with all routes">
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MedicationList } from "./pages/donor/medication-list";
import { DonationRequestForm } from "./pages/donor/donation-request";
import { MedicationSearch } from "./pages/recipient/medication-search";
import { ImpactDashboard } from "./pages/impact/dashboard";
import { ComplianceCenter } from "./pages/admin/compliance-center";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Root redirects to Donor Portal */}
            <Route path="/" element={<Navigate to="/donor" replace />} />
            
            {/* Donor Portal Routes */}
            <Route path="/donor" element={<MedicationList />} />
            <Route path="/donor/request" element={<DonationRequestForm />} />
            
            {/* Recipient Portal Routes */}
            <Route path="/recipient" element={<MedicationSearch />} />
            
            {/* Impact Dashboard Routes */}
            <Route path="/impact" element={<ImpactDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ComplianceCenter />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;