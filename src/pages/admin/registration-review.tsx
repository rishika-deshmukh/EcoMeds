import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/client';
import { Profile } from '@/lib/db/types';

export function RegistrationReview() {
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([]);
  const [approvedProfiles, setApprovedProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*, verified')
        .order('verified', { ascending: false });

      const pending = data.filter(profile => !profile.verified);
      const approved = data.filter(profile => profile.verified);

      setPendingProfiles(pending);
      setApprovedProfiles(approved);
    };

    fetchProfiles();
  }, []);

  const approveProfile = async (profileId: string) => {
    await supabase
      .from('profiles')
      .update({ verified: true })
      .eq('id', profileId);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Registration Review</h2>
      
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm font-medium">Pending Approval:</p>
          <p className="text-2xl font-bold">{pendingProfiles.length}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Approved Organizations:</p>
          <p className="text-2xl font-bold">{approvedProfiles.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-medium mb-2">Pending Organizations</h3>
          {pendingProfiles.map(profile => (
            <div key={profile.id} className="flex flex-col md:flex-row gap-4">
              <div>
                <h4 className="text-lg font-medium">{profile.organization_name}</h4>
                <p className="text-sm text-gray-600">{profile.role}</p>
              </div>
              <div>
                <button 
                  className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => approveProfile(profile.id)}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-medium mb-2">Approved Organizations</h3>
          {approvedProfiles.map(profile => (
            <div key={profile.id} className="flex flex-col md:flex-row gap-4">
              <div>
                <h4 className="text-lg font-medium">{profile.organization_name}</h4>
                <p className="text-sm text-gray-600">{profile.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium">License:</p>
                <p className="text-2xl font-bold">{profile.license_number || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}