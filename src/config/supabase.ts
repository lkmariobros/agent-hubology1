
/**
 * Supabase configuration settings
 * Contains constants and configuration related to Supabase connection
 */

// Base URLs for API endpoints
export const SUPABASE_API_URL = import.meta.env.VITE_SUPABASE_URL || "https://synabhmsxsvsxkyzhfss.supabase.co";

// Authentication settings
export const AUTH_SETTINGS = {
  // How long to wait for auth initialization before timing out (in milliseconds)
  AUTH_TIMEOUT: 30000,
  
  // Storage key for auth session
  STORAGE_KEY: 'property-agency-auth-token',
  
  // Enable debug mode for authentication in development
  DEBUG_MODE: import.meta.env.DEV,
  
  // Redirect paths for authentication flows
  REDIRECT_PATHS: {
    AFTER_LOGIN: '/dashboard',
    AFTER_SIGNUP: '/dashboard',
    AFTER_LOGOUT: '/',
    AFTER_PASSWORD_RESET: '/reset-password/success'
  }
};

// Feature flags for authentication
export const AUTH_FEATURES = {
  // Enable password reset functionality
  ENABLE_PASSWORD_RESET: true,
  
  // Enable social login providers
  ENABLE_SOCIAL_LOGIN: false,
  
  // Enable magic link authentication
  ENABLE_MAGIC_LINK: false,
  
  // Enable email confirmation bypass (for development)
  BYPASS_EMAIL_CONFIRMATION: import.meta.env.DEV
};

// Production validation to ensure required environment variables are set
export function validateEnvironment(): boolean {
  if (import.meta.env.PROD) {
    const missingVars = [];
    
    if (!import.meta.env.VITE_SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      return false;
    }
  }
  
  return true;
}

export default {
  SUPABASE_API_URL,
  AUTH_SETTINGS,
  AUTH_FEATURES,
  validateEnvironment
};
