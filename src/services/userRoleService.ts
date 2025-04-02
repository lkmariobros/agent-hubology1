
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const userRoleService = {
  async getUsersWithRole(roleId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles!inner(id, name),
          agent_profiles!user_id(full_name, email, avatar_url)
        `)
        .eq('role_id', roleId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error(`Error fetching users with role ${roleId}:`, error);
      toast.error('Failed to load users assigned to this role');
      return [];
    }
  },
  
  async assignRoleToUser(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId
        });

      if (error) throw error;
      toast.success('Role assigned successfully');
      return true;
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast.error(error.message || 'Failed to assign role');
      return false;
    }
  },
  
  async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) throw error;
      toast.success('Role removed successfully');
      return true;
    } catch (error: any) {
      console.error('Error removing role from user:', error);
      toast.error(error.message || 'Failed to remove role');
      return false;
    }
  }
};

export default userRoleService;
