import { useClerkAuth } from './useClerkAuth';
import { AuthContextType } from '@/types/auth';

/**
 * Compatibility hook that provides the same interface as the original useAuth hook
 * but uses Clerk for authentication
 */
export function useAuth(): AuthContextType & { getToken: () => Promise<string | null>, userId: string | null } {
  const { isLoaded, isSignedIn, user: userProfile, isAdmin, getToken } = useClerkAuth();

  const compatAuth: AuthContextType = {
    user: userProfile,
    profile: null, // We don't have profiles yet
    session: null, // Clerk doesn't use Supabase sessions
    loading: !isLoaded,
    error: null,
    isAuthenticated: !!isSignedIn,
    isAdmin: isAdmin, // Use the admin status from Clerk
    roles: userProfile?.roles || ['agent'], // Use roles from userProfile
    activeRole: userProfile?.activeRole || 'agent', // Use activeRole from userProfile

    // Auth methods - these will need to be implemented with Clerk equivalents
    signIn: async (email: string, password: string) => {
      // This will be handled by Clerk's SignIn component
      throw new Error('Use Clerk SignIn component instead');
    },

    signUp: async (email: string, password: string) => {
      // This will be handled by Clerk's SignUp component
      throw new Error('Use Clerk SignUp component instead');
    },

    signOut: async () => {
      // This will be handled by Clerk's SignOutButton component
      window.location.href = '/sign-in';
    },

    resetPassword: async (email: string) => {
      // This will be handled by Clerk's components
      throw new Error('Use Clerk components for password reset');
    },

    // Role management
    switchRole: (role) => {
      if (role === 'admin' && !isAdmin) {
        console.log('User does not have admin role');
        return;
      }
      // In a real implementation, this would update the user's active role
      console.log(`Switching to role: ${role}`);
      window.location.href = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    },
    hasRole: (role) => {
      if (role === 'admin') return isAdmin;
      return userProfile?.roles?.includes(role) || false;
    }
  };

  return {
    ...compatAuth,
    getToken,
    userId: userProfile?.id || null
  };
}

export default useAuth;
