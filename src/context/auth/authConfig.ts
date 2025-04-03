
/**
 * Configuration settings for the authentication system
 */

export const AUTH_CONFIG = {
  // Timeout for auth initialization (in milliseconds)
  INITIALIZATION_TIMEOUT: 30000,
  
  // Timeout for protected route auth checks (in milliseconds)
  ROUTE_AUTH_TIMEOUT: 10000,
  
  // Special admin email that always gets admin access
  SPECIAL_ADMIN_EMAIL: 'josephkwantum@gmail.com',
  
  // Default roles for all users
  DEFAULT_ROLES: ['agent', 'viewer'],
  
  // Default role if no roles available
  DEFAULT_ROLE: 'agent',
  
  // Cookie name for storing email
  EMAIL_COOKIE_NAME: 'userEmail'
};
