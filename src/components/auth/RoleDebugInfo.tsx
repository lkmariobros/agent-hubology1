
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { roleUtils } from '@/context/auth/roleUtils';
import { ChevronDown, ChevronUp, Shield, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const RoleDebugInfo: React.FC = () => {
  const { user, roles, profile, isAdmin, activeRole } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Ensure this component only renders in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  if (!user) return null;
  
  // Log user role information to console
  if (user.email) {
    roleUtils.debugRoles(roles, user.email);
  }

  // Determine badge color based on admin status
  const badgeColorClasses = isAdmin 
    ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300"
    : "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300";

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      // Force refresh session
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
      toast.success("Session refreshed. Roles updated.");
    } catch (error) {
      console.error('Error refreshing session:', error);
      toast.error("Failed to refresh session");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div 
        className={`inline-flex items-center px-3 py-1 text-xs border rounded-lg cursor-pointer hover:opacity-80 shadow-sm ${badgeColorClasses}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isAdmin && <Shield className="h-3 w-3 mr-1" />}
        <span className="font-medium">Debug Info</span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3 ml-1" />
        ) : (
          <ChevronDown className="h-3 w-3 ml-1" />
        )}
      </div>
      
      {isExpanded && (
        <div className="absolute bottom-full right-0 z-10 mb-1 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md w-72">
          <h3 className="font-medium text-gray-800 dark:text-gray-300 mb-2">Debug Information (Dev Only)</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Roles:</strong> {roles.join(', ') || 'No roles assigned'}</p>
            <p><strong>Active Role:</strong> {activeRole}</p>
            <p><strong>Is Admin:</strong> <span className={isAdmin ? "text-green-600 dark:text-green-400 font-semibold" : ""}>{isAdmin ? 'Yes ✓' : 'No'}</span></p>
            <p><strong>Profile Tier:</strong> {profile?.tier || 'Not set'} {profile?.tier_name ? `(${profile.tier_name})` : ''}</p>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <p>Note: Admin access requires tier level 5 or higher</p>
          </div>
          <button 
            onClick={handleRefreshSession} 
            disabled={isRefreshing}
            className="mt-2 flex items-center justify-center w-full text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 py-1 rounded"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleDebugInfo;
