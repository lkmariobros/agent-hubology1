import { UserRole } from '@/types/auth';
import { supabase, createSupabaseWithToken } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Synchronize user profile data with Supabase database
 * @param userId The Clerk user ID
 * @param role The user's role
 * @param profileData Additional profile data
 * @param token JWT token for authenticated Supabase requests
 */
export const syncProfileWithDatabase = async (
  userId: string, 
  role: UserRole, 
  profileData: any,
  token: string
): Promise<boolean> => {
  try {
    console.log('Syncing profile for user:', userId);
    
    // Create a Supabase client with the token
    const supabaseWithToken = createSupabaseWithToken(token);
    
    // Create or update the user profile in the database
    const { data, error } = await supabaseWithToken
      .rpc('create_profile_for_clerk_user', {
        p_clerk_id: userId,
        p_email: profileData.email || '',
        p_first_name: profileData.firstName || '',
        p_last_name: profileData.lastName || '',
        p_role: role
      });
      
    if (error) {
      console.error('Error creating/updating profile in database:', error);
      return false;
    }
    
    // Store additional profile preferences 
    if (data && data.id) {
      // Store agent details if this is an agent role
      if (role === 'agent' && profileData.agentLevel) {
        await storeAgentDetails(supabaseWithToken, data.id, profileData);
      }
      
      // Store user preferences
      await storeUserPreferences(supabaseWithToken, data.id, profileData);
    }
    
    console.log('Profile synced successfully:', data);
    return true;
  } catch (error) {
    console.error('Error synchronizing profile with database:', error);
    toast.error('Failed to sync profile with database');
    return false;
  }
};

/**
 * Store agent-specific details in the database
 */
const storeAgentDetails = async (supabaseClient: any, profileId: string, profileData: any) => {
  try {
    // Check if agent details already exist
    const { data: existingData, error: checkError } = await supabaseClient
      .from('agent_details')
      .select('id')
      .eq('profile_id', profileId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking agent details:', checkError);
      return;
    }
    
    // Prepare agent data
    const agentData = {
      profile_id: profileId,
      level: profileData.agentLevel || 'junior',
      sales_target: profileData.salesTarget || 0,
      updated_at: new Date().toISOString()
    };
    
    if (existingData) {
      // Update existing agent details
      const { error } = await supabaseClient
        .from('agent_details')
        .update(agentData)
        .eq('id', existingData.id);
        
      if (error) {
        console.error('Error updating agent details:', error);
      }
    } else {
      // Insert new agent details
      const { error } = await supabaseClient
        .from('agent_details')
        .insert({
          ...agentData,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error inserting agent details:', error);
      }
    }
  } catch (error) {
    console.error('Error storing agent details:', error);
  }
};

/**
 * Store user preferences in the database
 */
const storeUserPreferences = async (supabaseClient: any, profileId: string, profileData: any) => {
  try {
    // Check if preferences already exist
    const { data: existingData, error: checkError } = await supabaseClient
      .from('user_preferences')
      .select('id')
      .eq('profile_id', profileId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking user preferences:', checkError);
      return;
    }
    
    // Prepare preferences data
    const preferencesData = {
      profile_id: profileId,
      dark_mode: profileData.darkMode === undefined ? true : profileData.darkMode,
      email_notifications: profileData.emailNotifications === undefined ? true : profileData.emailNotifications,
      preferred_portal: profileData.preferredPortal || 'agent',
      updated_at: new Date().toISOString()
    };
    
    if (existingData) {
      // Update existing preferences
      const { error } = await supabaseClient
        .from('user_preferences')
        .update(preferencesData)
        .eq('id', existingData.id);
        
      if (error) {
        console.error('Error updating user preferences:', error);
      }
    } else {
      // Insert new preferences
      const { error } = await supabaseClient
        .from('user_preferences')
        .insert({
          ...preferencesData,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error inserting user preferences:', error);
      }
    }
  } catch (error) {
    console.error('Error storing user preferences:', error);
  }
};

/**
 * Get user profile from database
 * @param userId The Clerk user ID
 * @param token JWT token for authenticated Supabase requests
 */
export const getProfileFromDatabase = async (userId: string, token: string): Promise<any> => {
  try {
    console.log('Getting profile for user:', userId);
    
    // Create a Supabase client with the token
    const supabaseWithToken = createSupabaseWithToken(token);
    
    // Get the user profile from the database
    const { data, error } = await supabaseWithToken
      .rpc('get_profile_by_clerk_id', { p_clerk_id: userId });
      
    if (error) {
      console.error('Error getting profile from database:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log('No profile found for user:', userId);
      return null;
    }
    
    console.log('Found profile:', data[0]);
    return data[0];
  } catch (error) {
    console.error('Error getting profile from database:', error);
    return null;
  }
};

/**
 * Get complete user profile with preferences and agent details
 * @param profileId The profile ID in the database
 * @param token JWT token for authenticated Supabase requests
 */
export const getCompleteProfileData = async (profileId: string, token: string): Promise<any> => {
  try {
    // Create a Supabase client with the token
    const supabaseWithToken = createSupabaseWithToken(token);
    
    // Get the basic profile
    const { data: profileData, error: profileError } = await supabaseWithToken
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();
      
    if (profileError) {
      console.error('Error getting profile data:', profileError);
      return null;
    }
    
    // Get preferences
    const { data: preferencesData, error: preferencesError } = await supabaseWithToken
      .from('user_preferences')
      .select('*')
      .eq('profile_id', profileId)
      .single();
      
    // Get agent details if this is an agent
    let agentData = null;
    if (profileData.role === 'agent') {
      const { data: agentResult, error: agentError } = await supabaseWithToken
        .from('agent_details')
        .select('*')
        .eq('profile_id', profileId)
        .single();
        
      if (!agentError) {
        agentData = agentResult;
      }
    }
    
    // Combine all data
    return {
      ...profileData,
      preferences: preferencesData || {},
      agent_details: agentData || {}
    };
  } catch (error) {
    console.error('Error getting complete profile data:', error);
    return null;
  }
};

export default {
  syncProfileWithDatabase,
  getProfileFromDatabase,
  getCompleteProfileData
};