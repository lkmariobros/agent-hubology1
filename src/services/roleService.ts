
import { supabase } from '@/lib/supabase';
import { Role, Permission, PermissionCategory } from '@/types/role';
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
      
      // If permissions are provided, assign them to the role
      if (role.permissions && role.permissions.length > 0) {
        await this.assignPermissionsToRole(data.id, role.permissions);
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
        await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', id);
        
        // Then, assign the new permissions
        await this.assignPermissionsToRole(id, updates.permissions);
      }
      
      toast.success(`Role "${updates.name}" updated successfully`);
      return data as Role;
    } catch (error: any) {
      console.error(`Error updating role ${id}:`, error);
      toast.error(error.message || 'Failed to update role');
      return null;
    }
  },

  async assignPermissionsToRole(roleId: string, permissions: Permission[]): Promise<boolean> {
    try {
      // Filter out permissions that don't have IDs
      const validPermissions = permissions.filter(p => p.id && p.selected);
      
      if (validPermissions.length === 0) return true;
      
      // Create the role-permission relationships
      const rolePermissions = validPermissions.map(permission => ({
        role_id: roleId,
        permission_id: permission.id
      }));
      
      const { error } = await supabase
        .from('role_permissions')
        .insert(rolePermissions);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error assigning permissions to role:', error);
      toast.error('Failed to assign permissions to role');
      return false;
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
