
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types/auth';
import { castParam, safelyExtractProperty } from '@/utils/supabaseHelpers';

/**
 * Creates a user profile from Supabase user data and roles
 */
export const createUserProfile = async (user: User): Promise<UserProfile> => {
  // Get roles from agent_profiles tier-based fallback method
  const { data: profileData } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('id', castParam(user.id))
    .maybeSingle();
    
  // Determine roles based on tier
  let roles: UserRole[] = ['agent', 'viewer']; // Everyone has basic roles
  
  if (profileData) {
    const tier = safelyExtractProperty(profileData, 'tier', 1);
    
    // Map tiers to roles
    if (tier >= 5) roles.push('admin');
    if (tier >= 4) roles.push('team_leader');
    if (tier >= 3) roles.push('manager');
    if (tier >= 2) roles.push('finance');
  }
  
  // Default to agent role if no roles returned
  if (!roles || !roles.length) {
    const defaultRoles: UserRole[] = ['agent'];
    return {
      id: user.id,
      email: user.email || '',
      name: user.email?.split('@')[0] || '',
      roles: defaultRoles,
      activeRole: defaultRoles[0],
    };
  }
  
  // Set active role (prefer admin if available, otherwise first role)
  const activeRole = roles.includes('admin') ? 'admin' : roles[0];
  
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
    
    // Use direct SQL query to avoid RLS recursion issue
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_agent_profile_by_id', { user_id: userId })
      .single();
      
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
        return createFallbackProfile(userId, userEmail);
      } else if (fallbackData) {
        return createProfileFromData(fallbackData, userId, userEmail);
      }
    }
    
    // If we have profile data from the RPC call, use it
    if (profileData) {
      return createProfileFromData(profileData, userId, userEmail);
    }
    
    // If we reach here, we couldn't get profile data
    return createFallbackProfile(userId, userEmail);
    
  } catch (err) {
    console.error('Error fetching user profile or roles', { userId, error: err });
    return createFallbackProfile(userId, userEmail);
  }
};

// Helper function to create a profile from data
const createProfileFromData = (profileData: any, userId: string, userEmail: string | undefined) => {
  // Determine roles based on tier
  let roles: UserRole[] = ['agent', 'viewer']; // Everyone has basic roles
  
  const tier = safelyExtractProperty(profileData, 'tier', 1);
  console.log('User tier level:', tier);
  
  // Map tiers to roles
  if (tier >= 5) roles.push('admin');
  if (tier >= 4) roles.push('team_leader');
  if (tier >= 3) roles.push('manager');
  if (tier >= 2) roles.push('finance');
  
  const activeRole = roles.includes('admin') ? 'admin' : roles[0];
  
  const userProfile = {
    id: userId,
    email: userEmail || '',
    name: safelyExtractProperty(profileData, 'full_name', userEmail?.split('@')[0] || ''),
    roles: roles,
    activeRole: activeRole,
  };
  
  console.log('User profile created:', userProfile);
  
  return {
    profile: profileData,
    userProfile,
    roles,
    activeRole
  };
};

// Helper function to create a fallback profile
const createFallbackProfile = (userId: string, userEmail: string | undefined) => {
  // Still return a basic profile even if there's an error
  const defaultRoles: UserRole[] = ['agent'];
  return {
    profile: null,
    userProfile: {
      id: userId,
      email: userEmail || '',
      name: userEmail?.split('@')[0] || '',
      roles: defaultRoles,
      activeRole: defaultRoles[0],
    },
    roles: defaultRoles,
    activeRole: defaultRoles[0]
  };
};
