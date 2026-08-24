CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('donor', 'recipient', 'admin')),
  license_number TEXT,
  verified BOOLEAN DEFAULT FALSE,
  contact_email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE medications (
  id UUID PRIMARY KEY,
  donor_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  ndc_code TEXT UNIQUE,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  batch_number TEXT,
  expiry_date DATE NOT NULL,
  storage_requirements TEXT CHECK (storage_requirements IN ('ambient', 'refrigerated', 'frozen')),
  original_value_usd NUMERIC(10,2),
  status TEXT CHECK (status IN ('available', 'reserved', 'in_transit', 'claimed', 'expired')),
  verification_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE donation_requests (
  id UUID PRIMARY KEY,
  medication_id UUID REFERENCES medications(id),
  donor_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  quantity_requested INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'shipped', 'delivered', 'rejected')),
  tracking_number TEXT,
  qr_manifest_code TEXT,
  tax_receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE impact_metrics (
  id UUID PRIMARY KEY,
  total_diverted_kg NUMERIC(10,2),
  financial_value_saved NUMERIC(10,2),
  treatments_facilitated INTEGER,
  co2_prevented_kg NUMERIC(10,2)
);