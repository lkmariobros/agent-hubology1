import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { AuthContextType } from '@/types/auth';

/**
 * Compatibility hook that provides the same interface as the original useAuth hook
 * but uses Clerk for authentication
 */
export function useClerkCompatAuth(): AuthContextType {
  const clerkContext = useClerkAuth();
  const { getToken } = useClerkAuth();
  
  // Create a compatibility layer for the existing auth interface
  const compatAuth: AuthContextType = {
    user: clerkContext.user,
    profile: clerkContext.profile,
    session: null, // Clerk doesn't use Supabase sessions
    loading: clerkContext.loading,
    error: clerkContext.error,
    isAuthenticated: clerkContext.isAuthenticated,
    isAdmin: clerkContext.isAdmin,
    roles: clerkContext.roles,
    activeRole: clerkContext.activeRole,
    
    // Auth methods - these will need to be implemented with Clerk equivalents
    signIn: async (email: string, password: string) => {
      // This will be handled by Clerk's SignIn component
      throw new Error('Use Clerk SignIn component instead');
    },
    
    signUp: async (email: string, password: string) => {
      // This will be handled by Clerk's SignUp component
      throw new Error('Use Clerk SignUp component instead');
    },
    
    signOut: clerkContext.signOut,
    
    resetPassword: async (email: string) => {
      // This will be handled by Clerk's components
      throw new Error('Use Clerk components for password reset');
    },
    
    // Role management
    switchRole: clerkContext.switchRole,
    hasRole: clerkContext.hasRole,
  };
  
  return compatAuth;
}

export default useClerkCompatAuth;
