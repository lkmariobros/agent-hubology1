
import { supabase } from '@/lib/supabase';

/**
 * Service for handling admin operations with Clerk that require the secret key
 */
export const clerkAdminService = {
  /**
   * Get a user's role information from Clerk
   */
  getUserRoles: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('clerk-admin', {
        body: {
          action: 'getUserRoles',
          data: { userId }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ClerkAdminService] getUserRoles error:', error);
      throw error;
    }
  },
  
  /**
   * Assign a role to a user in Clerk
   */
  assignRole: async (userId: string, role: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('clerk-admin', {
        body: {
          action: 'assignRole',
          data: { userId, role }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ClerkAdminService] assignRole error:', error);
      throw error;
    }
  }
};

export default clerkAdminService;
