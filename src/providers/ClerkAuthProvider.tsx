
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk, useUser, useOrganization } from '@clerk/clerk-react';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

interface ClerkAuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  session: any | null;
  profile: any | null;
  roles: UserRole[];
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean | Promise<boolean>;
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(ClerkAuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within a ClerkAuthProvider');
  }
  
  return context;
};

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clerk = useClerk();
  // Access clerk properties safely after checking loaded state
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<UserRole[]>(['agent']);
  const [activeRole, setActiveRole] = useState<UserRole>('agent');
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);

  // Safe access to clerk properties after checking loaded state
  const userId = clerk.user?.id;
  const sessionId = clerk.session?.id;
  const isClerkLoaded = clerk.loaded;

  // Determine if user is an admin based on Clerk roles
  const isAdmin = clerkUser?.publicMetadata?.isAdmin === true || 
    // Fix: Safely check organization membership role
    (organization?.membership as any)?.role === 'admin' ||
    clerkUser?.emailAddresses.some(email => 
      email.emailAddress === 'josephkwantum@gmail.com'
    );
  
  // Determine authentication status
  const isAuthenticated = !!userId;

  useEffect(() => {
    // Wait for Clerk to initialize
    if (!isClerkLoaded || !isUserLoaded) {
      return;
    }
    
    // If no user is authenticated, set loading to false
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Build role array from the organization membership or custom metadata
      const userRoles: UserRole[] = ['agent', 'viewer']; // Default basic roles
      
      if (clerkUser?.publicMetadata?.roles) {
        const metadataRoles = clerkUser.publicMetadata.roles as UserRole[];
        metadataRoles.forEach(role => {
          if (!userRoles.includes(role)) {
            userRoles.push(role);
          }
        });
      }
      
      // Special handling for josephkwantum@gmail.com
      const isSpecialEmail = clerkUser?.emailAddresses.some(
        email => email.emailAddress === 'josephkwantum@gmail.com'
      );
      
      if (isSpecialEmail && !userRoles.includes('admin')) {
        userRoles.push('admin');
      }
      
      // Set active role preference (prefer admin if available)
      const preferredRole = userRoles.includes('admin') ? 'admin' : userRoles[0];
      
      setRoles(userRoles);
      setActiveRole(preferredRole);

      // Create a profile object that matches the shape of the Supabase profile
      const userProfile = {
        id: userId,
        email: clerkUser?.primaryEmailAddress?.emailAddress || '',
        name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || 
            clerkUser?.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
        roles: userRoles,
        activeRole: preferredRole
      };
      
      setProfile(userProfile);
      setSession({ id: sessionId });
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to load user profile'));
    } finally {
      setLoading(false);
    }
  }, [isClerkLoaded, isUserLoaded, isOrgLoaded, userId, sessionId, clerkUser, organization]);

  // Auth methods
  const signOut = async () => {
    setLoading(true);
    try {
      await clerk.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err : new Error('Sign out failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Real Clerk signIn method
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting to sign in with Clerk:', email);
      
      // Use correct Clerk method
      await clerk.load().then(() => {
        return clerk.client.signIn.create({
          identifier: email,
          password
        });
      });
      
      toast.success('Signed in successfully!');
      
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err : new Error('Sign in failed'));
      toast.error(`Sign in failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use correct Clerk method
      const result = await clerk.load().then(() => {
        return clerk.client.signUp.create({
          emailAddress: email,
          password,
        });
      });
      
      const { createdSessionId, createdUserId } = result;
      
      if (createdSessionId && createdUserId) {
        toast.success('Account created successfully!');
      } else {
        // This shouldn't normally happen with Clerk, but handle it just in case
        await clerk.load().then(() => {
          return clerk.client.signIn.create({
            identifier: email,
            password
          });
        });
        toast.success('Account created and signed in!');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err : new Error('Sign up failed'));
      toast.error(`Sign up failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use correct Clerk method
      await clerk.load().then(() => {
        return clerk.client.signIn.create({
          strategy: "reset_password_email_code",
          identifier: email
        });
      });
      toast.success('Password reset instructions sent to your email');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err instanceof Error ? err : new Error('Password reset failed'));
      toast.error(`Password reset failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Role management
  const switchRole = (role: UserRole) => {
    if (roles.includes(role) || 
        (role === 'admin' && clerkUser?.emailAddresses.some(
          email => email.emailAddress === 'josephkwantum@gmail.com'
        ))) {
      setActiveRole(role);
      toast.success(`Switched to ${role === 'admin' ? 'Admin' : 'Agent'} Portal...`);
      
      // Hard redirect to correct portal with full page reload
      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 100);
    } else {
      toast.error(`You do not have the ${role} role`);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    // Special case for admin role and josephkwantum@gmail.com
    if (role === 'admin' && clerkUser?.emailAddresses.some(
      email => email.emailAddress === 'josephkwantum@gmail.com'
    )) {
      return true;
    }
    
    return roles.includes(role);
  };

  // Create a user object that matches the shape expected by the app
  const user = userId ? {
    id: userId,
    email: clerkUser?.primaryEmailAddress?.emailAddress || '',
    name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || 
          clerkUser?.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
    roles,
    activeRole,
    // Add Clerk-specific properties for RoleDebugInfo component
    primaryEmailAddress: clerkUser?.primaryEmailAddress,
    publicMetadata: clerkUser?.publicMetadata
  } : null;

  return (
    <ClerkAuthContext.Provider value={{
      user,
      loading,
      error,
      signOut,
      signIn,
      signUp,
      resetPassword,
      isAdmin,
      isAuthenticated,
      session,
      profile,
      roles,
      activeRole,
      switchRole,
      hasRole
    }}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export default ClerkAuthProvider;
