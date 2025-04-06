
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - in a real app, these would be environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Error handling utility
export const handleSupabaseError = (error: any, context?: string): Error => {
  console.error(`Supabase error ${context ? `in ${context}` : ''}:`, error);
  return new Error(error?.message || 'An unknown error occurred with the database');
};

// Supabase utility functions
export const supabaseUtils = {
  formatError: (error: any): string => {
    return error?.message || 'An unknown error occurred';
  },
  
  getErrorCode: (error: any): string | null => {
    return error?.code || null;
  },
  
  isUniqueViolation: (error: any): boolean => {
    return error?.code === '23505';
  }
};
