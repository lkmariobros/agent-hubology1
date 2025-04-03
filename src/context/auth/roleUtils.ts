
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isSpecialAdminEmail } from './adminUtils';
import { AUTH_CONFIG } from './authConfig';

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
    
    // Check for special admin email using the utility
    const cookieEmail = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${AUTH_CONFIG.EMAIL_COOKIE_NAME}=`))
      ?.split('=')[1];
      
    const emailFromCookie = cookieEmail ? decodeURIComponent(cookieEmail) : null;
    const isAdminViaEmail = isSpecialAdminEmail(emailFromCookie);
    
    try {
      // Check if the user has the requested role in the database
      if (isAdminViaEmail && newRole === 'admin') {
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
   * Returns Promise<boolean> if database check is needed, or boolean for immediate results
   */
  hasRole: (roles: UserRole[], role: UserRole): boolean | Promise<boolean> => {
    // Get email from cookie
    const cookieEmail = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${AUTH_CONFIG.EMAIL_COOKIE_NAME}=`))
      ?.split('=')[1];
      
    const emailFromCookie = cookieEmail ? decodeURIComponent(cookieEmail) : null;
    
    // Special case for admin role and special admin email
    if (role === 'admin' && isSpecialAdminEmail(emailFromCookie)) {
      console.log('Special admin access granted via email check in hasRole');
      return true;
    }
    
    const hasRoleInMemory = roles.includes(role);
    console.log(`Checking if user has role ${role} in memory:`, hasRoleInMemory);
    
    // For critical checks, also verify against the database
    return new Promise(async (resolve) => {
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
    
    // Force log admin for special email
    if (isSpecialAdminEmail(email)) {
      console.log('Admin override active for:', email);
    }
    
    console.log('Has admin role:', roles.includes('admin'));
    
    // Check if any role exists
    if (roles.length === 0) {
      console.warn('User has no roles assigned!');
    }
  }
};
