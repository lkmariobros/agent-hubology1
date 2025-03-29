
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { roleUtils } from '@/context/auth/roleUtils';

const RoleDebugInfo: React.FC = () => {
  const { user, roles, profile, isAdmin } = useAuth();

  // Ensure this component only renders in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  if (!user) return null;
  
  // Log user role information to console
  if (user.email) {
    roleUtils.debugRoles(roles, user.email);
  }

  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mt-4">
      <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Debug Information (Dev Only)</h3>
      <div className="space-y-1 text-sm">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Roles:</strong> {roles.join(', ') || 'No roles assigned'}</p>
        <p><strong>Active Role:</strong> {user.activeRole}</p>
        <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Profile Tier:</strong> {profile?.tier || 'Not set'}</p>
      </div>
      <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
        <p>Note: Admin access requires tier level 5 or higher in agent_profiles</p>
      </div>
    </div>
  );
};

export default RoleDebugInfo;
