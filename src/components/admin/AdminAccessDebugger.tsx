
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isSpecialAdmin } from '@/utils/adminAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/**
 * Debug component to help diagnose admin access issues
 * Only visible in development environment
 */
const AdminAccessDebugger = () => {
  const { user, roles, isAdmin, activeRole } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }
  
  const isSpecialAdminUser = user?.email ? isSpecialAdmin(user.email) : false;
  
  useEffect(() => {
    // Log diagnostics for admin route access
    if (location.pathname.startsWith('/admin')) {
      console.log('[AdminAccess] Current path:', location.pathname);
      console.log('[AdminAccess] User:', user?.email);
      console.log('[AdminAccess] Roles:', roles);
      console.log('[AdminAccess] Active role:', activeRole);
      console.log('[AdminAccess] Is admin?', isAdmin);
      console.log('[AdminAccess] Is special admin?', isSpecialAdminUser);
    }
  }, [location.pathname, isAdmin, activeRole, roles, user, isSpecialAdminUser]);
  
  if (!location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={() => setExpanded(!expanded)}
        variant="destructive"
        size="sm"
        className="flex items-center gap-1"
      >
        <AlertCircle className="h-4 w-4" />
        {expanded ? "Hide Admin Debug" : "Admin Debug"}
      </Button>
      
      {expanded && (
        <Card className="mt-2 w-[350px] shadow-lg border-red-300 dark:border-red-700 bg-white dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              Admin Access Debug
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6" 
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs space-y-1">
            <div><strong>Email:</strong> {user?.email || 'Not signed in'}</div>
            <div><strong>Roles:</strong> {roles.join(', ') || 'None'}</div>
            <div><strong>Active role:</strong> {activeRole}</div>
            <div><strong>Is admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</div>
            <div><strong>Is special admin:</strong> {isSpecialAdminUser ? '✅ Yes' : '❌ No'}</div>
            <div><strong>Current path:</strong> {location.pathname}</div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <strong>Diagnostics:</strong>
              <ul className="list-disc pl-4 mt-1">
                {!isAdmin && !isSpecialAdminUser && <li className="text-red-500">No admin access detected!</li>}
                {activeRole !== 'admin' && <li className="text-amber-500">Active role is not 'admin'</li>}
                {isSpecialAdminUser && !isAdmin && <li className="text-green-500">Special admin override active</li>}
                {isAdmin && <li className="text-green-500">Regular admin access granted</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAccessDebugger;
