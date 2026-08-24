export const supabase = {
  auth: {
    getSession: async () => {
      return {
        data: { 
          session: { 
            user: { 
              id: 'demo-user', 
              email: 'demo@ecomeds.org',
              user_metadata: { 
                full_name: 'Demo User'
              } 
            } 
          } 
        }, 
        error: null 
      };
    },
    onAuthStateChange: (callback) => {
      callback('SIGNED_IN', { 
        user: { 
          id: 'demo-user', 
          email: 'demo@ecomeds.org',
          user_metadata: { 
            full_name: 'Demo User'
          } 
        } 
      });
      return { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      };
    },
    signInWithPassword: async () => {
      return { 
        data: { 
          session: { 
            user: { 
              id: 'demo-user', 
              email: 'demo@ecomeds.org',
              user_metadata: { 
                full_name: 'Demo User'
              } 
            } 
          } 
        }, 
        error: null 
      };
    },
    signOut: async () => {
      return { error: null };
    }
  },
  from: (table: string) => {
    let mockData: any[] = [];
    
    if (table === 'profiles') {
      mockData = [
        {
          id: '1',
          organization_name: 'Apex Health Pharmacy',
          role: 'donor',
          license_number: 'DEA-12345',
          verified: true,
          contact_email: 'contact@apexhealth.com',
          phone: '+1-555-0101',
          address: '123 Medical Plaza, San Francisco, CA',
          created_at: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          organization_name: 'City Hospital Pharmacy',
          role: 'donor',
          license_number: 'CA-67890',
          verified: true,
          contact_email: 'pharmacy@cityhospital.org',
          phone: '+1-555-0102',
          address: '456 Hospital Drive, San Francisco, CA',
          created_at: '2024-01-16T10:00:00Z',
        },
        {
          id: '3',
          organization_name: 'Hope Free Clinic NGO',
          role: 'recipient',
          license_number: 'NGO-54321',
          verified: true,
          contact_email: 'info@hopeclinic.org',
          phone: '+1-555-0201',
          address: '789 Community Ave, Oakland, CA',
          created_at: '2024-01-17T10:00:00Z',
        },
        {
          id: '4',
          organization_name: 'Rural Health Outreach',
          role: 'recipient',
          license_number: 'NGO-98765',
          verified: true,
          contact_email: 'contact@ruralhealth.org',
          phone: '+1-555-0202',
          address: '321 Country Road, Vallejo, CA',
          created_at: '2024-01-18T10:00:00Z',
        },
        {
          id: '5',
          organization_name: 'PharmaWholesale Distributors',
          role: 'donor',
          license_number: 'WH-11223',
          verified: false,
          contact_email: 'info@pharmawholesale.com',
          phone: '+1-555-0301',
          address: '555 Distribution Blvd, San Jose, CA',
          created_at: '2024-01-19T10:00:00Z',
        },
        {
          id: '6',
          organization_name: 'Community Health Initiative',
          role: 'recipient',
          license_number: 'NGO-44556',
          verified: false,
          contact_email: 'admin@communityhealth.org',
          phone: '+1-555-0302',
          address: '999 Wellness St, Richmond, CA',
          created_at: '2024-01-20T10:00:00Z',
        }
      ];
    } else if (table === 'medications') {
      mockData = [
        {
          id: '1',
          donor_id: '1',
          name: 'Amoxicillin 500mg',
          ndc_code: '00093-0511-01',
          category: 'Antibiotics',
          quantity: 150,
          unit: 'tablets',
          batch_number: 'AM2024-001',
          expiry_date: '2024-12-15',
          storage_requirements: 'ambient',
          original_value_usd: 125.50,
          status: 'available',
          verification_image_url: 'https://example.com/verification1.jpg',
          created_at: '2024-01-10T09:00:00Z',
        },
        {
          id: '2',
          donor_id: '1',
          name: 'Metformin 500mg',
          ndc_code: '00093-0521-01',
          category: 'Diabetes',
          quantity: 200,
          unit: 'tablets',
          batch_number: 'MT2024-002',
          expiry_date: '2025-03-20',
          storage_requirements: 'ambient',
          original_value_usd: 89.99,
          status: 'available',
          verification_image_url: 'https://example.com/verification2.jpg',
          created_at: '2024-01-11T09:00:00Z',
        },
        {
          id: '3',
          donor_id: '2',
          name: 'Ibuprofen 400mg',
          ndc_code: '00093-0531-01',
          category: 'Analgesics',
          quantity: 300,
          unit: 'tablets',
          batch_number: 'IB2024-003',
          expiry_date: '2024-11-30',
          storage_requirements: 'ambient',
          original_value_usd: 67.25,
          status: 'available',
          verification_image_url: 'https://example.com/verification3.jpg',
          created_at: '2024-01-12T09:00:00Z',
        },
        {
          id: '4',
          donor_id: '2',
          name: 'Insulin Glargine 100U/ml',
          ndc_code: '00093-0541-01',
          category: 'Diabetes',
          quantity: 50,
          unit: 'vials',
          batch_number: 'IN2024-004',
          expiry_date: '2024-10-15',
          storage_requirements: 'refrigerated',
          original_value_usd: 245.00,
          status: 'available',
          verification_image_url: 'https://example.com/verification4.jpg',
          created_at: '2024-01-13T09:00:00Z',
        },
        {
          id: '5',
          donor_id: '1',
          name: 'Azithromycin 250mg',
          ndc_code: '00093-0551-01',
          category: 'Antibiotics',
          quantity: 100,
          unit: 'tablets',
          batch_number: 'AZ2024-005',
          expiry_date: '2024-09-20',
          storage_requirements: 'ambient',
          original_value_usd: 98.75,
          status: 'reserved',
          verification_image_url: 'https://example.com/verification5.jpg',
          created_at: '2024-01-14T09:00:00Z',
        },
        {
          id: '6',
          donor_id: '2',
          name: 'Salbutamol Inhaler 200mcg',
          ndc_code: '00093-0561-01',
          category: 'Respiratory',
          quantity: 75,
          unit: 'inhalers',
          batch_number: 'SB2024-006',
          expiry_date: '2024-12-01',
          storage_requirements: 'ambient',
          original_value_usd: 156.00,
          status: 'available',
          verification_image_url: 'https://example.com/verification6.jpg',
          created_at: '2024-01-15T09:00:00Z',
        }
      ];
    } else if (table === 'donation_requests') {
      mockData = [
        {
          id: '1',
          medication_id: '1',
          donor_id: '1',
          recipient_id: '3',
          quantity_requested: 50,
          status: 'delivered',
          tracking_number: 'TRK-2024-001',
          qr_manifest_code: 'QR-2024-001',
          tax_receipt_url: 'https://example.com/receipt1.pdf',
          created_at: '2024-01-20T10:00:00Z',
        },
        {
          id: '2',
          medication_id: '3',
          donor_id: '2',
          recipient_id: '4',
          quantity_requested: 100,
          status: 'shipped',
          tracking_number: 'TRK-2024-002',
          qr_manifest_code: 'QR-2024-002',
          created_at: '2024-01-22T10:00:00Z',
        },
        {
          id: '3',
          medication_id: '6',
          donor_id: '1',
          recipient_id: '3',
          quantity_requested: 25,
          status: 'approved',
          created_at: '2024-01-23T10:00:00Z',
        }
      ];
    } else if (table === 'impact_metrics') {
      mockData = [
        {
          id: '1',
          total_diverted_kg: 1250.5,
          financial_value_saved: 45678.90,
          treatments_facilitated: 342,
          co2_prevented_kg: 2345.67,
        },
        {
          id: '2',
          total_diverted_kg: 890.25,
          financial_value_saved: 32456.78,
          treatments_facilitated: 215,
          co2_prevented_kg: 1876.54,
        }
      ];
    }
    
    return {
      select: () => ({
        data: mockData,
        error: null
      }),
      insert: () => ({
        data: {},
        error: null
      }),
      update: () => ({
        data: {},
        error: null
      }),
      delete: () => ({
        data: null,
        error: null
      }),
      order: () => ({
        data: mockData,
        error: null
      }),
      eq: () => ({
        data: mockData,
        error: null
      }),
      ilike: () => ({
        data: mockData,
        error: null
      }),
      or: () => ({
        data: mockData,
        error: null
      })
    };
  }
};