
import { useAuthContext } from '@/context/auth';
import type { AuthContextType } from '@/types/auth';
import { useSentry } from './useSentry';
import { isSpecialAdminEmail } from '@/context/auth/adminUtils';

/**
 * Enhanced useAuth hook with additional error tracking
 */
export function useAuth(): AuthContextType {
  const auth = useAuthContext();
  const { logError, setUser } = useSentry();
  
  // If there's an error in the auth context, log it to Sentry
  if (auth.error && !auth.loading) {
    logError(auth.error, { 
      source: 'AuthContext', 
      isAuthenticated: auth.isAuthenticated 
    });
  }
  
  // Set Sentry user context when authenticated
  if (auth.user?.id && !auth.loading) {
    setUser(auth.user.id, auth.user.email, auth.user.name);
  }
  
  return auth;
}

// The standalone useAuth hook for Clerk
export function useClerkAuth() {
  const clerkAuth = useAuthContext();
  const { user } = clerkAuth;
  
  // Create an enhanced auth object that has all the Clerk auth methods
  // plus additional methods needed by our application
  const hasRole = (roleName: string) => {
    // Special case for admin email using the utility function
    if (roleName === 'admin' && user?.email && isSpecialAdminEmail(user.email)) {
      return true;
    }
    
    // Check the user's roles
    if (user?.roles) {
      return Array.isArray(user.roles) && user.roles.includes(roleName);
    }
    
    return false;
  };
  
  return {
    ...clerkAuth,
    // Implement the has method that's expected by the components
    has: (params: { role: string }) => {
      return hasRole(params.role);
    },
    hasRole,
    // Additional properties our app expects
    isAdmin: hasRole('admin'),
    isAuthenticated: !!clerkAuth.session,
    loading: clerkAuth.loading,
    error: clerkAuth.error,
  };
}

// Export the type for use in components
export type { AuthContextType };

// Export the hook as default for backwards compatibility
export default useAuth;
