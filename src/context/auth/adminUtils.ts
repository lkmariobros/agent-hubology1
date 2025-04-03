import { UserRole } from '@/types/auth';

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
  roles: string[] | UserRole[], 
  email: string | null | undefined
): UserRole[] => {
  // Ensure we're working with UserRole[] by casting
  const typedRoles = roles.map(role => role as UserRole);
  
  if (!isSpecialAdminEmail(email)) return typedRoles;
  
  // Create a new array with the admin role added if not already present
  if (!typedRoles.includes('admin')) {
    return [...typedRoles, 'admin'];
  }
  
  return typedRoles;
};

/**
 * Get active role with precedence for admin if it's available
 */
export const getPreferredActiveRole = (
  roles: string[] | UserRole[], 
  currentActiveRole?: string
): UserRole => {
  // Ensure we're working with UserRole[] by casting
  const typedRoles = roles.map(role => role as UserRole);
  
  // If roles include admin and current role is not admin, prefer admin
  if (typedRoles.includes('admin')) {
    return 'admin';
  }
  
  // Otherwise use current role if it's available, or first available role
  if (currentActiveRole && typedRoles.includes(currentActiveRole as UserRole)) {
    return currentActiveRole as UserRole;
  }
  
  // Fallback to first available role or agent if empty
  return typedRoles[0] || 'agent';
};
