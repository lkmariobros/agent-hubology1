
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { UserRole } from '@/types/auth';

// Get environment variables 
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://synabhmsxsvsxkyzhfss.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bmFiaG1zeHN2c3hreXpoZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjg2MjMsImV4cCI6MjA1Nzk0NDYyM30.jzCMXi4f7i6EAdABneTYc55oVI2bs8e5CVtnyWJ1rG0";

// Create Supabase client with explicit auth configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'property-agency-auth-token',
    storage: window.localStorage
  },
  global: {
    headers: {
      'x-application-name': 'property-agency-system',
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    timeout: 30000, // 30s timeout for realtime channels (default is 10s)
    params: {
      eventsPerSecond: 10
    }
  }
});

// Log if environment variables are missing in non-production environments
if (import.meta.env.DEV && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.warn('Missing Supabase environment variables. Using fallback values.');
}

// Error handling utilities for Supabase operations
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  
  // Return user-friendly error message
  return {
    success: false, 
    error: error.message || `An error occurred during ${operation}`,
    details: import.meta.env.DEV ? error : undefined
  };
};

// Helper function to check authentication status
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Export additional utility methods if needed
export const supabaseUtils = {
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      handleSupabaseError(error, 'getProfile');
      return null;
    }
    
    return data;
  },
  
  getRoles: async (): Promise<UserRole[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ['agent']; // Default fallback role
    
    try {
      // Use a query on the user_roles table instead of rpc
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error getting user roles:', error);
        return ['agent']; // Default fallback role
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Extract the role values from the returned objects
        return data.map(item => item.role) as UserRole[];
      } else {
        return ['agent']; // Default fallback role
      }
    } catch (error) {
      console.error('Error in getRoles function:', error);
      return ['agent']; // Default fallback role
    }
  },
  
  hasRole: async (roleName: UserRole): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    try {
      // Check directly in the user_roles table instead of using rpc
      const { data, error, count } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('role', roleName);
      
      if (error) {
        console.error('Error checking role:', error);
        return false;
      }
      
      return count !== null && count > 0;
    } catch (error) {
      console.error('Error in hasRole function:', error);
      return false;
    }
  },
  
  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      handleSupabaseError(error, 'refreshSession');
      return null;
    }
    return data;
  }
};

// Export a singleton instance for the entire application
export default supabase;
