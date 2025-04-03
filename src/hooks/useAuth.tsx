
import { useAuth as useClerkAuth } from "../providers/ClerkAuthProvider";
import { UserRole } from "@/types/auth";

export function useAuth() {
  const auth = useClerkAuth();
  
  // Enhanced auth interface to maintain compatibility with previous code
  return {
    ...auth,
    // For backward compatibility with code that expects has method with params object
    has: (params: { role: string }) => auth.hasRole(params.role),
    // Explicitly exposing standard properties for clarity
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.isAdmin,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    // For code that expects an activeRole property
    activeRole: auth.isAdmin ? 'admin' : 'agent' as UserRole
  };
}

export default useAuth;
