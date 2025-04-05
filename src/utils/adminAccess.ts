
/**
 * Utility functions for checking admin access
 */
import { UserRole } from '@/types/auth';

// List of special admin emails that always get admin privileges
const SPECIAL_ADMIN_EMAILS = ['josephkwantum@gmail.com'];

/**
 * Check if an email is in the special admins list
 */
export const isSpecialAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return SPECIAL_ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Ensure admin role is added to roles array if the user is a special admin
 */
export const ensureAdminRole = (roles: UserRole[], email?: string | null): UserRole[] => {
  if (isSpecialAdmin(email) && !roles.includes('admin')) {
    return [...roles, 'admin'];
  }
  return roles;
};

/**
 * Get preferred active role based on roles and email
 */
export const getPreferredActiveRole = (roles: UserRole[], email?: string | null): UserRole => {
  // Special admins always default to admin role if available
  if (isSpecialAdmin(email) && roles.includes('admin')) {
    return 'admin';
  }
  
  // Otherwise use the first role with preference for admin > team_leader > other roles
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('team_leader')) return 'team_leader';
  
  return roles[0] || 'agent';
};
