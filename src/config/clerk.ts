
/**
 * Clerk authentication configuration
 */

export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  "pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Updated publishable key

// Map of role keys to Clerk organization role names
export const CLERK_ROLE_MAPPING = {
  'admin': 'org:admin',
  'team_leader': 'org:team-leader',
  'manager': 'org:manager',
  'finance': 'org:finance',
  'agent': 'org:agent',
  'viewer': 'org:viewer'
};

// Authentication settings
export const CLERK_AUTH_SETTINGS = {
  // How long to wait for auth initialization before timing out (in milliseconds)
  AUTH_TIMEOUT: 10000, // Reduced from 30s to 10s for faster feedback
  
  // Redirect paths for authentication flows
  REDIRECT_PATHS: {
    AFTER_LOGIN: '/dashboard',
    AFTER_SIGNUP: '/dashboard',
    AFTER_LOGOUT: '/',
  }
};

// Feature flags for authentication
export const CLERK_AUTH_FEATURES = {
  // Enable organization features (teams)
  ENABLE_ORGANIZATIONS: true
};

export default {
  CLERK_PUBLISHABLE_KEY,
  CLERK_ROLE_MAPPING,
  CLERK_AUTH_SETTINGS,
  CLERK_AUTH_FEATURES
};
