
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

/**
 * Utility functions for handling user roles
 */
export const roleUtils = {
  /**
   * Switch to a different role
   */
  switchRole: async (
    currentRoles: UserRole[], 
    newRole: UserRole, 
    onRoleChange: (role: UserRole) => void
  ): Promise<void> => {
    console.log('Attempting to switch role:', { currentRoles, newRole });
    
    // Special admin access for josephkwantum@gmail.com
    const isSpecialAdminEmail = document.cookie.includes('userEmail=josephkwantum%40gmail.com');
    
    try {
      // Check if the user has the requested role in the database
      if (isSpecialAdminEmail && newRole === 'admin') {
        // Special case for admin email
        console.log('Special admin access granted via email in switchRole');
        onRoleChange(newRole);
        return;
      }
      
      // Get user id from session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        toast.error('Authentication error');
        return;
      }
      
      // Check role in database
      const { data, error } = await supabase.rpc('has_role', {
        p_user_id: user.id,
        p_role_name: newRole
      });
      
      if (error) {
        console.error('Error checking role:', error);
        toast.error('Failed to verify user role');
        return;
      }
      
      if (data === true || currentRoles.includes(newRole)) {
        console.log('Role switch successful:', newRole);
        onRoleChange(newRole);
      } else {
        console.warn('Role switch failed - role not available:', newRole);
        toast.error(`You do not have the ${newRole} role`);
      }
    } catch (err) {
      console.error('Error during role switch:', err);
      toast.error('Failed to switch role');
    }
  },
  
  /**
   * Check if user has a specific role
   */
  hasRole: async (roles: UserRole[], role: UserRole): Promise<boolean> => {
    // Special case for admin role and josephkwantum@gmail.com
    if (role === 'admin' && document.cookie.includes('userEmail=josephkwantum%40gmail.com')) {
      console.log('Special admin access granted via email check in hasRole');
      return true;
    }
    
    const hasRoleInMemory = roles.includes(role);
    console.log(`Checking if user has role ${role} in memory:`, hasRoleInMemory);
    
    // For critical checks, also verify against the database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.rpc('has_role', {
          p_user_id: user.id,
          p_role_name: role
        });
        
        if (error) {
          console.error('Error checking role in database:', error);
          // Fall back to memory check
          return hasRoleInMemory;
        }
        
        console.log(`Database check for role ${role}:`, data);
        return data === true;
      }
    } catch (err) {
      console.error('Error checking role in database:', err);
    }
    
    return hasRoleInMemory;
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
