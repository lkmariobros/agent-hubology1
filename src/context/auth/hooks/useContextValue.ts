
import { toast } from 'sonner';
import { AuthState } from '../types';
import { UserRole } from '@/types/auth';

/**
 * Creates the auth context value based on current state and methods
 */
export function useContextValue(
  state: AuthState,
  authMethods: {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    switchRole: (role: UserRole) => void;
    hasRole: (role: UserRole) => boolean | Promise<boolean>;
  }
) {
  if (state.loading) {
    return {
      user: null,
      profile: null,
      session: null,
      loading: true,
      error: state.error,
      isAuthenticated: false,
      isAdmin: false,
      roles: [],
      activeRole: 'agent' as UserRole,
      signIn: async () => {
        toast.error('Authentication system is still initializing. Please try again.');
        throw new Error('Auth system initializing');
      },
      signUp: async () => {
        toast.error('Authentication system is still initializing. Please try again.');
        throw new Error('Auth system initializing');
      },
      signOut: async () => {
        toast.error('Authentication system is still initializing. Please try again.');
        throw new Error('Auth system initializing');
      },
      resetPassword: async () => {
        toast.error('Authentication system is still initializing. Please try again.');
        throw new Error('Auth system initializing');
      },
      switchRole: () => {
        toast.error('Authentication system is still initializing. Please try again.');
      },
      hasRole: () => false,
    };
  }
  
  return {
    user: state.user,
    profile: state.profile,
    session: state.session,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.session,
    isAdmin: state.roles.includes('admin'),
    roles: state.roles,
    activeRole: state.activeRole,
    ...authMethods
  };
}
