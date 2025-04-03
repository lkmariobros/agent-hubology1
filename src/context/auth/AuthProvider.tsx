
import React, { createContext, ReactNode, useContext } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { UserRole } from '@/types/auth';

// Define the shape of our auth context
interface AuthContextProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId: string | null;
  user: any | null;
  loading: boolean;
  error: Error | null;
  hasRole: (role: string) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isAdmin: false,
  userId: null,
  user: null,
  loading: true,
  error: null,
  hasRole: () => false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoaded, userId, isSignedIn } = useClerkAuth();
  const { user } = useUser();

  // Check if email is admin email (temporary until proper roles are set up in Clerk)
  const isAdminEmail = (email?: string): boolean => {
    if (!email) return false;
    const adminEmails = ['josephkwantum@gmail.com', 'admin@example.com'];
    return adminEmails.includes(email.toLowerCase());
  };

  // Check if user has admin role based on email or metadata
  const isAdmin = (): boolean => {
    if (!user) return false;

    // Check primary email
    if (user.primaryEmailAddress && isAdminEmail(user.primaryEmailAddress.emailAddress)) {
      return true;
    }

    // Check user metadata for roles
    if (user.publicMetadata?.roles) {
      const roles = user.publicMetadata.roles as string[];
      return Array.isArray(roles) && roles.includes('admin');
    }

    return false;
  };

  // Function to check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    if (roleName === 'admin') {
      return isAdmin();
    }

    if (!user) return false;

    // Check user metadata for roles
    if (user.publicMetadata?.roles) {
      const roles = user.publicMetadata.roles as string[];
      return Array.isArray(roles) && roles.includes(roleName);
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!isSignedIn,
        isAdmin: isAdmin(),
        userId: userId || null,
        user: user || null,
        loading: !isLoaded,
        error: null,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
