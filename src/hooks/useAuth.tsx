
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import type { UserRole } from '@/types/auth';

export function useAuth() {
  const clerkAuth = useClerkAuth();
  const { user } = useUser();
  
  // Create an enhanced auth object that has all the Clerk auth methods
  // plus additional methods needed by our application
  const hasRole = (roleName: string) => {
    // Check the user's public metadata for roles
    if (user?.publicMetadata?.roles) {
      const roles = user.publicMetadata.roles as string[];
      return Array.isArray(roles) && roles.includes(roleName);
    }
    
    // Check if there's an organization role that matches
    if (clerkAuth.orgRole) {
      return clerkAuth.orgRole === roleName;
    }
    
    // Special case for admin email
    if (roleName === 'admin' && user?.emailAddresses) {
      return user.emailAddresses.some(
        email => email.emailAddress === 'josephkwantum@gmail.com'
      );
    }
    
    return false;
  };
  
  return {
    ...clerkAuth,
    // Implement the has method that's expected by the components
    has: (params: { role: string }) => {
      return hasRole(params.role);
    },
    hasRole: (role: UserRole) => {
      return hasRole(role);
    },
    // Additional properties our app expects
    isAdmin: hasRole('admin'),
    isAuthenticated: !!clerkAuth.userId,
    user: user || null,
  };
}

export default useAuth;
