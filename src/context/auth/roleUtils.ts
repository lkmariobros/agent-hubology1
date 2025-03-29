
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Utility functions for handling user roles
 */
export const roleUtils = {
  /**
   * Switch to a different role
   */
  switchRole: (
    currentRoles: UserRole[], 
    newRole: UserRole, 
    onRoleChange: (role: UserRole) => void
  ): void => {
    console.log('Attempting to switch role:', { currentRoles, newRole });
    
    // Force enable admin role for josephkwantum@gmail.com
    if (newRole === 'admin' && document.cookie.includes('userEmail=josephkwantum%40gmail.com')) {
      console.log('Special admin access granted via email check');
      onRoleChange('admin');
      toast.success(`Switched to admin role`);
      return;
    }
    
    if (currentRoles.includes(newRole)) {
      console.log('Role switch successful:', newRole);
      onRoleChange(newRole);
      toast.success(`Switched to ${newRole} role`);
    } else {
      console.warn('Role switch failed - role not available:', newRole);
      toast.error(`You do not have the ${newRole} role`);
    }
  },
  
  /**
   * Check if user has a specific role
   */
  hasRole: (roles: UserRole[], role: UserRole): boolean => {
    // Special case for admin role and josephkwantum@gmail.com
    if (role === 'admin' && document.cookie.includes('userEmail=josephkwantum%40gmail.com')) {
      console.log('Special admin access granted via email check in hasRole');
      return true;
    }
    
    const hasRole = roles.includes(role);
    console.log(`Checking if user has role ${role}:`, hasRole);
    return hasRole;
  },

  /**
   * Debug function to log current roles
   */
  debugRoles: (roles: UserRole[], email: string): void => {
    console.log(`Current roles for user ${email}:`, roles);
    
    // Force log admin for special email
    if (email === 'josephkwantum@gmail.com') {
      console.log('Admin override active for:', email);
    }
    
    console.log('Has admin role:', roles.includes('admin'));
    
    // Check if any role exists
    if (roles.length === 0) {
      console.warn('User has no roles assigned!');
    }
  }
};
