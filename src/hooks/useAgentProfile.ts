
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AgentRank } from '@/types/transaction-form';
import { useAuth } from '@/hooks/useAuth';

interface AgentProfile {
  id: string;
  tier: number;
  tier_name: AgentRank;
  commission_percentage: number;
}

export const useAgentProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['agentProfile', user?.id],
    queryFn: async (): Promise<AgentProfile> => {
      if (!user) throw new Error('User not authenticated');
      
      // In a real implementation, this would fetch from the profiles table
      // For now, we'll simulate a fixed tier for the agent
      const { data, error } = await supabase
        .from('profiles')
        .select('id, tier, tier_name, commission_percentage')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching agent profile:', error);
        
        // Fallback to a default tier if profile not found
        return {
          id: user.id,
          tier: 3,
          tier_name: 'Team Leader' as AgentRank,
          commission_percentage: 83
        };
      }
      
      return data || {
        id: user.id,
        tier: 3,
        tier_name: 'Team Leader' as AgentRank,
        commission_percentage: 83
      };
    },
    enabled: !!user,
  });
};
