"use client";

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface RoleGateProps {
  allowedRoles: ('donor' | 'recipient' | 'admin')[];
  children: React.ReactNode;
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const { userRole } = useAuth();
  const location = useLocation();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/donor" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}</arg_value>

Let's create a simple auth hook:

<dyad-write path="src/hooks/use-auth.tsx" description="Creating auth hook">
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db/client';
import { Profile } from '@/lib/db/types';
import { mockProfiles } from '@/lib/mock-data';

export function useAuth() {
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

  return {
    user,
    profile,
    userRole,
    loading,
    isAuthenticated: !!user,
  };
}</arg_value>

Now let's update the header to use the auth hook:

<dyad-write path="src/components/header.tsx" description="Updating header with auth integration">
"use client";

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Donor Portal', href: '/donor', icon: Stethoscope },
  { name: 'Recipient Portal', href: '/recipient', icon: Heart },
  { name: 'Impact Dashboard', href: '/impact', icon: Shield },
  { name: 'Admin Compliance', href: '/admin', icon: Shield },
];

const roleLabels = {
  donor: 'Donor (Apex Health Pharmacy)',
  recipient: 'Recipient (Hope Free Clinic NGO)',
  admin: 'Admin (Compliance Officer)',
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleChange = (role: 'donor' | 'recipient' | 'admin') => {
    navigate(`/${role}`);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/donor" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl text-foreground">EcoMeds</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-emerald-50 ${
                  isActive(item.href)
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-muted-foreground hover:text-emerald-600'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Role Switcher & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`/${userRole}.png`} />
                  <AvatarFallback className="text-xs">
                    {userRole === 'donor' ? 'DH' : userRole === 'recipient' ? 'RH' : 'AD'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{roleLabels[userRole]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(roleLabels).map(([role, label]) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleChange(role as 'donor' | 'recipient' | 'admin')}
                  className="cursor-pointer"
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-1 p-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-emerald-50 ${
                    isActive(item.href)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-muted-foreground hover:text-emerald-600'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}