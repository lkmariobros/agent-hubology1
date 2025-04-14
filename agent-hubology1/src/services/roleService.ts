
import { supabase } from '@/lib/supabase';
import { Role, Permission } from '@/types/role';
import { toast } from 'sonner';
import { assignPermissionsToRole, checkRoleNameExists, clearRolePermissions, formatRoleData } from '@/utils/roleUtils';
import permissionService from './permissionService';
import userRoleService from './userRoleService';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    try {
      console.log('Fetching roles from Supabase');
      
      // Get all roles with user counts from the database
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          users_count: user_roles(count)
        `);

      if (error) {
        console.error('Supabase error when fetching roles:', error);
        throw new Error(`Failed to load roles: ${error.message}`);
      }
      
      if (!data) {
        console.warn('No roles data returned from Supabase');
        return [];
      }
      
      console.log(`Successfully fetched ${data.length} roles`);
      return formatRoleData(data) as Role[];
    } catch (error: any) {
      console.error('Error in getRoles():', error);
      throw new Error(`Failed to load roles: ${error.message || 'Unknown error'}`);
    }
  },

  async getRole(id: string): Promise<Role | null> {
    try {
      console.log(`Fetching role details for ${id}`);
      
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

      if (error) {
        console.error(`Supabase error when fetching role ${id}:`, error);
        throw new Error(`Failed to load role details: ${error.message}`);
      }
      
      if (!data) {
        console.warn(`No role data returned for ${id}`);
        return null;
      }
      
      // Transform the nested permissions array
      if (data && data.permissions) {
        data.permissions = data.permissions.map((rp: any) => rp.permission);
      }
      
      console.log(`Successfully fetched role details for ${id}`);
      return data as Role;
    } catch (error: any) {
      console.error(`Error in getRole(${id}):`, error);
      throw new Error(`Failed to load role details: ${error.message || 'Unknown error'}`);
    }
  },

  // Reexport permission methods for convenience
  getPermissions: permissionService.getPermissions,
  getPermissionsByCategories: permissionService.getPermissionsByCategories,
  getRolePermissions: permissionService.getRolePermissions,

  async createRole(role: Partial<Role>): Promise<Role | null> {
    try {
      console.log(`Creating new role: ${role.name}`);
      
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

      if (error) {
        console.error('Supabase error when creating role:', error);
        throw new Error(`Failed to create role: ${error.message}`);
      }
      
      if (!data) {
        console.warn('No role data returned after creation');
        throw new Error('Failed to create role: No data returned');
      }
      
      // If permissions are provided, assign them to the role
      if (role.permissions && role.permissions.length > 0) {
        await assignPermissionsToRole(data.id, role.permissions);
      }
      
      console.log(`Successfully created role: ${role.name} with ID ${data.id}`);
      return data as Role;
    } catch (error: any) {
      console.error(`Error in createRole(${role.name}):`, error);
      throw new Error(`Failed to create role: ${error.message || 'Unknown error'}`);
    }
  },

  async updateRole(id: string, updates: Partial<Role>): Promise<Role | null> {
    try {
      console.log(`Updating role ${id} with name: ${updates.name}`);
      
      // Check if a role with this name already exists (excluding this role)
      if (updates.name) {
        const roleExists = await checkRoleNameExists(updates.name, id);
        if (roleExists) {
          toast.error(`A role with name "${updates.name}" already exists`);
          return null;
        }
      }
      
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

      if (error) {
        console.error(`Supabase error when updating role ${id}:`, error);
        throw new Error(`Failed to update role: ${error.message}`);
      }
      
      if (!data) {
        console.warn(`No role data returned after updating ${id}`);
        throw new Error('Failed to update role: No data returned');
      }
      
      // If permissions are provided, update them
      if (updates.permissions) {
        // First, remove all existing permissions for this role
        await clearRolePermissions(id);
        
        // Then, assign the new permissions
        await assignPermissionsToRole(id, updates.permissions);
      }
      
      console.log(`Successfully updated role ${id}`);
      return data as Role;
    } catch (error: any) {
      console.error(`Error in updateRole(${id}):`, error);
      throw new Error(`Failed to update role: ${error.message || 'Unknown error'}`);
    }
  },

  async deleteRole(id: string): Promise<boolean> {
    try {
      console.log(`Deleting role ${id}`);
      
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Supabase error when deleting role ${id}:`, error);
        throw new Error(`Failed to delete role: ${error.message}`);
      }
      
      console.log(`Successfully deleted role ${id}`);
      return true;
    } catch (error: any) {
      console.error(`Error in deleteRole(${id}):`, error);
      throw new Error(`Failed to delete role: ${error.message || 'Unknown error'}`);
    }
  },
  
  // Re-export user role methods for convenience
  getUsersWithRole: userRoleService.getUsersWithRole,
  assignRoleToUser: userRoleService.assignRoleToUser,
  removeRoleFromUser: userRoleService.removeRoleFromUser
};

export default roleService;
