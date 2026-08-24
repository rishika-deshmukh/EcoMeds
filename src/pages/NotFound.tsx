"use client";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist
        </p>
        <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
          <a href="/donor">
            <Home className="h-4 w-4 mr-2" />
            Return to Donor Portal
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;