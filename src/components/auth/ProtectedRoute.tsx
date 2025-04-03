
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingIndicator from '../ui/loading-indicator';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { AUTH_CONFIG } from '@/context/auth/authConfig';
import { isSpecialAdminEmail } from '@/context/auth/adminUtils';

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
  const auth = useAuth();
  const { isLoaded, userId, isSignedIn } = auth;
  const location = useLocation();
  const isAuthenticated = isSignedIn;
  
  // Use the has method from our enhanced auth hook
  const isAdmin = auth.isAdmin;
  
  useEffect(() => {
    console.log("[ProtectedRoute] Auth state:", { 
      isAuthenticated, 
      isAdmin, 
      requireAdmin,
      isLoaded,
      location: location.pathname
    });
    
    // Set timeout to detect prolonged loading states
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.warn('[ProtectedRoute] Auth verification timed out');
        setTimeoutOccurred(true);
      }
    }, AUTH_CONFIG.ROUTE_AUTH_TIMEOUT);
    
    return () => clearTimeout(timeoutId);
  }, [isLoaded, isAuthenticated, isAdmin, requireAdmin, location.pathname]);

  // If we hit a timeout and still loading, show error UI
  if (timeoutOccurred) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="p-6 rounded-lg shadow-lg border border-red-200 bg-red-50 dark:bg-red-900/20 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Authentication Timeout</h2>
          <p className="mb-4 text-red-600 dark:text-red-300">
            We're having trouble verifying your authentication.
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

  // Check if user is special admin
  const isSpecialAdmin = auth.user?.email ? isSpecialAdminEmail(auth.user.email) : false;

  // Check for admin requirement, but make exception for special admin user
  if (requireAdmin && !isAdmin && !isSpecialAdmin) {
    console.log('[ProtectedRoute] Admin access required but user is not admin, redirecting to dashboard');
    toast.error("You need admin privileges to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  // Check for specific role requirements (but make exception for special admin user)
  if (requireRoles.length > 0) {
    let hasRequiredRole = false;
    for (const role of requireRoles) {
      if (auth.hasRole(role)) {
        hasRequiredRole = true;
        break;
      }
    }
    
    if (!hasRequiredRole && !isSpecialAdmin) {
      console.log('[ProtectedRoute] Required roles not found:', requireRoles);
      toast.error(`You need ${requireRoles.join(' or ')} privileges to access this page`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
