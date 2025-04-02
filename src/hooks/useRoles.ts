
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/roleService';
import { Role, Permission, PermissionCategory } from '@/types/role';

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
    isLoading: isLoadingPermissions
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: roleService.getPermissions,
    enabled: false // Only load when needed
  });

  // Fetch permission categories
  const {
    data: permissionCategories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['permissionCategories'],
    queryFn: roleService.getPermissionsByCategories,
    enabled: false // Only load when needed
  });

  // Create a new role
  const createMutation = useMutation({
    mutationFn: roleService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });

  // Update a role
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Role> }) => 
      roleService.updateRole(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });

  // Delete a role
  const deleteMutation = useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
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
    return roleService.getRolePermissions(roleId);
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
    createRole,
    updateRole,
    deleteRole,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
