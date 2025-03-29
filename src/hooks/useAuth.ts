
import { useAuthContext } from '@/context/auth/AuthContext';
import type { AuthContextType } from '@/types/auth';

/**
 * Primary hook for accessing authentication context
 */
export function useAuth(): AuthContextType {
  return useAuthContext();
}

// Export the type for use in components
export type { AuthContextType };

// Export the hook as default for backwards compatibility
export default useAuth;
