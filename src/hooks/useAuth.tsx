
import { useClerkAuth } from "../providers/ClerkAuthProvider";
import { UserRole } from "@/types/auth";

export function useAuth() {
  const auth = useClerkAuth();
  
  // Enhanced auth interface to maintain compatibility with previous code
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
    // For code that expects an activeRole property
    activeRole: auth.activeRole
  };
}

export default useAuth;
