
/**
 * Supabase configuration settings
 * Contains constants and configuration related to Supabase connection
 */

// Base URLs and API keys with proper fallbacks
export const SUPABASE_API_URL = import.meta.env.VITE_SUPABASE_URL || "https://twttyqbqhlgyzntcblbz.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHR5cWJxaGxneXpudGNibGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTc5MDQsImV4cCI6MjA0OTIzMzkwNH0.u8veRmBirnompCeo3Bzgn9TzNqm6VD7NGAiOmwWcP_4";

// Database settings
export const DB_SETTINGS = {
  // Default schema
  SCHEMA: 'public',

  // Timeout for realtime channels (in milliseconds)
  REALTIME_TIMEOUT: 30000,

  // Events per second for realtime channels
  EVENTS_PER_SECOND: 10
};

// Production validation to ensure required environment variables are set
export function validateEnvironment(): boolean {
  if (import.meta.env.PROD) {
    const missingVars = [];

    if (!import.meta.env.VITE_SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');

    if (missingVars.length > 0) {
      console.error(`Missing required environment variables for production: ${missingVars.join(', ')}`);
      console.error('Using fallback values is not recommended for production.');
      return false;
    }
  }

  return true;
}

// Export information about environment status
export const ENV_STATUS = {
  USING_ENV_VARS: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
  IS_PRODUCTION: import.meta.env.PROD
};

export default {
  SUPABASE_API_URL,
  SUPABASE_ANON_KEY,
  DB_SETTINGS,
  validateEnvironment,
  ENV_STATUS
};
