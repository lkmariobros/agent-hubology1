
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
