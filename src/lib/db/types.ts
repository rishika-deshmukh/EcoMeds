export interface Profile {
  id: string;
  organization_name: string;
  role: 'donor' | 'recipient' | 'admin';
  license_number?: string;
  verified: boolean;
  contact_email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface Medication {
  id: string;
  donor_id: string;
  name: string;
  ndc_code: string;
  category: string;
  quantity: number;
  unit: string;
  batch_number?: string;
  expiry_date: string;
  storage_requirements: 'ambient' | 'refrigerated' | 'frozen';
  original_value_usd: number;
  status: 'available' | 'reserved' | 'in_transit' | 'claimed' | 'expired';
  verification_image_url?: string;
  created_at: string;
}

export interface DonationRequest {
  id: string;
  medication_id: string;
  donor_id: string;
  recipient_id: string;
  quantity_requested: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'rejected';
  tracking_number?: string;
  qr_manifest_code?: string;
  tax_receipt_url?: string;
  created_at: string;
}

export interface ImpactMetric {
  id: string;
  total_diverted_kg: number;
  financial_value_saved: number;
  treatments_facilitated: number;
  co2_prevented_kg: number;
}