
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import type { UserRole } from '@/types/auth';

export function useAuth() {
  const clerkAuth = useClerkAuth();
  const { user } = useUser();
  
  // Create an enhanced auth object that has all the Clerk auth methods
  // plus additional methods needed by our application
  return {
    ...clerkAuth,
    isAdmin: clerkAuth.has?.({ role: 'admin' }) || false,
    // Ensure has method exists and works correctly
    has: (role: { role: string }) => {
      return clerkAuth.has?.(role) || false;
    },
    hasRole: (role: UserRole) => {
      return clerkAuth.has?.({ role }) || false;
    },
    // Additional properties our app expects
    isAuthenticated: !!clerkAuth.userId,
    user: user || null,
  };
}

export default useAuth;
