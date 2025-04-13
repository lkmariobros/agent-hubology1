import { UserRole } from '@/types/auth';
import { Role } from '@/types/role';
import { roleService } from '@/services/roleService';

/**
 * Utility functions for managing user roles with Clerk integration
 */

/**
 * Synchronize roles between Clerk and the database
 * @param userId The Clerk user ID
 * @param clerkRoles The roles from Clerk user metadata
 */
export const syncUserRoles = async (userId: string, clerkRoles: UserRole[]) => {
  try {
    // Get all roles from the database
    const allRoles = await roleService.getRoles();
    
    // Get current user roles from the database
    const userRolesData = await getUserRolesFromDB(userId);
    const userRoleIds = userRolesData.map(ur => ur.role_id);
    
    // Find role objects that match the Clerk roles
    const rolesByName = allRoles.reduce((acc, role) => {
      acc[role.name.toLowerCase() as UserRole] = role;
      return acc;
    }, {} as Record<UserRole, Role>);
    
    // Determine which roles to add and which to remove
    const rolesToAdd: Role[] = [];
    const rolesToKeep: string[] = [];
    
    // Find roles to add based on Clerk roles
    for (const roleName of clerkRoles) {
      const role = rolesByName[roleName.toLowerCase() as UserRole];
      if (role) {
        if (userRoleIds.includes(role.id)) {
          // Already has the role, keep it
          rolesToKeep.push(role.id);
        } else {
          // Doesn't have the role yet, add it
          rolesToAdd.push(role);
        }
      }
    }
    
    // Find roles to remove (roles in DB but not in Clerk)
    const rolesToRemove = userRoleIds.filter(roleId => !rolesToKeep.includes(roleId));
    
    // Apply the changes
    const promises = [
      // Add new roles
      ...rolesToAdd.map(role => roleService.assignRoleToUser(userId, role.id)),
      // Remove old roles
      ...rolesToRemove.map(roleId => roleService.removeRoleFromUser(userId, roleId))
    ];
    
    await Promise.all(promises);
    
    return {
      added: rolesToAdd.length,
      removed: rolesToRemove.length,
      unchanged: rolesToKeep.length
    };
  } catch (error) {
    console.error('Error synchronizing user roles:', error);
    throw error;
  }
};

/**
 * Get the roles a user has from the database
 * @param userId The Clerk user ID
 */
export const getUserRolesFromDB = async (userId: string) => {
  try {
    // This is a simplified placeholder for the actual implementation
    // In a real app, you would call a service function to get the user's roles
    
    // Example implementation:
    // const { data, error } = await supabase
    //   .from('user_roles')
    //   .select('role_id, roles(name)')
    //   .eq('user_id', userId);
    
    // if (error) throw error;
    // return data || [];
    
    // For now, just return empty array
    return [];
  } catch (error) {
    console.error('Error getting user roles from DB:', error);
    return [];
  }
};

/**
 * Update the roles in Clerk user metadata
 * @param userId The Clerk user ID
 * @param roles The roles to set in Clerk
 */
export const updateClerkUserRoles = async (userId: string, roles: UserRole[]) => {
  try {
    // This is a placeholder for the actual implementation
    // In a real app, you would call the Clerk API to update user metadata
    
    // Example implementation:
    // await clerkClient.users.updateUser(userId, {
    //   publicMetadata: {
    //     roles: roles
    //   }
    // });
    
    console.log(`[Mock] Updated Clerk roles for user ${userId}: ${roles.join(', ')}`);
    return true;
  } catch (error) {
    console.error('Error updating Clerk user roles:', error);
    return false;
  }
};

/**
 * Get a user's roles from Clerk metadata
 * @param userMetadata The user's metadata from Clerk
 */
export const getRolesFromMetadata = (userMetadata: any): UserRole[] => {
  if (!userMetadata || !userMetadata.roles) {
    return ['agent']; // Default role
  }
  
  return Array.isArray(userMetadata.roles) 
    ? userMetadata.roles as UserRole[] 
    : ['agent'];
};

export default {
  syncUserRoles,
  getUserRolesFromDB,
  updateClerkUserRoles,
  getRolesFromMetadata
};