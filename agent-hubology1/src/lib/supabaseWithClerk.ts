import { createClient } from '@supabase/supabase-js';
import { SUPABASE_API_URL, SUPABASE_ANON_KEY } from '@/config/supabase';

/**
 * Creates a Supabase client with a Clerk JWT token
 * @param clerkToken JWT token from Clerk
 * @returns Supabase client with auth header
 */
export const createSupabaseClient = (clerkToken?: string) => {
  const headers: Record<string, string> = {
    'x-application-name': 'property-agency-system',
    'x-application-version': import.meta.env.VITE_APP_VERSION || '1.0.0',
  };

  // Add authorization header if token is provided
  if (clerkToken) {
    headers['Authorization'] = `Bearer ${clerkToken}`;
  }

  return createClient(SUPABASE_API_URL, SUPABASE_ANON_KEY, {
    global: {
      headers
    },
    auth: {
      persistSession: false, // Don't persist session as we're using Clerk
      autoRefreshToken: false, // Don't auto refresh as we're using Clerk
    },
    db: {
      schema: 'public'
    }
  });
};

/**
 * Hook to get a Supabase client with the current user's Clerk JWT
 * This should be used in components that need to access Supabase data
 */
export const useSupabaseClient = async (getToken: () => Promise<string | null>) => {
  const token = await getToken();
  return createSupabaseClient(token || undefined);
};

// Export a default client without auth for public data
export const supabasePublic = createSupabaseClient();
