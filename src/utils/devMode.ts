/**
 * Development mode utilities to help with testing and development
 */

// Set this to true to enable development mode
export const DEV_MODE = true;

// Set this to true to bypass authentication checks
export const BYPASS_AUTH = true;

// Mock user data for development
export const DEV_USER = {
  id: 'dev-user-123',
  firstName: 'Dev',
  lastName: 'User',
  email: 'dev@example.com',
  role: 'admin',
  roles: ['admin', 'agent'],
  isAdmin: true,
  activeRole: 'admin'
};

// Development utilities
export const devUtils = {
  // Log with dev prefix
  log: (message: string, data?: any) => {
    if (DEV_MODE) {
      console.log(`[DEV] ${message}`, data || '');
    }
  },
  
  // Get mock user
  getUser: () => {
    return DEV_USER;
  }
};
