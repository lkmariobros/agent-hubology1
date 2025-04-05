
import { UserRole } from '@/types/auth';

// List of special admin emails that always get admin privileges
const SPECIAL_ADMIN_EMAILS = ['josephkwantum@gmail.com'];

/**
 * Checks if an email belongs to a special admin user
 */
export const isSpecialAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return SPECIAL_ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Ensures admin role is included for special admin emails
 */
export const ensureAdminRole = (roles: UserRole[], email?: string | null): UserRole[] => {
  // Return roles as-is if not a special admin
  if (!isSpecialAdmin(email)) {
    return roles;
  }
  
  // Create a copy of roles to avoid mutating the original array
  const updatedRoles = [...roles];
  
  // Add 'admin' role if it doesn't already exist
  if (!updatedRoles.includes('admin')) {
    console.log('Adding admin role for special admin email:', email);
    updatedRoles.push('admin');
  }
  
  return updatedRoles;
};

/**
 * Determines the best active role based on user roles and status
 */
export const getPreferredActiveRole = (roles: UserRole[], email?: string | null): UserRole => {
  // For special admins, prefer admin role when available
  if (isSpecialAdmin(email) && roles.includes('admin')) {
    return 'admin';
  }
  
  // Role priority order
  const rolePriority: UserRole[] = ['admin', 'team_leader', 'manager', 'finance', 'agent', 'viewer'];
  
  // Find highest priority role user has
  for (const role of rolePriority) {
    if (roles.includes(role)) {
      return role;
    }
  }
  
  // Default to first available role or agent
  return roles[0] || 'agent';
};
