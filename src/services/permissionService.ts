
import { supabase } from '@/lib/supabase';
import { Permission, PermissionCategory } from '@/types/role';
import { toast } from 'sonner';

export const permissionService = {
  async getPermissions(): Promise<Permission[]> {
    try {
      console.log('Fetching permissions using get_permissions RPC');
      const { data, error } = await supabase
        .rpc('get_permissions');

      if (error) {
        console.error('Supabase error when fetching permissions:', error);
        throw new Error(`Failed to load permissions: ${error.message}`);
      }
      
      if (!data) {
        console.warn('No permissions data returned from get_permissions RPC');
        return [];
      }
      
      console.log(`Successfully fetched ${data.length} permissions`);
      return data as Permission[];
    } catch (error: any) {
      console.error('Error in getPermissions():', error);
      throw new Error(`Failed to load permissions: ${error.message || 'Unknown error'}`);
    }
  },
  
  async getPermissionsByCategories(): Promise<PermissionCategory[]> {
    try {
      console.log('Fetching permissions by categories using get_permissions_by_category RPC');
      
      // Use direct query instead of RPC function if there are issues with the RPC
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category')
        .order('name');
        
      if (error) {
        console.error('Supabase error when fetching permissions by categories:', error);
        throw new Error(`Failed to load permission categories: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn('No permissions data returned from query');
        return [];
      }
      
      // Group permissions by category
      const categoriesMap = new Map<string, Permission[]>();
      
      data.forEach(permission => {
        const category = permission.category || 'General';
        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, []);
        }
        categoriesMap.get(category)?.push(permission);
      });
      
      // Transform to expected format
      const result = Array.from(categoriesMap.entries()).map(([name, permissions]) => ({
        name,
        permissions
      }));
      
      console.log(`Successfully grouped permissions into ${result.length} categories`);
      return result;
    } catch (error: any) {
      console.error('Error in getPermissionsByCategories():', error);
      throw new Error(`Failed to load permission categories: ${error.message || 'Unknown error'}`);
    }
  },

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    try {
      console.log(`Fetching permissions for role ${roleId}`);
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          permission:permission_id(*)
        `)
        .eq('role_id', roleId);

      if (error) {
        console.error(`Supabase error when fetching permissions for role ${roleId}:`, error);
        throw new Error(`Failed to load role permissions: ${error.message}`);
      }
      
      if (!data) {
        console.warn(`No permission data returned for role ${roleId}`);
        return [];
      }
      
      // Transform the nested permissions array
      const permissions = data.map((rp: any) => rp.permission);
      console.log(`Successfully fetched ${permissions.length} permissions for role ${roleId}`);
      return permissions;
    } catch (error: any) {
      console.error(`Error in getRolePermissions(${roleId}):`, error);
      throw new Error(`Failed to load role permissions: ${error.message || 'Unknown error'}`);
    }
  },
  
  async updateRolePermissions(roleId: string, permissions: Permission[]): Promise<boolean> {
    try {
      console.log(`Updating permissions for role ${roleId}`);
      
      // First, delete all existing role permissions
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);
        
      if (deleteError) {
        console.error(`Error deleting existing permissions for role ${roleId}:`, deleteError);
        throw new Error(`Failed to update role permissions: ${deleteError.message}`);
      }
      
      // Get selected permissions
      const selectedPermissions = permissions.filter(p => p.selected && p.id);
      
      if (selectedPermissions.length === 0) {
        console.log(`No permissions selected for role ${roleId}`);
        return true;
      }
      
      // Insert new role permissions
      const rolePermissions = selectedPermissions.map(p => ({
        role_id: roleId,
        permission_id: p.id
      }));
      
      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(rolePermissions);
        
      if (insertError) {
        console.error(`Error inserting new permissions for role ${roleId}:`, insertError);
        throw new Error(`Failed to update role permissions: ${insertError.message}`);
      }
      
      console.log(`Successfully updated permissions for role ${roleId}`);
      return true;
    } catch (error: any) {
      console.error(`Error in updateRolePermissions(${roleId}):`, error);
      throw new Error(`Failed to update role permissions: ${error.message || 'Unknown error'}`);
    }
  }
};

export default permissionService;
