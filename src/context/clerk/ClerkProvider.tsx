import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ClerkProvider as ClerkReactProvider,
  useAuth as useClerkAuthOriginal,
  useUser as useClerkUser,
  SignedIn,
  SignedOut
} from '@clerk/clerk-react';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { useRoles } from '@/hooks/useRoles';
import { roleService } from '@/services/roleService';
import { syncUserRoles, getRolesFromMetadata } from '@/utils/clerkRoleUtils';
import { syncProfileWithDatabase, getProfileFromDatabase, getCompleteProfileData } from '@/utils/profileSyncUtils';

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
  createUserProfile: (role?: UserRole, additionalData?: any) => Promise<void>;
  assignRole: (roleId: string) => Promise<boolean>;
  removeRole: (roleId: string) => Promise<boolean>;
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
  const [isSyncingRoles, setIsSyncingRoles] = useState(false);

  // Function to fetch user profile from Clerk user metadata and database
  const fetchUserProfile = async () => {
    console.log('[ClerkProvider] fetchUserProfile called');

    if (!isClerkLoaded || !isUserLoaded || !isSignedIn || !clerkUser) {
      console.log('[ClerkProvider] fetchUserProfile: Auth prerequisites not met');
      return;
    }

    try {
      console.log('[ClerkProvider] Processing user data for:', clerkUser.id);

      // Get JWT token for database access
      console.log('[ClerkProvider] Getting JWT token...');
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.error('[ClerkProvider] No token available');
        throw new Error('No token available for database access');
      }

      // Get profile from database
      const dbProfile = await getProfileFromDatabase(clerkUser.id, token);

      // Get user metadata from Clerk
      const userMetadata = clerkUser.publicMetadata || {};
      console.log('[ClerkProvider] User metadata:', userMetadata);

      // Get roles from metadata or default to 'agent'
      const userRoles = getRolesFromMetadata(userMetadata);

      if (dbProfile) {
        console.log('[ClerkProvider] Found profile in database:', dbProfile);

        // Get complete profile data with preferences and agent details
        const completeProfile = await getCompleteProfileData(dbProfile.id, token);

        if (completeProfile) {
          // Create a profile object from database data
          const userProfile = {
            id: dbProfile.id,
            clerk_id: clerkUser.id,
            email: dbProfile.email || clerkUser.primaryEmailAddress?.emailAddress || '',
            first_name: dbProfile.first_name || clerkUser.firstName || '',
            last_name: dbProfile.last_name || clerkUser.lastName || '',
            role: dbProfile.role, // Primary role from database
            created_at: dbProfile.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            preferences: completeProfile.preferences || {},
            agent_details: completeProfile.agent_details || {}
          };

          console.log('[ClerkProvider] Constructed profile from database:', userProfile);

          // Set profile
          setProfile(userProfile);

          // Add database role to roles if not already there
          if (!userRoles.includes(dbProfile.role)) {
            userRoles.push(dbProfile.role);
          }
        }
      } else {
        console.log('[ClerkProvider] No profile found in database, using Clerk data');

        // Create a profile object from Clerk user data
        const userProfile = {
          id: clerkUser.id,
          clerk_id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          role: userRoles[0], // Primary role
          created_at: userMetadata.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('[ClerkProvider] Constructed profile from Clerk data:', userProfile);

        // Set profile
        setProfile(userProfile);
      }

      // Set roles
      setRoles(userRoles);

      // Set active role from metadata or use first available role
      const storedActiveRole = localStorage.getItem('activeRole') as UserRole | null;
      const newActiveRole = storedActiveRole && userRoles.includes(storedActiveRole)
        ? storedActiveRole
        : userRoles[0];

      setActiveRole(newActiveRole);

      console.log('[ClerkProvider] Set active role to:', newActiveRole);

      // Synchronize roles with database (do this after setting local state)
      if (!isSyncingRoles) {
        syncRolesWithDatabase(clerkUser.id, userRoles);
      }
    } catch (err) {
      console.error('[ClerkProvider] Error in fetchUserProfile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    } finally {
      setLoading(false);
    }
  };

  // Synchronize roles between Clerk metadata and database
  const syncRolesWithDatabase = async (userId: string, clerkRoles: UserRole[]) => {
    try {
      setIsSyncingRoles(true);
      console.log('[ClerkProvider] Synchronizing roles for user:', userId);

      const result = await syncUserRoles(userId, clerkRoles);

      console.log('[ClerkProvider] Role synchronization result:', result);
    } catch (err) {
      console.error('[ClerkProvider] Error synchronizing roles:', err);
    } finally {
      setIsSyncingRoles(false);
    }
  };

  // Create user profile in Clerk metadata if it doesn't exist
  const createUserProfile = async (role: UserRole = 'agent', additionalData?: any) => {
    console.log('[ClerkProvider] createUserProfile called with role:', role);

    if (!isClerkLoaded || !isUserLoaded || !isSignedIn || !clerkUser) {
      console.error('[ClerkProvider] createUserProfile: User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      // Get token for Supabase
      console.log('[ClerkProvider] Getting JWT token for profile creation...');
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.error('[ClerkProvider] No token available for profile creation');
        throw new Error('No token available');
      }

      // Prepare profile data from user info and additional data
      const newProfile = {
        id: clerkUser.id,
        clerk_id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Add additional profile details
        preferences: {
          darkMode: additionalData?.darkMode ?? true,
          emailNotifications: additionalData?.emailNotifications ?? true,
          preferredPortal: additionalData?.preferredPortal || (role === 'admin' ? 'admin' : 'agent'),
        },
        agent_details: role === 'agent' ? {
          level: additionalData?.agentLevel || 'junior',
          salesTarget: additionalData?.salesTarget || 0,
        } : null
      };

      // Set profile in state
      setProfile(newProfile);

      // Set roles
      const newRoles = [role];
      setRoles(newRoles);
      setActiveRole(role);

      // Store active role in localStorage
      localStorage.setItem('activeRole', role);

      // Synchronize profile with database
      await syncProfileWithDatabase(clerkUser.id, role, {
        ...additionalData,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.primaryEmailAddress?.emailAddress
      }, token);

      // In a production app, you would make an API call to update Clerk user metadata
      // This would be using the Clerk Backend API or a webhook handler
      // For now we'll log what would be done:
      console.log('[ClerkProvider] Would update Clerk metadata with:', {
        publicMetadata: {
          roles: newRoles,
          profile: newProfile,
          preferences: newProfile.preferences,
          agent_details: newProfile.agent_details,
          last_updated: new Date().toISOString()
        }
      });

      // Synchronize roles with database
      syncRolesWithDatabase(clerkUser.id, newRoles);

      console.log('[ClerkProvider] Profile created successfully:', newProfile);
      toast.success('Profile created successfully');

      return newProfile;
    } catch (err) {
      console.error('[ClerkProvider] Error in createUserProfile:', err);
      toast.error('Failed to create user profile');
      throw err;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Use Clerk's signOut method if available
      if (typeof window !== 'undefined' && window.Clerk) {
        await window.Clerk.signOut();
      } else {
        // Fallback to redirect
        console.warn('Clerk signOut method not available, redirecting to home page');
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
    }
  };

  // Switch role function
  const switchRole = (role: UserRole) => {
    if (roles.includes(role)) {
      setActiveRole(role);
      // Store active role in localStorage
      localStorage.setItem('activeRole', role);
      toast.success(`Switched to ${role} role`);
    } else {
      toast.error(`You don't have the ${role} role`);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  // Assign a role to the current user
  const assignRole = async (roleId: string): Promise<boolean> => {
    if (!clerkUser || !clerkUser.id) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      // Call the roleService to assign the role to the user
      const success = await roleService.assignRoleToUser(clerkUser.id, roleId);

      if (success) {
        // Fetch the role to get its name
        const role = await roleService.getRole(roleId);

        if (role && role.name) {
          // Add the role to the local state if it's not already there
          const roleName = role.name.toLowerCase() as UserRole;

          if (!roles.includes(roleName)) {
            const newRoles = [...roles, roleName];
            setRoles(newRoles);

            // If this is the first role, set it as active
            if (roles.length === 0) {
              setActiveRole(roleName);
              localStorage.setItem('activeRole', roleName);
            }

            // Here you would also update the user's metadata in Clerk
            // using Clerk's API in a production app
          }

          toast.success(`${role.name} role assigned successfully`);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
      return false;
    }
  };

  // Remove a role from the current user
  const removeRole = async (roleId: string): Promise<boolean> => {
    if (!clerkUser || !clerkUser.id) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      // Call the roleService to remove the role from the user
      const success = await roleService.removeRoleFromUser(clerkUser.id, roleId);

      if (success) {
        // Fetch the role to get its name
        const role = await roleService.getRole(roleId);

        if (role && role.name) {
          // Remove the role from the local state
          const roleName = role.name.toLowerCase() as UserRole;
          const newRoles = roles.filter(r => r !== roleName);
          setRoles(newRoles);

          // If the active role was removed, switch to another role
          if (activeRole === roleName && newRoles.length > 0) {
            setActiveRole(newRoles[0]);
            localStorage.setItem('activeRole', newRoles[0]);
          }

          // Here you would also update the user's metadata in Clerk
          // using Clerk's API in a production app

          toast.success(`${role.name} role removed successfully`);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
      return false;
    }
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
    session: isSignedIn ? { user: clerkUser } as any : null, // Add a session-like object for compatibility
    loading: loading || !isClerkLoaded || !isUserLoaded,
    error,
    isAuthenticated: !!isSignedIn,
    isAdmin: roles.includes('admin'),
    roles,
    activeRole,
    signIn: async () => { console.warn('signIn is not implemented in Clerk auth'); },
    signUp: async () => { console.warn('signUp is not implemented in Clerk auth'); },
    signOut,
    resetPassword: async () => { console.warn('resetPassword is not implemented in Clerk auth'); },
    switchRole,
    hasRole,
    createUserProfile,
    assignRole,
    removeRole
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
