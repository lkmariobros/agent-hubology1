import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LoadingIndicator from '../ui/loading-indicator';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { DEV_MODE, BYPASS_AUTH, devUtils, DEV_USER } from '@/utils/devMode';

interface ClerkProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireRoles?: UserRole[];
  redirectTo?: string;
}

const ClerkProtectedRoute: React.FC<ClerkProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireRoles = [],
  redirectTo = '/sign-in'
}) => {
  const { user, profile, loading, isAuthenticated, isAdmin, hasRole, activeRole } = useClerkAuth();
  const location = useLocation();
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("[ClerkProtectedRoute] Auth state:", {
      loading,
      isAuthenticated,
      user: user?.id,
      profile: profile ? 'exists' : 'null',
      activeRole,
      isAdmin,
      requireAdmin,
      location: location.pathname
    });

    // Set timeout to detect prolonged loading states
    if (loading && !timeoutRef.current) {
      console.log('[ClerkProtectedRoute] Setting timeout for loading state');
      timeoutRef.current = window.setTimeout(() => {
        if (isMounted.current) {
          console.warn('[ClerkProtectedRoute] Auth verification timed out');
          setTimeoutOccurred(true);
          toast.error('Authentication verification timed out.');
        }
      }, 10000); // 10 seconds timeout
    }

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, activeRole, isAdmin, requireAdmin, location.pathname, isAuthenticated, user, profile]);

  // Handle timeout case
  if (timeoutOccurred) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center space-y-4 p-6 max-w-md">
          <h2 className="text-2xl font-bold">Authentication Timeout</h2>
          <p className="text-muted-foreground">
            Verifying your authentication is taking longer than expected. This could be due to network issues.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
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
          text={`Verifying authentication... ${isAuthenticated ? 'Authenticated' : 'Not authenticated'} ${profile ? 'Profile exists' : 'No profile'}`}
        />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>User ID: {user?.id || 'Not available'}</p>
          <p>Auth state: {isAuthenticated ? 'Signed in' : 'Not signed in'}</p>
          <p>Profile: {profile ? 'Found' : 'Not found'}</p>
          <p>Loading state: {loading ? 'Loading' : 'Not loading'}</p>
          <p>Role: {activeRole}</p>
          <button
            onClick={() => window.location.href = '/profile/setup'}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Profile Setup
          </button>
        </div>
      </div>
    );
  }

  // In development mode with auth bypass, skip authentication checks
  if (DEV_MODE && BYPASS_AUTH) {
    devUtils.log(`Development mode - bypassing auth for route: ${location.pathname}`);

    // If we're on an admin route but dev user is not in admin role
    if (location.pathname.startsWith('/admin') && DEV_USER.activeRole !== 'admin') {
      devUtils.log('Switching dev user to admin role for admin route');
      // In dev mode, we'll just allow access to admin routes
    }

    // All checks bypassed in dev mode, render the children
    return <>{children}</>;
  }

  // Normal authentication flow for production
  return (
    <SignedIn>
      {() => {

        // If we're on an admin route but not in admin role
        if (location.pathname.startsWith('/admin') && activeRole !== 'admin') {
          console.log('[ClerkProtectedRoute] Non-admin user trying to access admin route');
          toast.error("Please switch to admin role to access this section");
          return <Navigate to="/dashboard" replace />;
        }

        // If admin route is required but user is not admin
        if (requireAdmin && !isAdmin) {
          console.log('[ClerkProtectedRoute] Admin access required but user is not admin');
          toast.error("You need admin privileges to access this page");
          return <Navigate to="/dashboard" replace />;
        }

        // If we're on a regular route but in admin role
        if (!location.pathname.startsWith('/admin') && activeRole === 'admin') {
          console.log('[ClerkProtectedRoute] Admin trying to access agent route');
          toast.error("Please switch to agent role to access this section");
          return <Navigate to="/admin/dashboard" replace />;
        }

        // Check for specific role requirements
        if (requireRoles.length > 0 && !requireRoles.some(role => hasRole(role))) {
          console.log('[ClerkProtectedRoute] Required roles not found:', requireRoles);
          toast.error(`You need ${requireRoles.join(' or ')} privileges to access this page`);
          return <Navigate to="/dashboard" replace />;
        }

        // All checks passed, render the children
        return <>{children}</>;
      }}
    </SignedIn>
  );
};

export default ClerkProtectedRoute;
