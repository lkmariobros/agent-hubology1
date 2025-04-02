
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/roleService';
import { Role, Permission, PermissionCategory } from '@/types/role';
import { toast } from 'sonner';

export function useRoles() {
  const queryClient = useQueryClient();
  
  // Fetch all roles
  const { 
    data: roles = [],
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getRoles
  });

  // Fetch permissions
  const {
    data: permissions = [],
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: roleService.getPermissions,
    enabled: true // Always load permissions
  });

  // Fetch permission categories
  const {
    data: permissionCategories = [],
    isLoading: isLoadingCategories,
    refetch: refetchPermissionCategories
  } = useQuery({
    queryKey: ['permissionCategories'],
    queryFn: roleService.getPermissionsByCategories,
    enabled: true // Always load permission categories
  });

  // Create a new role
  const createMutation = useMutation({
    mutationFn: roleService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create role: ${error.message || "Unknown error"}`);
    }
  });

  // Update a role
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Role> }) => 
      roleService.updateRole(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update role: ${error.message || "Unknown error"}`);
    }
  });

  // Delete a role
  const deleteMutation = useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete role: ${error.message || "Unknown error"}`);
    }
  });

  // Create a new role
  const createRole = useCallback((role: Partial<Role>) => {
    return createMutation.mutateAsync(role);
  }, [createMutation]);

  // Update a role
  const updateRole = useCallback((id: string, updates: Partial<Role>) => {
    return updateMutation.mutateAsync({ id, updates });
  }, [updateMutation]);

  // Delete a role
  const deleteRole = useCallback((id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  // Load permissions for a role
  const loadRolePermissions = useCallback(async (roleId: string) => {
    try {
      const rolePermissions = await roleService.getRolePermissions(roleId);
      return rolePermissions;
    } catch (error) {
      console.error('Error loading role permissions:', error);
      toast.error("Failed to load role permissions");
      return [];
    }
  }, []);

  return {
    roles,
    isLoading,
    error,
    refetch,
    permissions,
    permissionCategories,
    isLoadingPermissions,
    isLoadingCategories,
    loadRolePermissions,
    refetchPermissions,
    refetchPermissionCategories,
    createRole,
    updateRole,
    deleteRole,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
