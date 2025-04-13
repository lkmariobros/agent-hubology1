import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import roleHierarchyService from '@/services/roleHierarchyService';
import { RoleHierarchy, RoleLevel, ExtendedRole } from '@/types/roleHierarchy';
import { Role } from '@/types/role';
import { useAuth } from './useAuth';

/**
 * Hook for managing role hierarchy
 */
export function useRoleHierarchy() {
  const queryClient = useQueryClient();
  const { isAuthenticated, activeRole, isAdmin } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  
  const isAdminMode = isAuthenticated && (isAdmin || activeRole === 'admin');
  
  // Fetch all role hierarchy relationships
  const {
    data: hierarchyData = [],
    isLoading: isLoadingHierarchy,
    error: hierarchyError,
    refetch: refetchHierarchy
  } = useQuery({
    queryKey: ['roleHierarchy'],
    queryFn: roleHierarchyService.getRoleHierarchy,
    enabled: isAdminMode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch all role levels
  const {
    data: roleLevels = [],
    isLoading: isLoadingLevels,
    error: levelsError,
    refetch: refetchLevels
  } = useQuery({
    queryKey: ['roleLevels'],
    queryFn: roleHierarchyService.getRoleLevels,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch detailed role with hierarchy info
  const {
    data: extendedRole,
    isLoading: isLoadingExtendedRole,
    error: extendedRoleError,
    refetch: refetchExtendedRole
  } = useQuery({
    queryKey: ['roleWithHierarchy', selectedRoleId],
    queryFn: () => selectedRoleId ? roleHierarchyService.getRoleWithHierarchy(selectedRoleId) : null,
    enabled: !!selectedRoleId && isAdminMode,
  });

  // Add a role relationship mutation
  const addRelationshipMutation = useMutation({
    mutationFn: ({ parentId, childId }: { parentId: string; childId: string }) =>
      roleHierarchyService.addRoleRelationship(parentId, childId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleHierarchy'] });
      if (selectedRoleId) {
        queryClient.invalidateQueries({ queryKey: ['roleWithHierarchy', selectedRoleId] });
      }
    }
  });

  // Remove a role relationship mutation
  const removeRelationshipMutation = useMutation({
    mutationFn: ({ parentId, childId }: { parentId: string; childId: string }) =>
      roleHierarchyService.removeRoleRelationship(parentId, childId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleHierarchy'] });
      if (selectedRoleId) {
        queryClient.invalidateQueries({ queryKey: ['roleWithHierarchy', selectedRoleId] });
      }
    }
  });

  // Update agent level mutation
  const updateAgentLevelMutation = useMutation({
    mutationFn: ({ profileId, totalSales }: { profileId: string; totalSales: number }) =>
      roleHierarchyService.updateAgentLevel(profileId, totalSales),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentDetails'] });
    }
  });

  // Build the role hierarchy tree structure
  const hierarchyTree = useCallback(() => {
    const roles = queryClient.getQueryData<Role[]>(['roles']) || [];
    const hierarchy = hierarchyData || [];
    
    // Create a map of child roles for each parent
    const childrenMap: Record<string, string[]> = {};
    hierarchy.forEach(rel => {
      if (!childrenMap[rel.parent_role_id]) {
        childrenMap[rel.parent_role_id] = [];
      }
      childrenMap[rel.parent_role_id].push(rel.child_role_id);
    });
    
    // Create a map of parent roles for each child
    const parentMap: Record<string, string[]> = {};
    hierarchy.forEach(rel => {
      if (!parentMap[rel.child_role_id]) {
        parentMap[rel.child_role_id] = [];
      }
      parentMap[rel.child_role_id].push(rel.parent_role_id);
    });
    
    // Find root roles (roles without parents)
    const rootRoleIds = roles
      .filter(role => !parentMap[role.id] || parentMap[role.id].length === 0)
      .map(role => role.id);
    
    // Build tree nodes recursively
    const buildTreeNode = (roleId: string, depth = 0, path: string[] = []): any => {
      const role = roles.find(r => r.id === roleId);
      if (!role) return null;
      
      // Prevent circular references
      if (path.includes(roleId)) {
        return {
          ...role,
          children: [],
          depth,
          circular: true
        };
      }
      
      const children = childrenMap[roleId] || [];
      return {
        ...role,
        children: children
          .map(childId => buildTreeNode(childId, depth + 1, [...path, roleId]))
          .filter(Boolean),
        depth
      };
    };
    
    return rootRoleIds.map(id => buildTreeNode(id)).filter(Boolean);
  }, [hierarchyData, queryClient]);

  // Get a flattened list of roles with their depths in the hierarchy
  const flattenedHierarchy = useCallback(() => {
    const tree = hierarchyTree();
    const flattened: Array<Role & { depth: number }> = [];
    
    const flatten = (nodes: any[], depth = 0) => {
      nodes.forEach(node => {
        flattened.push({ ...node, depth });
        if (node.children && node.children.length > 0) {
          flatten(node.children, depth + 1);
        }
      });
    };
    
    flatten(tree);
    return flattened;
  }, [hierarchyTree]);

  // Add a relationship between roles
  const addRoleRelationship = useCallback((parentId: string, childId: string) => {
    return addRelationshipMutation.mutateAsync({ parentId, childId });
  }, [addRelationshipMutation]);

  // Remove a relationship between roles
  const removeRoleRelationship = useCallback((parentId: string, childId: string) => {
    return removeRelationshipMutation.mutateAsync({ parentId, childId });
  }, [removeRelationshipMutation]);

  // Refresh all data
  const refreshAll = useCallback(() => {
    refetchHierarchy();
    refetchLevels();
    if (selectedRoleId) {
      refetchExtendedRole();
    }
  }, [refetchHierarchy, refetchLevels, refetchExtendedRole, selectedRoleId]);

  // Update an agent's level based on sales
  const updateAgentLevel = useCallback((profileId: string, totalSales: number) => {
    return updateAgentLevelMutation.mutateAsync({ profileId, totalSales });
  }, [updateAgentLevelMutation]);

  // Calculate agent progression
  const calculateAgentProgression = useCallback((agentId: string) => {
    return roleHierarchyService.calculateAgentProgression(agentId);
  }, []);

  // Get the next agent level info
  const getNextLevelInfo = useCallback((currentLevelName: string) => {
    const levelIndex = roleLevels.findIndex(level => level.name === currentLevelName);
    if (levelIndex < 0 || levelIndex >= roleLevels.length - 1) {
      return null;
    }
    return roleLevels[levelIndex + 1];
  }, [roleLevels]);

  return {
    hierarchyData,
    roleLevels,
    extendedRole,
    selectedRoleId,
    setSelectedRoleId,
    
    isLoading: isLoadingHierarchy || isLoadingLevels || isLoadingExtendedRole,
    error: hierarchyError || levelsError || extendedRoleError,
    
    hierarchyTree,
    flattenedHierarchy,
    addRoleRelationship,
    removeRoleRelationship,
    updateAgentLevel,
    calculateAgentProgression,
    getNextLevelInfo,
    refreshAll,
    
    isAdminMode
  };
}

export default useRoleHierarchy;