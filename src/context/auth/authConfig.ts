
/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  // Default role assigned to users if no other role is found
  DEFAULT_ROLE: 'agent',
  
  // Default roles that every user should have
  DEFAULT_ROLES: ['agent', 'viewer'],
  
  // How long to wait for auth initialization before timing out (in milliseconds)
  INITIALIZATION_TIMEOUT: 15000, // 15 seconds (increased from 10 seconds)
  
  // How long to wait for auth checks in route components before timing out
  ROUTE_AUTH_TIMEOUT: 10000, // 10 seconds (increased from 8 seconds)
  
  // Cookie name for storing email (for role utils)
  EMAIL_COOKIE_NAME: 'pa_user_email',
  
  // Special admin emails that always get admin rights
  ADMIN_EMAILS: [
    'josephkwantum@gmail.com',
    'admin@example.com'
  ],
  
  // Debug mode - set to true in development
  DEBUG: import.meta.env.DEV,
  
  // Retry settings
  MAX_PROFILE_RETRIES: 2,
  RETRY_DELAY: 1000 // 1 second
};
