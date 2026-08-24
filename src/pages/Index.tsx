"use client";

import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const portals = [
  {
    title: 'Donor Portal',
    description: 'List medications, manage inventory, and track donations',
    href: '/donor',
    icon: Stethoscope,
    color: 'emerald',
  },
  {
    title: 'Recipient Portal',
    description: 'Search for medications and submit donation requests',
    href: '/recipient',
    icon: Heart,
    color: 'rose',
  },
  {
    title: 'Impact Dashboard',
    description: 'View global sustainability metrics and achievements',
    href: '/impact',
    icon: Shield,
    color: 'blue',
  },
  {
    title: 'Admin Compliance',
    description: 'Review registrations and monitor compliance',
    href: '/admin',
    icon: Shield,
    color: 'purple',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-12 md:py-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
            <Shield className="h-4 w-4 mr-2" />
            Combatting Medicine Waste Through Circular Economy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            <span className="text-foreground">EcoMeds</span>
            <br />
            <span className="text-muted-foreground">Redistributing Near-Expiry Pharmaceuticals</span>
          </h1>
          <p className="max-w-[700px] text-xl text-muted-foreground">
            Connecting donors with verified recipients to reduce pharmaceutical waste and support global health initiatives aligned with UN SDGs 3 & 12.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Card key={portal.title} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">{portal.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {portal.description}
                  </CardDescription>
                  <Link to={portal.href} className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:underline">
                    Access {portal.title}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">500+</CardTitle>
              <CardDescription>Medications Diverted</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">$2M+</CardTitle>
              <CardDescription>Financial Value Saved</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">1000+</CardTitle>
              <CardDescription>Patients Served</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}