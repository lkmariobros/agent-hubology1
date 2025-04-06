
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types/auth';
import { castParam, safelyExtractProperty } from '@/utils/supabaseHelpers';
import { isSpecialAdmin, ensureAdminRole, getPreferredActiveRole } from '@/utils/adminAccess';

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
    roles = ['agent', 'viewer'] as UserRole[]; // Everyone has basic roles
    
    if (profileData) {
      const tier = safelyExtractProperty(profileData, 'tier', 1);
      
      // Map tiers to roles
      if (tier >= 5) roles.push('admin' as UserRole);
      if (tier >= 4) roles.push('team_leader' as UserRole);
      if (tier >= 3) roles.push('manager' as UserRole);
      if (tier >= 2) roles.push('finance' as UserRole);
    }
  } else {
    // Convert database roles to user roles array
    roles = userRoles.map(r => r.role_name as UserRole);
    
    // Ensure every user has at least basic roles
    if (!roles.includes('viewer')) roles.push('viewer' as UserRole);
    if (!roles.includes('agent')) roles.push('agent' as UserRole);
  }
  
  // Use centralized special admin handling
  roles = ensureAdminRole(roles, user.email);
  
  // Default to agent role if no roles returned
  if (!roles || !roles.length) {
    const defaultRoles: UserRole[] = ['agent' as UserRole];
    return {
      id: user.id,
      email: user.email || '',
      name: user.email?.split('@')[0] || '',
      roles: defaultRoles,
      activeRole: defaultRoles[0],
    };
  }
  
  // Set active role using centralized logic
  const activeRole = getPreferredActiveRole(roles, user.email);
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.email?.split('@')[0] || '',
    roles,
    activeRole,
  };
};

/**
 * Fetches user profile and roles
 */
export const fetchProfileAndRoles = async (userId: string, userEmail: string | undefined) => {
  try {
    console.log('Fetching profile for user:', userId);
    
    // Get user roles from database first
    const { data: dbRoles, error: rolesError } = await supabase
      .rpc('get_user_roles', { p_user_id: userId });
    
    // Use direct SQL query to avoid RLS recursion issue
    const { data: primaryProfileData, error: profileError } = await supabase
      .rpc('get_agent_profile_by_id', { user_id: userId })
      .single();
      
    // Determine which profile data to use (primary or fallback)
    let finalProfileData = primaryProfileData;
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Try using the simple select query as fallback
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (fallbackError) {
        console.error('Fallback profile fetch error:', fallbackError);
        // No profile data available, will use defaults
        finalProfileData = null;
      } else {
        // Use fallback data instead
        finalProfileData = fallbackData;
      }
    }
    
    // Determine roles based on what we have
    let roles: UserRole[] = ['agent', 'viewer'] as UserRole[]; // Everyone has basic roles
    
    if (!rolesError && dbRoles && dbRoles.length > 0) {
      // Use roles from database
      roles = dbRoles.map(r => r.role_name as UserRole);
      
      // Ensure basic roles
      if (!roles.includes('viewer')) roles.push('viewer' as UserRole);
      if (!roles.includes('agent')) roles.push('agent' as UserRole);
      
      console.log('Retrieved roles from database:', roles);
    } else if (finalProfileData) {
      // Fall back to tier-based role determination
      const tier = safelyExtractProperty(finalProfileData, 'tier', 1);
      console.log('User tier level:', tier);
      
      // Map tiers to roles
      if (tier >= 5) roles.push('admin' as UserRole);
      if (tier >= 4) roles.push('team_leader' as UserRole);
      if (tier >= 3) roles.push('manager' as UserRole);
      if (tier >= 2) roles.push('finance' as UserRole);
      
      console.log('Determined roles from tier:', roles);
    }
    
    // Use centralized special admin handling
    roles = ensureAdminRole(roles, userEmail);
    
    // Set active role using centralized logic
    const activeRole = getPreferredActiveRole(roles, userEmail);
    
    const userProfile = {
      id: userId,
      email: userEmail || '',
      name: safelyExtractProperty(finalProfileData, 'full_name', userEmail?.split('@')[0] || ''),
      roles: roles,
      activeRole: activeRole,
    };
    
    console.log('User profile created:', userProfile);
    
    return {
      profile: finalProfileData,
      userProfile,
      roles: userProfile.roles,
      activeRole: userProfile.activeRole
    };
  } catch (err) {
    console.error('Error fetching user profile or roles', { userId, error: err });
    // Still return a basic profile even if there's an error
    const defaultRoles: UserRole[] = ['agent' as UserRole];
    
    // Use centralized special admin handling even in error case
    const roles = ensureAdminRole(defaultRoles, userEmail);
    const activeRole = getPreferredActiveRole(roles, userEmail);
    
    return {
      profile: null,
      userProfile: {
        id: userId,
        email: userEmail || '',
        name: userEmail?.split('@')[0] || '',
        roles,
        activeRole,
      },
      roles,
      activeRole
    };
  }
};
