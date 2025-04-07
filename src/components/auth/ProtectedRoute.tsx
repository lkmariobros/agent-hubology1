
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingIndicator from '../ui/loading-indicator';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { isSpecialAdmin } from '@/utils/adminAccess';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireRoles = [],
  redirectTo = '/login' 
}) => {
  const { user, loading, isAuthenticated, isAdmin, hasRole, error, activeRole } = useAuth();
  const location = useLocation();
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  
  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    console.log("[ProtectedRoute] Current user role:", activeRole);
    console.log("[ProtectedRoute] Is admin:", isAdmin, "RequireAdmin:", requireAdmin);
    console.log("[ProtectedRoute] Current location:", location.pathname);
    console.log("[ProtectedRoute] User email:", user?.email);
    
    // Set timeout to detect prolonged loading states
    if (loading && !timeoutRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        if (isMounted.current) {
          console.warn('[ProtectedRoute] Auth verification timed out');
          setTimeoutOccurred(true);
          toast.error('Authentication verification timed out.');
        }
      }, 30000); // 30 seconds timeout
    }
    
    // Clear timeout when loading completes
    if (!loading && timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [loading, activeRole, isAdmin, requireAdmin, location.pathname, user?.email]);

  // Handle timeout or error cases first
  if (timeoutOccurred && loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="p-6 rounded-lg shadow-lg border border-red-200 bg-red-50 dark:bg-red-900/20 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Authentication Timeout</h2>
          <p className="mb-4 text-red-600 dark:text-red-300">
            We're having trouble verifying your authentication. This could be due to network issues or server problems.
          </p>
          <div className="flex space-x-3">
            <Button 
              variant="destructive" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="p-6 rounded-lg shadow-lg border border-red-200 bg-red-50 dark:bg-red-900/20 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Authentication Error</h2>
          <p className="mb-4 text-red-600 dark:text-red-300">{error.message}</p>
          <div className="flex space-x-3">
            <Button 
              variant="destructive" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <LoadingIndicator 
          fullScreen 
          size="lg" 
          text="Verifying authentication..." 
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Special admin handling
  const isSpecialAdminUser = isSpecialAdmin(user.email);
  console.log('[ProtectedRoute] Is special admin user:', isSpecialAdminUser);

  // If we're on an admin route but not in admin role (and not a special admin)
  if (location.pathname.startsWith('/admin') && activeRole !== 'admin' && !isSpecialAdminUser) {
    console.log('[ProtectedRoute] Non-admin user trying to access admin route');
    toast.error("Please switch to admin role to access this section");
    return <Navigate to="/" replace />;
  }

  // If admin route is required but user is not admin (and not a special admin)
  if (requireAdmin && !isAdmin && !isSpecialAdminUser) {
    console.log('[ProtectedRoute] Admin access required but user is not admin');
    toast.error("You need admin privileges to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  // If we're on a regular route but in admin role (except for special admin)
  if (!location.pathname.startsWith('/admin') && activeRole === 'admin' && !isSpecialAdminUser) {
    console.log('[ProtectedRoute] Admin trying to access agent route');
    toast.error("Please switch to agent role to access this section");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check for specific role requirements (except for special admin)
  if (requireRoles.length > 0 && !requireRoles.some(role => hasRole(role)) && !isSpecialAdminUser) {
    console.log('[ProtectedRoute] Required roles not found:', requireRoles);
    toast.error(`You need ${requireRoles.join(' or ')} privileges to access this page`);
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
