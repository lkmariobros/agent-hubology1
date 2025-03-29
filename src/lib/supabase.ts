
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
    if (!user) return ['agent', 'viewer']; // Default fallback roles
    
    try {
      // For now, determine roles from agent_profiles based on tier
      // This is a fallback/temporary solution until user_roles table is properly created in schema
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('tier, tier_name')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error getting user tier data:', error);
        return ['agent', 'viewer']; // Default fallback roles
      }
      
      // Define roles based on tier (temporary mapping)
      const roles: UserRole[] = ['agent']; // Everyone has agent role
      
      if (data) {
        const tier = data.tier || 1;
        
        // Map tiers to roles
        if (tier >= 5) roles.push('admin');
        if (tier >= 4) roles.push('team_leader');
        if (tier >= 3) roles.push('manager');
        if (tier >= 2) roles.push('finance');
        // Adding viewer role for completeness
        roles.push('viewer'); // Everyone can be a viewer
      }
      
      return roles;
    } catch (error) {
      console.error('Error in getRoles function:', error);
      return ['agent', 'viewer']; // Default fallback roles
    }
  },
  
  hasRole: async (roleName: UserRole): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    try {
      // For now, determine roles from agent_profiles based on tier
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('tier')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking role:', error);
        return false;
      }
      
      // Map roles to minimum tiers required
      const roleTierMap: Record<UserRole, number> = {
        'agent': 1,
        'finance': 2,
        'manager': 3,
        'team_leader': 4,
        'admin': 5,
        'viewer': 1  // Adding viewer role with the lowest tier requirement
      };
      
      const tier = data?.tier || 1;
      const requiredTier = roleTierMap[roleName] || 999;
      
      return tier >= requiredTier;
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
