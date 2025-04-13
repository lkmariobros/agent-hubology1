import { useAuth as useClerkOriginalAuth, useUser } from '@clerk/clerk-react';
import { UserRole } from '@/types/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { createSupabaseWithToken } from '@/lib/supabase';

/**
 * Enhanced Clerk auth hook that provides additional functionality
 */
export function useClerkAuth() {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkOriginalAuth();
  const { user } = useUser();

  // Use React Query to check if the user is an admin
  const { data: adminStatus, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!isSignedIn || !user) return { isAdmin: false };

      try {
        // Get token for Supabase
        const token = await getToken({ template: 'supabase' });
        if (!token) return { isAdmin: false };

        // Create authenticated Supabase client
        const client = createSupabaseWithToken(token);

        // Call the is_admin_tier function
        const { data, error } = await client.rpc('is_admin_tier');

        if (error) {
          console.error('Error checking admin status:', error);
          return { isAdmin: false };
        }

        return { isAdmin: !!data };
      } catch (error) {
        console.error('Error in admin check:', error);
        return { isAdmin: false };
      }
    },
    enabled: isSignedIn && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Determine if user has admin role
  const isAdmin = adminStatus?.isAdmin || false;

  // Create a user profile object from Clerk user data
  const userProfile = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    roles: isAdmin ? ['agent', 'admin'] as UserRole[] : ['agent'] as UserRole[],
    activeRole: isAdmin ? 'admin' as UserRole : 'agent' as UserRole
  } : null;

  return {
    isLoaded: isLoaded && !isCheckingAdmin,
    isSignedIn,
    getToken,
    signOut,
    user: userProfile,
    isAdmin
  };
}

export default useClerkAuth;
