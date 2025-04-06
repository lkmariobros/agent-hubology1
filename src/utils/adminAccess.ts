
/**
 * Utility functions for checking admin access
 */

// Check if email is a special admin account
export function isSpecialAdmin(email?: string | null): boolean {
  if (!email) return false;
  
  // Special admin accounts
  const specialAdminEmails = [
    'josephkwantum@gmail.com',
    'admin@propertypro.com'
  ];
  
  return specialAdminEmails.includes(email.toLowerCase());
}

// Ensure admin role is in the roles array
export function ensureAdminRole(roles: string[], email?: string | null): string[] {
  if (!isSpecialAdmin(email)) return roles;
  
  // If user has special admin email, ensure they have admin role
  if (!roles.includes('admin')) {
    return [...roles, 'admin'];
  }
  
  return roles;
}

// Check if the current route is an admin route
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

// Determine preferred active role based on roles array and user email
export function getPreferredActiveRole(roles: string[], email?: string | null): string {
  // Special admin users should default to admin role if they have it
  if (isSpecialAdmin(email) && roles.includes('admin')) {
    return 'admin';
  }
  
  // Order of preference for roles
  const preferredOrder = ['admin', 'team_leader', 'manager', 'finance', 'agent', 'viewer'];
  
  // Find the highest priority role that the user has
  for (const role of preferredOrder) {
    if (roles.includes(role)) {
      return role;
    }
  }
  
  // Default to the first role if none of the preferred roles match
  return roles[0] || 'agent';
}
