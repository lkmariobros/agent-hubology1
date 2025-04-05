import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/roleService';
import { Role, Permission, PermissionCategory } from '@/types/role';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useRoles() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, activeRole, isAdmin } = useAuth();
  
  // Fetch all roles
  const { 
    data: roles = [],
    isLoading,
    error: rolesError,
    refetch: refetchRoles,
    status: rolesStatus
  } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getRoles,
    enabled: isAuthenticated && (isAdmin || activeRole === 'admin'),
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: any) => {
        console.error('Error fetching roles:', error);
        toast.error(`Failed to load roles: ${error.message || 'Unknown error'}`);
      }
    }
  });

  // Fetch permissions
  const {
    data: permissions = [],
    isLoading: isLoadingPermissions,
    error: permissionsError,
    refetch: refetchPermissions,
    status: permissionsStatus
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: roleService.getPermissions,
    enabled: isAuthenticated && (isAdmin || activeRole === 'admin'),
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      onError: (error: any) => {
        console.error('Error fetching permissions:', error);
        toast.error(`Failed to load permissions: ${error.message || 'Unknown error'}`);
      }
    }
  });

  // Fetch permission categories
  const {
    data: permissionCategories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchPermissionCategories,
    status: categoriesStatus
  } = useQuery({
    queryKey: ['permissionCategories'],
    queryFn: roleService.getPermissionsByCategories,
    enabled: isAuthenticated && (isAdmin || activeRole === 'admin'),
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      onError: (error: any) => {
        console.error('Error fetching permission categories:', error);
        toast.error(`Failed to load permission categories: ${error.message || 'Unknown error'}`);
      }
    }
  });

  // Create a new role
  const createMutation = useMutation({
    mutationFn: roleService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      console.error('Error creating role:', error);
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
      console.error('Error updating role:', error);
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
      console.error('Error deleting role:', error);
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

  // Helper to determine if we have any errors
  const error = rolesError || permissionsError || categoriesError;

  // Retry all queries at once
  const refetchAll = useCallback(() => {
    refetchRoles();
    refetchPermissions();
    refetchPermissionCategories();
  }, [refetchRoles, refetchPermissions, refetchPermissionCategories]);

  // Refresh data when auth status changes
  useEffect(() => {
    if (isAuthenticated && (isAdmin || activeRole === 'admin')) {
      refetchAll();
    }
  }, [isAuthenticated, isAdmin, activeRole, refetchAll]);

  return {
    roles,
    isLoading,
    error,
    refetch: refetchAll,
    permissions,
    permissionCategories,
    isLoadingPermissions,
    isLoadingCategories,
    loadRolePermissions: roleService.getRolePermissions,
    refetchPermissions,
    refetchPermissionCategories,
    createRole: roleService.createRole,
    updateRole: roleService.updateRole,
    deleteRole: roleService.deleteRole,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    rolesStatus,
    permissionsStatus,
    categoriesStatus
  };
}
