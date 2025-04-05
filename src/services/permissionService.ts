
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
      
      // Use the specialized RPC function for getting permissions by category
      const { data, error } = await supabase
        .rpc('get_permissions_by_category');
        
      if (error) {
        console.error('Supabase error when fetching permissions by categories:', error);
        throw new Error(`Failed to load permission categories: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn('No categories data returned from get_permissions_by_category RPC');
        return [];
      }
      
      // Transform the data to match the expected format
      const result = data.map((item: any) => ({
        name: item.category || 'General',
        permissions: Array.isArray(item.permissions) ? item.permissions : []
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
  }
};

export default permissionService;
