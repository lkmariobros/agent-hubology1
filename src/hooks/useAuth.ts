import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { AuthContextType } from '@/types/auth';

/**
 * Compatibility hook that provides the same interface as the original useAuth hook
 * but uses Clerk for authentication
 */
export function useAuth(): AuthContextType {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user } = useUser();

  // Create a compatibility layer for the existing auth interface
  // Create a user object that matches the UserProfile interface
  const userProfile = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    roles: ['agent' as const],
    activeRole: 'agent' as const
  } : null;

  const compatAuth: AuthContextType = {
    user: userProfile,
    profile: null, // We don't have profiles yet
    session: null, // Clerk doesn't use Supabase sessions
    loading: !isLoaded,
    error: null,
    isAuthenticated: !!isSignedIn,
    isAdmin: false, // We don't have roles yet
    roles: ['agent'], // Default role
    activeRole: 'agent', // Default role

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
      console.log('Role switching not implemented yet');
    },
    hasRole: (role) => {
      return role === 'agent'; // Default to agent role for now
    }
  };

  return compatAuth;
}

export default useAuth;
