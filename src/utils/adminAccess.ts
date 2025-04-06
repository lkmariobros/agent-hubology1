import { UserRole } from '@/types/auth';

/**
 * Special admin email addresses that should always have admin roles
 */
export const ADMIN_EMAILS = [
  'admin@example.com',
  'josephkwantum@gmail.com',
  'joseph@property-crm.com'
];

/**
 * Checks if an email address has special admin access
 */
export const isSpecialAdmin = (email?: string): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Ensures user has admin role if they are a special admin
 */
export const ensureAdminRole = (roles: string[], email?: string): string[] => {
  if (isSpecialAdmin(email) && !roles.includes('admin')) {
    return [...roles, 'admin'];
  }
  return roles;
};

/**
 * Determines the preferred active role for a user based on their roles and email
 */
export const getPreferredActiveRole = (roles: string[], email?: string): string => {
  // If user is special admin, prefer admin role
  if (isSpecialAdmin(email) && roles.includes('admin')) {
    return 'admin';
  }
  
  // Otherwise look for highest priority role
  const roleOrder = ['admin', 'team_leader', 'manager', 'finance', 'agent', 'viewer'];
  
  for (const role of roleOrder) {
    if (roles.includes(role)) {
      return role;
    }
  }
  
  // Default to first available role or 'agent'
  return roles[0] || 'agent';
};
