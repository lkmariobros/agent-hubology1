
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
    if (currentRoles.includes(newRole)) {
      onRoleChange(newRole);
    } else {
      toast.error(`You do not have the ${newRole} role`);
    }
  },
  
  /**
   * Check if user has a specific role
   */
  hasRole: (roles: UserRole[], role: UserRole): boolean => {
    return roles.includes(role);
  }
};
