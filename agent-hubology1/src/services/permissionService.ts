
import { supabase } from '@/lib/supabase';
import { Permission, PermissionCategory } from '@/types/role';
import { toast } from 'sonner';
import { useSentry } from '@/hooks/useSentry';
import { executeRPC, safeQueryExecution, safeMutationExecution } from '@/utils/dbHelpers';

// Interface to match the structure returned by Supabase for role permissions
interface RolePermissionResponse {
  permission: Permission;
}

export const permissionService = {
  async getPermissions(): Promise<Permission[]> {
    try {
      console.log('Fetching permissions using get_permissions_simple RPC');
      const data = await executeRPC<Permission[]>('get_permissions_simple');
      
      console.log(`Successfully fetched ${data.length} permissions`);
      return data;
    } catch (error: any) {
      console.error('Error in getPermissions():', error);
      throw new Error(`Failed to load permissions: ${error.message || 'Unknown error'}`);
    }
  },
  
  async getPermissionsByCategories(): Promise<PermissionCategory[]> {
    try {
      console.log('Fetching permissions by categories');
      
      // First get all permissions
      const permissions = await this.getPermissions();
      
      // Group permissions by category
      const categoriesMap = new Map<string, Permission[]>();
      
      permissions.forEach(permission => {
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
      
      const rolePermissions = await safeQueryExecution<RolePermissionResponse[]>(
        `getRolePermissions(${roleId})`,
        async () => {
          const query = supabase
            .from('role_permissions')
            .select(`
              permission:permission_id(*)
            `)
            .eq('role_id', roleId);
          
          return await query;
        }
      );
      
      // Transform the nested permissions array
      const permissions = rolePermissions.map(rp => rp.permission);
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
      await safeMutationExecution(
        `deleteRolePermissions(${roleId})`,
        async () => {
          const query = supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', roleId);
          
          return await query;
        }
      );
      
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
      
      await safeMutationExecution(
        `insertRolePermissions(${roleId})`,
        async () => {
          const query = supabase
            .from('role_permissions')
            .insert(rolePermissions);
          
          return await query;
        }
      );
      
      console.log(`Successfully updated permissions for role ${roleId}`);
      return true;
    } catch (error: any) {
      console.error(`Error in updateRolePermissions(${roleId}):`, error);
      throw new Error(`Failed to update role permissions: ${error.message || 'Unknown error'}`);
    }
  }
};

export default permissionService;
