"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/db/client';
import { Medication, Profile } from '@/lib/db/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export function DonationRequestForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    medication_id: '',
    quantity_requested: 1,
    recipient_id: '',
    status: 'pending' as const,
  });

  const [medications, setMedications] = useState<Medication[]>([]);
  const [recipients, setRecipients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: meds } = await supabase
        .from('medications')
        .select('*')
        .eq('status', 'available');
      
      const { data: recips } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'recipient')
        .eq('verified', true);

      setMedications(meds || []);
      setRecipients(recips || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const selectedMedication = medications.find(m => m.id === formData.medication_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medication_id || !formData.recipient_id) {
      toast({
        title: "Missing Information",
        description: "Please select both a medication and a recipient.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('donation_requests')
        .insert({
          medication_id: formData.medication_id,
          quantity_requested: formData.quantity_requested,
          recipient_id: formData.recipient_id,
          status: formData.status,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Donation request created successfully!",
      });

      navigate('/donor');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create donation request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading medications and recipients...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/donor')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Inventory
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Donation Request</CardTitle>
          <CardDescription>
            Request a medication donation from your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Medication Selection */}
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Select
                value={formData.medication_id}
                onValueChange={(value) => setFormData({ ...formData, medication_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.length === 0 ? (
                    <SelectItem value="" disabled>
                      No available medications
                    </SelectItem>
                  ) : (
                    medications.map(med => (
                      <SelectItem key={med.id} value={med.id}>
                        <div className="flex justify-between w-full">
                          <span>{med.name} ({med.category})</span>
                          <span className="text-muted-foreground text-sm">
                            {med.quantity} {med.unit}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Medication Details (read-only) */}
            {selectedMedication && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-3">Medication Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">NDC Code</p>
                      <p>{selectedMedication.ndc_code}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Batch Number</p>
                      <p>{selectedMedication.batch_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Storage</p>
                      <p className="capitalize">{selectedMedication.storage_requirements}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Original Value</p>
                      <p>${selectedMedication.original_value_usd?.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Requested</Label>
              <Input
                type="number"
                id="quantity"
                min="1"
                max={selectedMedication?.quantity || 999}
                value={formData.quantity_requested}
                onChange={(e) => setFormData({ ...formData, quantity_requested: parseInt(e.target.value) || 1 })}
              />
              {selectedMedication && (
                <p className="text-sm text-muted-foreground">
                  Available: {selectedMedication.quantity} {selectedMedication.unit}
                </p>
              )}
            </div>

            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Organization</Label>
              <Select
                value={formData.recipient_id}
                onValueChange={(value) => setFormData({ ...formData, recipient_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a verified recipient" />
                </SelectTrigger>
                <SelectContent>
                  {recipients.length === 0 ? (
                    <SelectItem value="" disabled>
                      No verified recipients available
                    </SelectItem>
                  ) : (
                    recipients.map(recipient => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.organization_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default DonationRequest;