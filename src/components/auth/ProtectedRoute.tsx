
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingIndicator from '../ui/loading-indicator';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { Button } from '../ui/button';

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
  redirectTo = '/index' 
}) => {
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  
  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);
  const timeoutRef = useRef<number | null>(null);
  
  const auth = useAuth();
  const { isLoaded, userId, isSignedIn } = auth;
  const location = useLocation();
  const isAuthenticated = isSignedIn;
  const isAdmin = auth.has({ role: "admin" });
  
  useEffect(() => {
    console.log("[ProtectedRoute] Is authenticated:", isAuthenticated);
    console.log("[ProtectedRoute] Is admin:", isAdmin, "RequireAdmin:", requireAdmin);
    console.log("[ProtectedRoute] Current location:", location.pathname);
    
    // Set timeout to detect prolonged loading states
    if (!isLoaded && !timeoutRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        if (isMounted.current) {
          console.warn('[ProtectedRoute] Auth verification timed out');
          setTimeoutOccurred(true);
          toast.error('Authentication verification timed out.');
        }
      }, 30000); // 30 seconds timeout
    }
    
    // Clear timeout when loading completes
    if (isLoaded && timeoutRef.current) {
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
  }, [isLoaded, isAuthenticated, isAdmin, requireAdmin, location.pathname]);

  // If we hit a timeout and still loading, show error UI
  if (timeoutOccurred && !isLoaded) {
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
                window.location.href = '/index';
              }}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading indicator while checking authentication
  if (!isLoaded) {
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
  if (!isAuthenticated || !userId) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Special case for special admin email
  const isSpecialAdminUser = false; // This would come from the user's email in a real implementation

  // Check for admin requirement, but make exception for special admin user
  if (requireAdmin && !isAdmin && !isSpecialAdminUser) {
    console.log('[ProtectedRoute] Admin access required but user is not admin, redirecting to dashboard');
    toast.error("You need admin privileges to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  // Check for specific role requirements (but make exception for special admin user)
  if (requireRoles.length > 0) {
    let hasRequiredRole = false;
    for (const role of requireRoles) {
      if (auth.has({ role })) {
        hasRequiredRole = true;
        break;
      }
    }
    
    if (!hasRequiredRole && !isSpecialAdminUser) {
      console.log('[ProtectedRoute] Required roles not found:', requireRoles);
      toast.error(`You need ${requireRoles.join(' or ')} privileges to access this page`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
