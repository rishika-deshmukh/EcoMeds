import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/client';
import { Profile } from '@/lib/db/types';

export function ComplianceCenter() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*, verified')
        .order('verified', { ascending: false });

      setProfiles(data);

      // Calculate verification statuses
      const statuses = data.reduce((acc, profile) => {
        acc[profile.id] = profile.verified;
        return acc;
      }, {} as { [key: string]: boolean });

      setVerificationStatus(statuses);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Compliance Center</h2>
      
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm font-medium">Total Organizations:</p>
          <p className="text-2xl font-bold">{profiles.length}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Verified Organizations:</p>
          <p className="text-2xl font-bold">{Object.values(verificationStatus).filter(status => status).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-medium">{profile.organization_name}</h3>
                <p className="text-sm text-gray-600">{profile.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium">License:</p>
                <p className="text-2xl font-bold">{profile.license_number || 'Pending'}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Verified:</p>
                <p className="text-2xl font-bold text-{verificationStatus[profile.id] ? 'primary' : 'gray-600'}">{profile.verified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact:</p>
                <p className="text-2xl font-bold">{profile.contact_email || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}