
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { UserRole } from '@/types/auth';

// Get environment variables or fallback to hardcoded values for development
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

// Utility functions for Supabase operations
export const supabaseUtils = {
  // Get user roles from the database
  getRoles: async (): Promise<UserRole[]> => {
    try {
      // In a real implementation, this would query role information
      // For now, return default roles
      return ['agent', 'viewer'];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return ['agent'];
    }
  },

  // Additional utility functions can be added here
};

// Export default supabase instance
export default supabase;
