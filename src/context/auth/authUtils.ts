
import { User } from '@supabase/supabase-js';
import { supabase, supabaseUtils } from '@/lib/supabase';
import { UserProfile, UserRole } from './types';

/**
 * Creates a user profile from Supabase user data and roles
 */
export const createUserProfile = async (user: User): Promise<UserProfile> => {
  // Get roles from agent_profiles tier-based fallback method
  const roles: UserRole[] = await supabaseUtils.getRoles();
  
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
    
    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Continue anyway - profile is optional
    }
    
    // Get full user profile with roles
    const userProfile = await createUserProfile({ id: userId, email: userEmail } as User);
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
  }
};
