
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/roleService';
import { Role } from '@/types/role';

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

  return {
    roles,
    isLoading,
    error,
    refetch,
    createRole,
    updateRole,
    deleteRole,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
