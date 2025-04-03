/**
 * Utility functions for admin-related checks and operations
 */

// The special admin email that always gets admin privileges
const SPECIAL_ADMIN_EMAIL = 'josephkwantum@gmail.com';

/**
 * Check if the given email is the special admin email that always has admin access
 */
export const isSpecialAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email.toLowerCase() === SPECIAL_ADMIN_EMAIL.toLowerCase();
};

/**
 * Add admin role to roles array if the email is the special admin email
 * and it doesn't already have the admin role
 */
export const ensureAdminRoleForSpecialEmail = (
  roles: string[], 
  email: string | null | undefined
): string[] => {
  if (!isSpecialAdminEmail(email)) return roles;
  
  // Create a new array with the admin role added if not already present
  if (!roles.includes('admin')) {
    return [...roles, 'admin'];
  }
  
  return roles;
};

/**
 * Get active role with precedence for admin if it's available
 */
export const getPreferredActiveRole = (
  roles: string[], 
  currentActiveRole?: string
): string => {
  // If roles include admin and current role is not admin, prefer admin
  if (roles.includes('admin')) {
    return 'admin';
  }
  
  // Otherwise use current role if it's available, or first available role
  if (currentActiveRole && roles.includes(currentActiveRole)) {
    return currentActiveRole;
  }
  
  // Fallback to first available role or agent if empty
  return roles[0] || 'agent';
};
