
import { supabase } from '@/lib/supabase';
import { Permission, PermissionCategory } from '@/types/role';
import { toast } from 'sonner';

export const permissionService = {
  async getPermissions(): Promise<Permission[]> {
    try {
      console.log('Fetching permissions from Supabase');
      const { data, error } = await supabase
        .rpc('get_permissions');

      if (error) {
        console.error('Supabase error when fetching permissions:', error);
        throw new Error(`Failed to load permissions: ${error.message}`);
      }
      
      if (!data) {
        console.warn('No permissions data returned from Supabase');
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
      console.log('Fetching permissions by categories from Supabase');
      
      // Try to use the RPC function first
      const { data: categoryData, error: categoryError } = await supabase
        .rpc('get_permissions_by_category');
        
      if (!categoryError && categoryData) {
        // Transform the data to match the expected format
        const result = categoryData.map((item: any) => ({
          name: item.category || 'General',
          permissions: Array.isArray(item.permissions) ? item.permissions : []
        }));
        
        console.log(`Successfully grouped permissions into ${result.length} categories via RPC`);
        return result;
      }
      
      // Fallback to direct query if RPC fails
      console.log('Falling back to direct permission query');
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
        console.warn('No permissions data returned from Supabase for categories');
        return [];
      }
      
      // Group permissions by category
      const categories: Record<string, Permission[]> = {};
      
      data.forEach((permission: Permission) => {
        const category = permission.category || 'General';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(permission);
      });
      
      // Transform into PermissionCategory array
      const result = Object.entries(categories).map(([name, permissions]) => ({
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
  }
};

export default permissionService;
