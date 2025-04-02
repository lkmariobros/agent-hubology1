
import { supabase } from '@/lib/supabase';
import { Role, Permission } from '@/types/role';
import { toast } from 'sonner';
import { safeQueryExecution } from './dbHelpers';

/**
 * Utility functions for role-related operations
 */

export const checkRoleNameExists = async (name: string, excludeId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from('roles')
      .select('id, name')
      .eq('name', name);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data } = await query;
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking role name:', error);
    return false;
  }
};

export const assignPermissionsToRole = async (
  roleId: string, 
  permissions: Permission[]
): Promise<boolean> => {
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
};

export const clearRolePermissions = async (roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error clearing role permissions:', error);
    return false;
  }
};

export const formatRoleData = (data: any[]): Role[] => {
  return (data || []).map(role => ({
    ...role,
    users_count: role.users_count || 0
  }));
};
