
import { supabase } from '@/lib/supabase';
import { Role, Permission } from '@/types/role';
import { toast } from 'sonner';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    try {
      // Get all roles with user counts from the database
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          users_count: user_roles(count)
        `);

      if (error) throw error;
      return data as Role[] || [];
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
      return [];
    }
  },

  async getRole(id: string): Promise<Role | null> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          users_count: user_roles(count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Role;
    } catch (error: any) {
      console.error(`Error fetching role ${id}:`, error);
      toast.error('Failed to load role details');
      return null;
    }
  },

  async createRole(role: Partial<Role>): Promise<Role | null> {
    try {
      // First check if a role with this name already exists
      const { data: existingRole } = await supabase
        .from('roles')
        .select('id, name')
        .eq('name', role.name)
        .maybeSingle();
      
      if (existingRole) {
        toast.error(`A role with name "${role.name}" already exists`);
        return null;
      }
      
      const { data, error } = await supabase
        .from('roles')
        .insert({
          name: role.name,
          description: role.description || null
        })
        .select()
        .single();

      if (error) throw error;
      toast.success(`Role "${role.name}" created successfully`);
      return data as Role;
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast.error(error.message || 'Failed to create role');
      return null;
    }
  },

  async updateRole(id: string, updates: Partial<Role>): Promise<Role | null> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .update({
          name: updates.name,
          description: updates.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success(`Role "${updates.name}" updated successfully`);
      return data as Role;
    } catch (error: any) {
      console.error(`Error updating role ${id}:`, error);
      toast.error(error.message || 'Failed to update role');
      return null;
    }
  },

  async deleteRole(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Role deleted successfully');
      return true;
    } catch (error: any) {
      console.error(`Error deleting role ${id}:`, error);
      toast.error(error.message || 'Failed to delete role');
      return false;
    }
  },
  
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
