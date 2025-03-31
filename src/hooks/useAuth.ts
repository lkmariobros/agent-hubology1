
import { useAuthContext } from '@/context/auth';
import type { AuthContextType } from '@/types/auth';
import { useSentry } from './useSentry';

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
    setUser(auth.user.id, auth.user.email, auth.user.full_name);
  }
  
  return auth;
}

// Export the type for use in components
export type { AuthContextType };

// Export the hook as default for backwards compatibility
export default useAuth;
