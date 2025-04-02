
import { supabase } from '@/lib/supabase';
import { Role, Permission } from '@/types/role';
import { toast } from 'sonner';
import { assignPermissionsToRole, checkRoleNameExists, clearRolePermissions, formatRoleData } from '@/utils/roleUtils';
import permissionService from './permissionService';
import userRoleService from './userRoleService';

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
      return formatRoleData(data) as Role[];
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
          users_count: user_roles(count),
          permissions:role_permissions(
            permission:permissions(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform the nested permissions array
      if (data && data.permissions) {
        data.permissions = data.permissions.map((rp: any) => rp.permission);
      }
      
      return data as Role;
    } catch (error: any) {
      console.error(`Error fetching role ${id}:`, error);
      toast.error('Failed to load role details');
      return null;
    }
  },

  // Reexport permission methods for convenience
  getPermissions: permissionService.getPermissions,
  getPermissionsByCategories: permissionService.getPermissionsByCategories,
  getRolePermissions: permissionService.getRolePermissions,

  async createRole(role: Partial<Role>): Promise<Role | null> {
    try {
      // Check if a role with this name already exists
      const roleExists = await checkRoleNameExists(role.name as string);
      
      if (roleExists) {
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
      
      // If permissions are provided, assign them to the role
      if (role.permissions && role.permissions.length > 0) {
        await assignPermissionsToRole(data.id, role.permissions);
      }
      
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
      
      // If permissions are provided, update them
      if (updates.permissions) {
        // First, remove all existing permissions for this role
        await clearRolePermissions(id);
        
        // Then, assign the new permissions
        await assignPermissionsToRole(id, updates.permissions);
      }
      
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
  
  // Re-export user role methods for convenience
  getUsersWithRole: userRoleService.getUsersWithRole,
  assignRoleToUser: userRoleService.assignRoleToUser,
  removeRoleFromUser: userRoleService.removeRoleFromUser
};

export default roleService;
