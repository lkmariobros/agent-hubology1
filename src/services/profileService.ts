import { supabase, createSupabaseWithToken } from '@/lib/supabase';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

interface AgentDetails {
  id: string;
  profile_id: string;
  level: string;
  sales_target: number;
  total_sales: number;
  next_level_target: number;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  id: string;
  profile_id: string;
  dark_mode: boolean;
  email_notifications: boolean;
  preferred_portal: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface CompleteUserProfile {
  profile: UserProfile;
  agent_details?: AgentDetails;
  preferences?: UserPreferences;
}

/**
 * Service for managing user profiles
 */
export const profileService = {
  /**
   * Get a user's profile by Clerk ID
   */
  async getProfileByClerkId(clerkId: string, token: string): Promise<UserProfile | null> {
    try {
      const supabaseWithToken = createSupabaseWithToken(token);
      
      const { data, error } = await supabaseWithToken
        .rpc('get_profile_by_clerk_id', { p_clerk_id: clerkId });
        
      if (error) {
        console.error('Error getting profile by clerk ID:', error);
        return null;
      }
      
      if (!data || data.length === 0) {
        return null;
      }
      
      return data[0] as UserProfile;
    } catch (error) {
      console.error('Error in getProfileByClerkId:', error);
      return null;
    }
  },
  
  /**
   * Get complete profile data
   */
  async getCompleteProfile(profileId: string, token: string): Promise<CompleteUserProfile | null> {
    try {
      const supabaseWithToken = createSupabaseWithToken(token);
      
      // Get basic profile
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
      let agentDetailsData = null;
      if (profileData.role === 'agent') {
        const { data: agentData, error: agentError } = await supabaseWithToken
          .from('agent_details')
          .select('*')
          .eq('profile_id', profileId)
          .single();
          
        if (!agentError) {
          agentDetailsData = agentData;
        }
      }
      
      return {
        profile: profileData as UserProfile,
        preferences: preferencesData as UserPreferences | undefined,
        agent_details: agentDetailsData as AgentDetails | undefined
      };
    } catch (error) {
      console.error('Error in getCompleteProfile:', error);
      return null;
    }
  },
  
  /**
   * Create or update a user profile
   */
  async createOrUpdateProfile(
    clerkId: string, 
    email: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole,
    token: string
  ): Promise<UserProfile | null> {
    try {
      const supabaseWithToken = createSupabaseWithToken(token);
      
      const { data, error } = await supabaseWithToken
        .rpc('create_profile_for_clerk_user', {
          p_clerk_id: clerkId,
          p_email: email,
          p_first_name: firstName,
          p_last_name: lastName,
          p_role: role
        });
        
      if (error) {
        console.error('Error creating/updating profile:', error);
        toast.error('Failed to create or update profile');
        return null;
      }
      
      toast.success('Profile saved successfully');
      return data as UserProfile;
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      toast.error('An error occurred while saving profile');
      return null;
    }
  },
  
  /**
   * Update agent details
   */
  async updateAgentDetails(
    profileId: string,
    level: string,
    salesTarget: number,
    token: string
  ): Promise<boolean> {
    try {
      const supabaseWithToken = createSupabaseWithToken(token);
      
      // Check if agent details exist
      const { data: existingData, error: checkError } = await supabaseWithToken
        .from('agent_details')
        .select('id')
        .eq('profile_id', profileId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking agent details:', checkError);
        return false;
      }
      
      // Set next level target based on current level
      let nextLevelTarget = 5000000; // Default for junior ($5M)
      
      switch (level) {
        case 'junior':
          nextLevelTarget = 5000000; // $5M to reach regular agent
          break;
        case 'agent':
          nextLevelTarget = 15000000; // $15M to reach senior
          break;
        case 'senior':
          nextLevelTarget = 45000000; // $45M to reach associate director
          break;
        case 'associate-director':
          nextLevelTarget = 100000000; // $100M to reach director
          break;
        case 'director':
          nextLevelTarget = 0; // Already at highest level
          break;
      }
      
      // Prepare agent data
      const agentData = {
        profile_id: profileId,
        level,
        sales_target: salesTarget,
        next_level_target: nextLevelTarget,
        updated_at: new Date().toISOString()
      };
      
      if (existingData) {
        // Update existing details
        const { error } = await supabaseWithToken
          .from('agent_details')
          .update(agentData)
          .eq('id', existingData.id);
          
        if (error) {
          console.error('Error updating agent details:', error);
          return false;
        }
      } else {
        // Insert new details
        const { error } = await supabaseWithToken
          .from('agent_details')
          .insert({
            ...agentData,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error inserting agent details:', error);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateAgentDetails:', error);
      return false;
    }
  },
  
  /**
   * Update user preferences
   */
  async updateUserPreferences(
    profileId: string,
    preferences: {
      darkMode?: boolean;
      emailNotifications?: boolean;
      preferredPortal?: string;
      theme?: string;
    },
    token: string
  ): Promise<boolean> {
    try {
      const supabaseWithToken = createSupabaseWithToken(token);
      
      // Check if preferences exist
      const { data: existingData, error: checkError } = await supabaseWithToken
        .from('user_preferences')
        .select('id')
        .eq('profile_id', profileId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking user preferences:', checkError);
        return false;
      }
      
      // Prepare preferences data
      const preferencesData = {
        profile_id: profileId,
        dark_mode: preferences.darkMode === undefined ? true : preferences.darkMode,
        email_notifications: preferences.emailNotifications === undefined ? true : preferences.emailNotifications,
        preferred_portal: preferences.preferredPortal || 'agent',
        theme: preferences.theme || 'default',
        updated_at: new Date().toISOString()
      };
      
      if (existingData) {
        // Update existing preferences
        const { error } = await supabaseWithToken
          .from('user_preferences')
          .update(preferencesData)
          .eq('id', existingData.id);
          
        if (error) {
          console.error('Error updating user preferences:', error);
          return false;
        }
      } else {
        // Insert new preferences
        const { error } = await supabaseWithToken
          .from('user_preferences')
          .insert({
            ...preferencesData,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error inserting user preferences:', error);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUserPreferences:', error);
      return false;
    }
  }
};

export default profileService;