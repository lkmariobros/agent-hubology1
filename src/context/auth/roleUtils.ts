
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isSpecialAdmin } from '@/utils/adminAccess';

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
    
    try {
      // Get user from session for email checking
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        toast.error('Authentication error');
        return;
      }
      
      // Check for special admin access
      if (isSpecialAdmin(user.email) && newRole === 'admin') {
        console.log('Special admin access granted to', user.email);
        onRoleChange(newRole);
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
   * Returns Promise<boolean> if database check is needed, or boolean for immediate results
   */
  hasRole: (roles: UserRole[], role: UserRole): boolean | Promise<boolean> => {
    // Use centralized utility to check for special admin status
    if (role === 'admin') {
      // Check for special admin email in cookie for client-side checks
      const cookies = document.cookie.split(';');
      const emailCookie = cookies.find(c => c.trim().startsWith('userEmail='));
      if (emailCookie) {
        const email = decodeURIComponent(emailCookie.split('=')[1]);
        if (isSpecialAdmin(email)) {
          console.log('Special admin access granted to', email);
          return true;
        }
      }
    }
    
    const hasRoleInMemory = roles.includes(role);
    console.log(`Checking if user has role ${role} in memory:`, hasRoleInMemory);
    
    // For critical checks, also verify against the database
    return new Promise(async (resolve) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check for special admin access first
          if (role === 'admin' && isSpecialAdmin(user.email)) {
            return resolve(true);
          }
          
          const { data, error } = await supabase.rpc('has_role', {
            p_user_id: user.id,
            p_role_name: role
          });
          
          if (error) {
            console.error('Error checking role in database:', error);
            // Fall back to memory check
            return resolve(hasRoleInMemory);
          }
          
          console.log(`Database check for role ${role}:`, data);
          return resolve(data === true);
        }
      } catch (err) {
        console.error('Error checking role in database:', err);
        return resolve(hasRoleInMemory);
      }
      
      return resolve(hasRoleInMemory);
    });
  },

  /**
   * Debug function to log current roles
   */
  debugRoles: (roles: UserRole[], email: string): void => {
    console.log(`Current roles for user ${email}:`, roles);
    
    // Use centralized utility to check for special admin status
    if (isSpecialAdmin(email)) {
      console.log('Admin override active for:', email);
    }
    
    console.log('Has admin role:', roles.includes('admin'));
    
    // Check if any role exists
    if (roles.length === 0) {
      console.warn('User has no roles assigned!');
    }
  }
};
