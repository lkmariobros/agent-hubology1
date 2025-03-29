
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { roleUtils } from '@/context/auth/roleUtils';
import { ChevronDown, ChevronUp } from 'lucide-react';

const RoleDebugInfo: React.FC = () => {
  const { user, roles, profile, isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="relative inline-block">
      <div 
        className="inline-flex items-center px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-yellow-800 dark:text-yellow-300 font-medium">Debug Info</span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3 ml-1 text-yellow-800 dark:text-yellow-300" />
        ) : (
          <ChevronDown className="h-3 w-3 ml-1 text-yellow-800 dark:text-yellow-300" />
        )}
      </div>
      
      {isExpanded && (
        <div className="absolute bottom-full right-0 z-10 mb-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-md w-72">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Debug Information (Dev Only)</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Roles:</strong> {roles.join(', ') || 'No roles assigned'}</p>
            <p><strong>Active Role:</strong> {user.activeRole}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            <p><strong>Profile Tier:</strong> {profile?.tier || 'Not set'}</p>
          </div>
          <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            <p>Note: Admin access requires tier level 5 or higher</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDebugInfo;
