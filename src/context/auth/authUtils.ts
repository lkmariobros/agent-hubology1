
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types/auth';
import { castParam, safelyExtractProperty } from '@/utils/supabaseHelpers';
import { ensureAdminRoleForSpecialEmail, getPreferredActiveRole, isSpecialAdminEmail } from './adminUtils';
import { AUTH_CONFIG } from './authConfig';

/**
 * Creates a user profile from Supabase user data and roles
 */
export const createUserProfile = async (user: User): Promise<UserProfile> => {
  // Get roles from database first
  const { data: userRoles, error: rolesError } = await supabase
    .rpc('get_user_roles', { p_user_id: user.id });
  
  // Fall back to agent_profiles tier-based method if error
  let roles: UserRole[] = [];
  
  if (rolesError || !userRoles || userRoles.length === 0) {
    // Get roles from agent_profiles tier-based fallback method
    const { data: profileData } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('id', castParam(user.id))
      .maybeSingle();
      
    // Determine roles based on tier
    roles = [...AUTH_CONFIG.DEFAULT_ROLES]; // Everyone has basic roles
    
    if (profileData) {
      const tier = safelyExtractProperty(profileData, 'tier', 1);
      
      // Map tiers to roles
      if (tier >= 5) roles.push('admin');
      if (tier >= 4) roles.push('team_leader');
      if (tier >= 3) roles.push('manager');
      if (tier >= 2) roles.push('finance');
    }
  } else {
    // Convert database roles to user roles array
    roles = userRoles.map(r => r.role_name as UserRole);
    
    // Ensure every user has at least basic roles
    for (const baseRole of AUTH_CONFIG.DEFAULT_ROLES) {
      if (!roles.includes(baseRole as UserRole)) {
        roles.push(baseRole as UserRole);
      }
    }
  }
  
  // Ensure admin role for special admin email
  roles = ensureAdminRoleForSpecialEmail(roles, user.email);
  
  // Default to agent role if no roles returned
  if (!roles || !roles.length) {
    return {
      id: user.id,
      email: user.email || '',
      name: user.email?.split('@')[0] || '',
      roles: [AUTH_CONFIG.DEFAULT_ROLE as UserRole],
      activeRole: AUTH_CONFIG.DEFAULT_ROLE as UserRole,
    };
  }
  
  // Set active role with admin taking precedence
  const activeRole = getPreferredActiveRole(roles);
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.email?.split('@')[0] || '',
    roles: roles as UserRole[],
    activeRole: activeRole as UserRole,
  };
};

/**
 * Fetches user profile and roles
 * 
 * IMPORTANT: This function is restructured to prevent RLS recursion
 * by first getting roles directly and only getting profile as needed
 */
export const fetchProfileAndRoles = async (userId: string, userEmail: string | undefined) => {
  try {
    console.log('Fetching profile for user:', userId);
    
    // IMPORTANT: Avoid RLS recursion by getting roles first directly 
    // and not trying to get the profile details until we have to
    let finalRoles: UserRole[] = [...AUTH_CONFIG.DEFAULT_ROLES] as UserRole[];
    let profileData = null;
    let userName = userEmail?.split('@')[0] || '';
    
    // First try to get the roles directly - this avoids potential recursion issues
    try {
      const { data: dbRoles, error: rolesError } = await supabase
        .rpc('get_user_roles', { p_user_id: userId });
        
      if (!rolesError && dbRoles && dbRoles.length > 0) {
        finalRoles = dbRoles.map(r => r.role_name as UserRole);
        
        // Ensure basic roles
        for (const baseRole of AUTH_CONFIG.DEFAULT_ROLES) {
          if (!finalRoles.includes(baseRole as UserRole)) {
            finalRoles.push(baseRole as UserRole);
          }
        }
        
        console.log('Retrieved roles from database:', finalRoles);
      } else {
        console.log('No roles from database, using default roles');
      }
    } catch (rolesError) {
      console.warn('Error getting user roles, using defaults:', rolesError);
    }
    
    // As a LAST resort, attempt to get the profile data - but this is optional!
    try {
      // Use maybeSingle to prevent errors if no profile exists
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('full_name, tier')
        .eq('id', userId)
        .maybeSingle();
        
      if (!error && data) {
        profileData = data;
        if (data.full_name) {
          userName = data.full_name;
        }
        
        // Determine additional roles based on tier if we didn't get them earlier
        const tier = data.tier || 1;
        if (finalRoles.length <= AUTH_CONFIG.DEFAULT_ROLES.length) {
          if (tier >= 5) finalRoles.push('admin');
          if (tier >= 4) finalRoles.push('team_leader');
          if (tier >= 3) finalRoles.push('manager');
          if (tier >= 2) finalRoles.push('finance');
        }
      } else {
        console.log('No profile data found, using email-based profile only');
      }
    } catch (err) {
      console.warn('Could not get profile data, using email-based profile only', err);
    }
    
    // Ensure admin role for special admin email
    finalRoles = ensureAdminRoleForSpecialEmail(finalRoles, userEmail);
    
    // Set active role with admin taking precedence
    const finalActiveRole = getPreferredActiveRole(finalRoles);
    
    const userProfile = {
      id: userId,
      email: userEmail || '',
      name: userName,
      roles: finalRoles,
      activeRole: finalActiveRole as UserRole,
    };
    
    console.log('User profile created:', userProfile);
    
    return {
      profile: profileData,
      userProfile,
      roles: userProfile.roles,
      activeRole: userProfile.activeRole
    };
  } catch (err) {
    console.error('Error fetching user profile or roles', { userId, error: err });
    
    // Still return a basic profile even if there's an error
    const defaultRoles: UserRole[] = [AUTH_CONFIG.DEFAULT_ROLE as UserRole];
    
    // Ensure admin role for special admin email
    const finalRoles = ensureAdminRoleForSpecialEmail(defaultRoles, userEmail);
    const finalActiveRole = getPreferredActiveRole(finalRoles);
    
    return {
      profile: null,
      userProfile: {
        id: userId,
        email: userEmail || '',
        name: userEmail?.split('@')[0] || '',
        roles: finalRoles as UserRole[],
        activeRole: finalActiveRole as UserRole,
      },
      roles: finalRoles as UserRole[],
      activeRole: finalActiveRole as UserRole
    };
  }
};
