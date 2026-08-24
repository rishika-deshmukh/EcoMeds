import { useState } from 'react';
import { useRouter } from 'react-router-dom';

export function RoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<string>('donor');
  const router = useRouter();

  const roles = ['donor', 'recipient', 'admin'];

  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
    router.push(`/${role}`);
  };

  return (
    <div className="fixed top-0 right-0 p-4">
      <select 
        className="bg-white rounded-md shadow-md border border-gray-300 px-4 py-2"
        value={currentRole}
        onChange={(e) => handleRoleChange(e.target.value)}
      >
        {roles.map(role => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}