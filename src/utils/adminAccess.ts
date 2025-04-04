
import { UserRole } from '@/types/auth';

/**
 * Centralized utility for handling special admin access
 * This prevents hardcoded emails scattered throughout the codebase
 */

// List of special admin emails that always have admin access
// This can be extended to load from environment variables or config
const SPECIAL_ADMIN_EMAILS = ['josephkwantum@gmail.com'];

/**
 * Checks if an email is in the special admins list
 */
export const isSpecialAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return SPECIAL_ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Ensures an array of roles contains the admin role if user is a special admin
 * Returns a new array with admin added if needed
 */
export const ensureAdminRole = (roles: UserRole[], email?: string | null): UserRole[] => {
  if (!isSpecialAdmin(email)) return roles;
  
  const newRoles = [...roles];
  if (!newRoles.includes('admin')) {
    newRoles.push('admin' as UserRole);
  }
  return newRoles;
};

/**
 * Gets the preferred active role for a user based on their email and roles
 * For special admins, this will return 'admin' if available
 */
export const getPreferredActiveRole = (roles: UserRole[], email?: string | null): UserRole => {
  if (isSpecialAdmin(email) && roles.includes('admin')) {
    return 'admin' as UserRole;
  }
  
  // Default to admin if available, otherwise first role
  return roles.includes('admin') ? 'admin' as UserRole : roles[0];
};
