
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { UserRole } from '@/types/auth';

// Get environment variables or fallback to hardcoded values for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://synabhmsxsvsxkyzhfss.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bmFiaG1zeHN2c3hreXpoZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjg2MjMsImV4cCI6MjA1Nzk0NDYyM30.jzCMXi4f7i6EAdABneTYc55oVI2bs8e5CVtnyWJ1rG0";

// Create a single Supabase client instance
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

  // Utility function for fetching a user profile by ID
  getUserProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  
  // Upload a file to storage
  uploadFile: async (bucket: string, filePath: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  
  // Get a public URL for a file
  getPublicUrl: (bucket: string, filePath: string) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
  },
  
  // Additional utility functions can be added here
};

// Export default supabase instance
export default supabase;
