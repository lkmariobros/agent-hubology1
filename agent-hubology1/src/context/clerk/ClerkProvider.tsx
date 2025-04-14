import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ClerkProvider as ClerkReactProvider,
  useAuth as useClerkAuthOriginal,
  useUser as useClerkUser,
  SignedIn,
  SignedOut
} from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

// Define the shape of our auth context
interface ClerkAuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roles: UserRole[];
  activeRole: UserRole;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  createUserProfile: (role?: UserRole) => Promise<void>;
}

// Create the context
const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

// Create a hook to use the auth context
export const useClerkAuthContext = () => {
  const context = useContext(ClerkAuthContext);
  if (context === undefined) {
    throw new Error('useClerkAuthContext must be used within a ClerkAuthProvider');
  }
  return context;
};

// Props for the ClerkAuthProvider component
interface ClerkAuthProviderProps {
  children: React.ReactNode;
  publishableKey: string;
}

// The main provider component
export const ClerkAuthProvider: React.FC<ClerkAuthProviderProps> = ({
  children,
  publishableKey
}) => {
  return (
    <ClerkReactProvider publishableKey={publishableKey}>
      <ClerkAuthContextProvider>
        {children}
      </ClerkAuthContextProvider>
    </ClerkReactProvider>
  );
};

// The inner provider that handles the auth logic
const ClerkAuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isClerkLoaded, isSignedIn, getToken } = useClerkAuthOriginal();
  const { user: clerkUser, isLoaded: isUserLoaded } = useClerkUser();

  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>('agent');

  // Function to fetch user profile from Supabase
  const fetchUserProfile = async () => {
    console.log('[ClerkProvider] fetchUserProfile called');

    if (!isClerkLoaded || !isUserLoaded || !isSignedIn || !clerkUser) {
      console.log('[ClerkProvider] fetchUserProfile: Auth prerequisites not met');
      return;
    }

    try {
      // Get JWT token for Supabase
      console.log('[ClerkProvider] Getting JWT token for Supabase...');
      const token = await getToken({ template: 'supabase' });

      if (!token) {
        console.error('[ClerkProvider] No JWT token available');
        setError(new Error('No JWT token available'));
        setLoading(false);
        return;
      }

      console.log('[ClerkProvider] Got JWT token:', token.substring(0, 20) + '...');

      // Set the auth token for Supabase
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      console.log('[ClerkProvider] Set Supabase auth session');

      // Fetch user profile from Supabase using clerk_id
      console.log('[ClerkProvider] Fetching profile for clerk_id:', clerkUser.id);
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_profile_by_clerk_id', { p_clerk_id: clerkUser.id });

      if (profileError) {
        console.error('[ClerkProvider] Error fetching profile:', profileError);
        setError(new Error(profileError.message));
        setLoading(false);
        return;
      }

      console.log('[ClerkProvider] Profile data:', profileData);

      if (profileData && profileData.length > 0) {
        const userProfile = profileData[0];
        console.log('[ClerkProvider] Found profile:', userProfile);
        setProfile(userProfile);
        setRoles([userProfile.role]);
        setActiveRole(userProfile.role);
      } else {
        console.log('[ClerkProvider] No profile found for user, creating a fake profile for testing');
        // Create a fake profile for testing
        const fakeProfile = {
          id: 'fake-id',
          clerk_id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          role: 'agent',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(fakeProfile);
        setRoles(['agent']);
        setActiveRole('agent');

        // Try to create a real profile in the background
        try {
          console.log('[ClerkProvider] Attempting to create a real profile in the background');
          createUserProfile('agent').catch(err => {
            console.error('[ClerkProvider] Background profile creation failed:', err);
          });
        } catch (err) {
          console.error('[ClerkProvider] Error setting up background profile creation:', err);
        }
      }
    } catch (err) {
      console.error('[ClerkProvider] Error in fetchUserProfile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    } finally {
      setLoading(false);
    }
  };

  // Create user profile in Supabase if it doesn't exist
  const createUserProfile = async (role: UserRole = 'agent') => {
    console.log('[ClerkProvider] createUserProfile called with role:', role);

    if (!isClerkLoaded || !isUserLoaded || !isSignedIn || !clerkUser) {
      console.error('[ClerkProvider] createUserProfile: User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      // Get JWT token for Supabase
      console.log('[ClerkProvider] Getting JWT token for profile creation...');
      const token = await getToken({ template: 'supabase' });

      if (!token) {
        console.error('[ClerkProvider] No JWT token available for profile creation');
        throw new Error('No JWT token available');
      }

      console.log('[ClerkProvider] Got JWT token for profile creation:', token.substring(0, 20) + '...');

      // Set the auth token for Supabase
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      console.log('[ClerkProvider] Set Supabase auth session for profile creation');

      // Create profile using the RPC function
      console.log('[ClerkProvider] Creating profile with params:', {
        p_clerk_id: clerkUser.id,
        p_email: clerkUser.primaryEmailAddress?.emailAddress,
        p_first_name: clerkUser.firstName,
        p_last_name: clerkUser.lastName,
        p_role: role
      });

      const { data, error: createError } = await supabase
        .rpc('create_profile_for_clerk_user', {
          p_clerk_id: clerkUser.id,
          p_email: clerkUser.primaryEmailAddress?.emailAddress || '',
          p_first_name: clerkUser.firstName || '',
          p_last_name: clerkUser.lastName || '',
          p_role: role
        });

      if (createError) {
        console.error('[ClerkProvider] Error creating profile:', createError);
        throw new Error(createError.message);
      }

      console.log('[ClerkProvider] Profile created successfully:', data);

      // Refresh the profile
      await fetchUserProfile();
      toast.success('Profile created successfully');

      return data;
    } catch (err) {
      console.error('[ClerkProvider] Error in createUserProfile:', err);
      toast.error('Failed to create user profile');
      throw err;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // This will be handled by Clerk's SignOutButton component
      window.location.href = '/';
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
    }
  };

  // Switch role function
  const switchRole = (role: UserRole) => {
    if (roles.includes(role)) {
      setActiveRole(role);
      toast.success(`Switched to ${role} role`);
    } else {
      toast.error(`You don't have the ${role} role`);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  // Effect to fetch user profile when Clerk auth state changes
  useEffect(() => {
    console.log('[ClerkProvider] Auth state changed:', { isClerkLoaded, isUserLoaded, isSignedIn, clerkUser });

    if (isClerkLoaded && isUserLoaded) {
      if (isSignedIn && clerkUser) {
        console.log('[ClerkProvider] User is signed in, fetching profile for:', clerkUser.id);
        fetchUserProfile();
      } else {
        console.log('[ClerkProvider] User is not signed in, clearing profile');
        setLoading(false);
        setProfile(null);
        setRoles([]);
        setActiveRole('agent');
      }
    }
  }, [isClerkLoaded, isUserLoaded, isSignedIn, clerkUser]);

  // Create the context value
  const contextValue: ClerkAuthContextType = {
    user: clerkUser,
    profile,
    loading: loading || !isClerkLoaded || !isUserLoaded,
    error,
    isAuthenticated: !!isSignedIn,
    isAdmin: roles.includes('admin'),
    roles,
    activeRole,
    signOut,
    switchRole,
    hasRole,
    createUserProfile
  };

  return (
    <ClerkAuthContext.Provider value={contextValue}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

// Export a hook that can be used for compatibility with the existing useAuth hook
export const useClerkAuth = () => useClerkAuthContext();

export default ClerkAuthProvider;
