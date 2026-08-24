"use client";

import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}