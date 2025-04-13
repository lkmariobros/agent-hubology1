import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { AuthContextType, UserRole } from '@/types/auth';
import { DEV_MODE, BYPASS_AUTH, DEV_USER } from '@/utils/devMode';

/**
 * This hook provides authentication functionality throughout the application.
 * It now uses Clerk for all authentication, with the Supabase implementation removed.
 *
 * In development mode with BYPASS_AUTH enabled, it returns mock auth data.
 * In production, it forwards all authentication requests to the Clerk auth provider.
 *
 * @returns AuthContextType - The auth context containing user info, roles, and auth state
 */
export function useAuth(): AuthContextType {
  // In development mode with auth bypass, return mock auth data
  if (DEV_MODE && BYPASS_AUTH) {
    // Create a mock auth context for development
    const mockAuthContext: AuthContextType = {
      user: DEV_USER,
      profile: {
        id: DEV_USER.id,
        email: DEV_USER.email,
        first_name: DEV_USER.firstName,
        last_name: DEV_USER.lastName,
        role: DEV_USER.role as UserRole,
        preferences: {
          darkMode: true,
          emailNotifications: true,
          preferredPortal: 'admin'
        },
        agent_details: null
      },
      session: { user: DEV_USER },
      loading: false,
      error: null,
      isAuthenticated: true,
      isAdmin: true,
      roles: DEV_USER.roles as UserRole[],
      activeRole: DEV_USER.activeRole as UserRole,
      signIn: async () => { console.log('[DEV] Mock signIn called'); },
      signUp: async () => { console.log('[DEV] Mock signUp called'); },
      signOut: async () => { console.log('[DEV] Mock signOut called'); },
      resetPassword: async () => { console.log('[DEV] Mock resetPassword called'); },
      switchRole: (role: UserRole) => { console.log('[DEV] Mock switchRole called with:', role); },
      hasRole: (role: UserRole) => DEV_USER.roles.includes(role),
      createUserProfile: async () => { console.log('[DEV] Mock createUserProfile called'); },
      assignRole: async () => { console.log('[DEV] Mock assignRole called'); return true; },
      removeRole: async () => { console.log('[DEV] Mock removeRole called'); return true; }
    };

    return mockAuthContext;
  }

  // Use the ClerkAuth provider directly for production
  return useClerkAuth();
}

export default useAuth;
