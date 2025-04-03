
import { useClerkAuth } from "@/providers/ClerkAuthProvider";
import type { AuthContextType, UserRole } from "@/types/auth";

/**
 * Enhanced useAuth hook that directly uses ClerkAuthProvider
 */
export function useAuth(): AuthContextType {
  const auth = useClerkAuth();
  
  return {
    ...auth,
    // For backward compatibility with code that expects has method with params object
    has: (params: { role: string }) => auth.hasRole(params.role as UserRole),
    // Explicitly exposing standard properties for clarity
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.isAdmin,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
  };
}

// Export the hook as default for backwards compatibility
export default useAuth;
