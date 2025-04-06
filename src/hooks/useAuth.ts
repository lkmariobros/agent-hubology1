
import { useAuthContext } from '@/context/auth';
import type { AuthContextType } from '@/types/auth';

/**
 * Enhanced useAuth hook with additional error tracking
 * This is the main authentication hook that should be used throughout the application
 */
export function useAuth(): AuthContextType {
  const auth = useAuthContext();
  return auth;
}

// Re-export the type for use in components
export type { AuthContextType };

// Export the hook as default for backwards compatibility
export default useAuth;
