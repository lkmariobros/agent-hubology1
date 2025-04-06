
import { supabase } from '@/lib/supabase';
import { Permission, PermissionCategory } from '@/types/role';
import { toast } from 'sonner';

export const permissionService = {
  async getPermissions(): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Permission[] || [];
    } catch (error: any) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
      return [];
    }
  },
  
  async getPermissionsByCategories(): Promise<PermissionCategory[]> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category')
        .order('name');

      if (error) throw error;
      
      // Group permissions by category
      const categories: Record<string, Permission[]> = {};
      (data || []).forEach((permission: Permission) => {
        const category = permission.category || 'General';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(permission);
      });
      
      // Transform into PermissionCategory array
      return Object.entries(categories).map(([name, permissions]) => ({
        name,
        permissions
      }));
    } catch (error: any) {
      console.error('Error fetching permissions by categories:', error);
      toast.error('Failed to load permissions');
      return [];
    }
  },

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          permissions:permission_id(*)
        `)
        .eq('role_id', roleId);

      if (error) throw error;
      
      // Transform the nested permissions array
      return (data || []).map((rp: any) => rp.permissions);
    } catch (error: any) {
      console.error(`Error fetching permissions for role ${roleId}:`, error);
      toast.error('Failed to load role permissions');
      return [];
    }
  }
};

export default permissionService;
