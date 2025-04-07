/**
 * Clerk configuration settings
 * Contains constants and configuration related to Clerk authentication
 */

// Clerk publishable key
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  'pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA'; // Fallback to the key from Supabase dashboard

// Authentication settings
export const CLERK_SETTINGS = {
  // Redirect paths for authentication flows
  REDIRECT_PATHS: {
    AFTER_SIGN_IN: '/dashboard',
    AFTER_SIGN_UP: '/profile/setup',
    AFTER_SIGN_OUT: '/',
  }
};

// Feature flags for Clerk authentication
export const CLERK_FEATURES = {
  // Enable social login providers
  ENABLE_SOCIAL_LOGIN: true,
  
  // Enable organization features
  ENABLE_ORGANIZATIONS: false,
};

// Export information about environment status
export const CLERK_ENV_STATUS = {
  USING_ENV_VARS: !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  IS_PRODUCTION: import.meta.env.PROD
};

export default {
  CLERK_PUBLISHABLE_KEY,
  CLERK_SETTINGS,
  CLERK_FEATURES,
  CLERK_ENV_STATUS
};
