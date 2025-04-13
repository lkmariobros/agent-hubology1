import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/context/clerk/ClerkProvider';
import { useAuth } from '@clerk/clerk-react';
import { profileService, CompleteUserProfile } from '@/services/profileService';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

interface AgentLevelInfo {
  level: string;
  salesTarget: number;
  totalSales: number;
  nextLevelTarget: number;
  progress: number; // Percentage progress to next level (0-100)
}

interface UseProfileReturn {
  profile: CompleteUserProfile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (
    updates: {
      firstName?: string;
      lastName?: string;
      role?: UserRole;
    }
  ) => Promise<boolean>;
  updateAgentDetails: (
    level: string,
    salesTarget: number
  ) => Promise<boolean>;
  updatePreferences: (
    preferences: {
      darkMode?: boolean;
      emailNotifications?: boolean;
      preferredPortal?: string;
      theme?: string;
    }
  ) => Promise<boolean>;
  getAgentLevelInfo: () => AgentLevelInfo | null;
  refreshProfile: () => Promise<void>;
}

/**
 * Custom hook for managing user profile data and operations
 */
export const useProfile = (): UseProfileReturn => {
  const { user, profile: clerkProfile } = useClerkAuth();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<CompleteUserProfile | null>(null);

  /**
   * Fetch complete profile data from database
   */
  const fetchCompleteProfile = async (): Promise<void> => {
    if (!user || !clerkProfile) return;

    try {
      setLoading(true);
      
      // Get token for Supabase
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        throw new Error('No token available');
      }
      
      // Get profile by Clerk ID
      const basicProfile = await profileService.getProfileByClerkId(user.id, token);
      
      if (basicProfile) {
        // Get complete profile with preferences and agent details
        const completeProfile = await profileService.getCompleteProfile(basicProfile.id, token);
        
        if (completeProfile) {
          setProfile(completeProfile);
        }
      }
    } catch (err) {
      console.error('Error fetching complete profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile data'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch complete profile when user profile is available
  useEffect(() => {
    if (user && clerkProfile) {
      fetchCompleteProfile();
    } else {
      setProfile(null);
    }
  }, [user, clerkProfile]);

  /**
   * Update basic profile information
   */
  const updateProfile = async (
    updates: {
      firstName?: string;
      lastName?: string;
      role?: UserRole;
    }
  ): Promise<boolean> => {
    if (!user || !clerkProfile) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      
      // Get token for Supabase
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        throw new Error('No token available');
      }
      
      // Update profile in database
      const updatedProfile = await profileService.createOrUpdateProfile(
        user.id,
        clerkProfile.email,
        updates.firstName || clerkProfile.first_name,
        updates.lastName || clerkProfile.last_name,
        updates.role || clerkProfile.role,
        token
      );
      
      if (updatedProfile) {
        // Refresh profile data
        await fetchCompleteProfile();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update agent-specific details
   */
  const updateAgentDetails = async (
    level: string,
    salesTarget: number
  ): Promise<boolean> => {
    if (!user || !profile?.profile.id) {
      toast.error('User profile not loaded');
      return false;
    }

    try {
      setLoading(true);
      
      // Get token for Supabase
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        throw new Error('No token available');
      }
      
      // Update agent details in database
      const success = await profileService.updateAgentDetails(
        profile.profile.id,
        level,
        salesTarget,
        token
      );
      
      if (success) {
        toast.success('Agent details updated successfully');
        // Refresh profile data
        await fetchCompleteProfile();
        return true;
      } else {
        toast.error('Failed to update agent details');
        return false;
      }
    } catch (err) {
      console.error('Error updating agent details:', err);
      toast.error('Failed to update agent details');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user preferences
   */
  const updatePreferences = async (
    preferences: {
      darkMode?: boolean;
      emailNotifications?: boolean;
      preferredPortal?: string;
      theme?: string;
    }
  ): Promise<boolean> => {
    if (!user || !profile?.profile.id) {
      toast.error('User profile not loaded');
      return false;
    }

    try {
      setLoading(true);
      
      // Get token for Supabase
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        throw new Error('No token available');
      }
      
      // Update preferences in database
      const success = await profileService.updateUserPreferences(
        profile.profile.id,
        preferences,
        token
      );
      
      if (success) {
        toast.success('Preferences updated successfully');
        // Refresh profile data
        await fetchCompleteProfile();
        return true;
      } else {
        toast.error('Failed to update preferences');
        return false;
      }
    } catch (err) {
      console.error('Error updating preferences:', err);
      toast.error('Failed to update preferences');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get agent level progress information
   */
  const getAgentLevelInfo = (): AgentLevelInfo | null => {
    if (!profile?.agent_details) {
      return null;
    }
    
    const { level, sales_target, total_sales, next_level_target } = profile.agent_details;
    
    // Calculate progress percentage
    let progress = 0;
    if (next_level_target > 0) {
      progress = Math.min(Math.round((total_sales / next_level_target) * 100), 100);
    } else if (level === 'director') {
      // Directors are at max level
      progress = 100;
    }
    
    return {
      level,
      salesTarget: sales_target,
      totalSales: total_sales,
      nextLevelTarget: next_level_target,
      progress
    };
  };

  /**
   * Refresh profile data
   */
  const refreshProfile = async (): Promise<void> => {
    await fetchCompleteProfile();
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateAgentDetails,
    updatePreferences,
    getAgentLevelInfo,
    refreshProfile
  };
};

export default useProfile;