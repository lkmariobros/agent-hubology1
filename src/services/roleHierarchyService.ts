import { supabase } from '@/lib/supabase';
import { Role } from '@/types/role';
import { RoleHierarchy, RoleLevel, ExtendedRole } from '@/types/roleHierarchy';
import { toast } from 'sonner';

/**
 * Service for managing role hierarchy and progression
 */
export const roleHierarchyService = {
  /**
   * Get all role hierarchy relationships
   */
  async getRoleHierarchy(): Promise<RoleHierarchy[]> {
    try {
      const { data, error } = await supabase
        .from('role_hierarchy')
        .select(`
          *,
          parent_role:parent_role_id(id, name, description),
          child_role:child_role_id(id, name, description)
        `);

      if (error) {
        console.error('Error fetching role hierarchy:', error);
        throw new Error(`Failed to load role hierarchy: ${error.message}`);
      }

      return data || [];
    } catch (error: any) {
      console.error('Error in getRoleHierarchy():', error);
      throw new Error(`Failed to load role hierarchy: ${error.message || 'Unknown error'}`);
    }
  },

  /**
   * Get all role levels for agent progression
   */
  async getRoleLevels(): Promise<RoleLevel[]> {
    try {
      const { data, error } = await supabase
        .from('role_levels')
        .select(`
          *,
          role:role_id(id, name, description)
        `)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching role levels:', error);
        throw new Error(`Failed to load role levels: ${error.message}`);
      }

      return data || [];
    } catch (error: any) {
      console.error('Error in getRoleLevels():', error);
      throw new Error(`Failed to load role levels: ${error.message || 'Unknown error'}`);
    }
  },

  /**
   * Add a parent-child relationship between roles
   */
  async addRoleRelationship(parentRoleId: string, childRoleId: string): Promise<boolean> {
    try {
      // Prevent circular references manually (the DB has a constraint, but let's check here too)
      if (parentRoleId === childRoleId) {
        toast.error('A role cannot be its own parent');
        return false;
      }

      // Check if this would create a circular reference (parent becoming a child of its own child)
      const { data: descendants, error: descendantsError } = await supabase
        .rpc('get_role_descendants', { role_id: childRoleId });

      if (descendantsError) {
        console.error('Error checking role descendants:', descendantsError);
        throw new Error(`Failed to check for circular references: ${descendantsError.message}`);
      }

      if (descendants?.some(d => d.descendant_id === parentRoleId)) {
        toast.error('This would create a circular reference in the role hierarchy');
        return false;
      }

      // Add the relationship
      const { error } = await supabase
        .from('role_hierarchy')
        .insert({
          parent_role_id: parentRoleId,
          child_role_id: childRoleId
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This role relationship already exists');
        } else {
          console.error('Error creating role relationship:', error);
          toast.error(`Failed to create role relationship: ${error.message}`);
        }
        return false;
      }

      toast.success('Role relationship added successfully');
      return true;
    } catch (error: any) {
      console.error('Error in addRoleRelationship():', error);
      toast.error(`Failed to add role relationship: ${error.message || 'Unknown error'}`);
      return false;
    }
  },

  /**
   * Remove a parent-child relationship between roles
   */
  async removeRoleRelationship(parentRoleId: string, childRoleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('role_hierarchy')
        .delete()
        .eq('parent_role_id', parentRoleId)
        .eq('child_role_id', childRoleId);

      if (error) {
        console.error('Error removing role relationship:', error);
        toast.error(`Failed to remove role relationship: ${error.message}`);
        return false;
      }

      toast.success('Role relationship removed successfully');
      return true;
    } catch (error: any) {
      console.error('Error in removeRoleRelationship():', error);
      toast.error(`Failed to remove role relationship: ${error.message || 'Unknown error'}`);
      return false;
    }
  },

  /**
   * Get a role with its parent and child roles (hierarchy information)
   */
  async getRoleWithHierarchy(roleId: string): Promise<ExtendedRole | null> {
    try {
      // Get the basic role information
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        throw new Error(`Failed to load role: ${roleError.message}`);
      }

      if (!role) {
        return null;
      }

      // Get parent roles
      const { data: ancestors, error: ancestorsError } = await supabase
        .rpc('get_role_ancestors', { role_id: roleId });

      if (ancestorsError) {
        console.error('Error fetching role ancestors:', ancestorsError);
        throw new Error(`Failed to load role parents: ${ancestorsError.message}`);
      }

      // Get parent role details
      let parentRoles: Role[] = [];
      if (ancestors && ancestors.length > 0) {
        const parentIds = ancestors.map(a => a.ancestor_id);
        const { data: parents, error: parentsError } = await supabase
          .from('roles')
          .select('*')
          .in('id', parentIds);

        if (parentsError) {
          console.error('Error fetching parent roles:', parentsError);
        } else {
          parentRoles = parents || [];
        }
      }

      // Get child roles
      const { data: descendants, error: descendantsError } = await supabase
        .rpc('get_role_descendants', { role_id: roleId });

      if (descendantsError) {
        console.error('Error fetching role descendants:', descendantsError);
        throw new Error(`Failed to load role children: ${descendantsError.message}`);
      }

      // Get child role details
      let childRoles: Role[] = [];
      if (descendants && descendants.length > 0) {
        const childIds = descendants.map(d => d.descendant_id);
        const { data: children, error: childrenError } = await supabase
          .from('roles')
          .select('*')
          .in('id', childIds);

        if (childrenError) {
          console.error('Error fetching child roles:', childrenError);
        } else {
          childRoles = children || [];
        }
      }

      // Get all permissions including inherited
      const { data: permissionIds, error: permissionsError } = await supabase
        .rpc('get_role_permissions_with_inheritance', { role_id: roleId });

      if (permissionsError) {
        console.error('Error fetching role permissions with inheritance:', permissionsError);
        throw new Error(`Failed to load role permissions: ${permissionsError.message}`);
      }

      // Get permission details
      let inheritedPermissions: any[] = [];
      if (permissionIds && permissionIds.length > 0) {
        const ids = permissionIds.map(p => p.permission_id);
        const { data: permissions, error: permDetailsError } = await supabase
          .from('permissions')
          .select('*')
          .in('id', ids);

        if (permDetailsError) {
          console.error('Error fetching permission details:', permDetailsError);
        } else {
          inheritedPermissions = permissions || [];
        }
      }

      // Get role level if this is an agent role
      let level: RoleLevel | undefined;
      if (role.name === 'agent') {
        const { data: roleLevel, error: levelError } = await supabase
          .from('role_levels')
          .select('*')
          .eq('role_id', roleId)
          .single();

        if (!levelError && roleLevel) {
          level = roleLevel;
        }
      }

      // Combine all data into an extended role
      return {
        ...role,
        parent_roles: parentRoles,
        child_roles: childRoles,
        inherited_permissions: inheritedPermissions,
        level
      };
    } catch (error: any) {
      console.error('Error in getRoleWithHierarchy():', error);
      throw new Error(`Failed to load role hierarchy details: ${error.message || 'Unknown error'}`);
    }
  },

  /**
   * Update a user's agent level based on sales performance
   */
  async updateAgentLevel(profileId: string, totalSales: number): Promise<boolean> {
    try {
      // Get all role levels to determine the appropriate level
      const { data: levels, error: levelsError } = await supabase
        .from('role_levels')
        .select('*')
        .order('min_sales_value', { ascending: false });

      if (levelsError) {
        console.error('Error fetching role levels:', levelsError);
        throw new Error(`Failed to load role levels: ${levelsError.message}`);
      }

      if (!levels || levels.length === 0) {
        throw new Error('No role levels found');
      }

      // Find the appropriate level based on sales value
      let appropriateLevel: RoleLevel | null = null;
      for (const level of levels) {
        if (totalSales >= level.min_sales_value) {
          appropriateLevel = level;
          break;
        }
      }

      if (!appropriateLevel) {
        // If no level found (shouldn't happen), use the lowest level
        appropriateLevel = levels[levels.length - 1];
      }

      // Update the agent's level
      const { error: updateError } = await supabase
        .from('agent_details')
        .update({
          level: appropriateLevel.name,
          role_level_id: appropriateLevel.id,
          total_sales: totalSales,
          next_level_threshold: appropriateLevel.next_level_threshold,
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', profileId);

      if (updateError) {
        console.error('Error updating agent level:', updateError);
        throw new Error(`Failed to update agent level: ${updateError.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in updateAgentLevel():', error);
      throw new Error(`Failed to update agent level: ${error.message || 'Unknown error'}`);
    }
  },

  /**
   * Calculate progression to next level for an agent
   */
  async calculateAgentProgression(agentId: string): Promise<{
    currentLevel: RoleLevel,
    nextLevel: RoleLevel | null,
    progress: number,
    totalSales: number,
    salesTarget: number,
    nextLevelThreshold: number | null
  } | null> {
    try {
      // Get the agent's details
      const { data: agentDetails, error: agentError } = await supabase
        .from('agent_details')
        .select(`
          *,
          role_level:role_level_id(*)
        `)
        .eq('profile_id', agentId)
        .single();

      if (agentError) {
        console.error('Error fetching agent details:', agentError);
        throw new Error(`Failed to load agent details: ${agentError.message}`);
      }

      if (!agentDetails) {
        return null;
      }

      // Get all role levels
      const { data: levels, error: levelsError } = await supabase
        .from('role_levels')
        .select('*')
        .order('order_index', { ascending: true });

      if (levelsError) {
        console.error('Error fetching role levels:', levelsError);
        throw new Error(`Failed to load role levels: ${levelsError.message}`);
      }

      if (!levels || levels.length === 0) {
        throw new Error('No role levels found');
      }

      // Get current level
      const currentLevel = agentDetails.role_level || levels.find(l => l.name === agentDetails.level) || levels[0];
      
      // Get next level
      const nextLevelIndex = levels.findIndex(l => l.id === currentLevel.id) + 1;
      const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
      
      // Calculate progress
      let progress = 0;
      if (currentLevel.next_level_threshold && agentDetails.total_sales > 0) {
        progress = Math.min(
          Math.round((agentDetails.total_sales / currentLevel.next_level_threshold) * 100),
          100
        );
      } else if (!currentLevel.next_level_threshold) {
        // At max level
        progress = 100;
      }

      return {
        currentLevel,
        nextLevel,
        progress,
        totalSales: agentDetails.total_sales,
        salesTarget: agentDetails.sales_target,
        nextLevelThreshold: currentLevel.next_level_threshold
      };
    } catch (error: any) {
      console.error('Error in calculateAgentProgression():', error);
      throw new Error(`Failed to calculate agent progression: ${error.message || 'Unknown error'}`);
    }
  }
};

export default roleHierarchyService;