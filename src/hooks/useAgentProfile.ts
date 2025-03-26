
import { useQuery } from '@tanstack/react-query';
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
      
      // In a real implementation, this would fetch from the database
      // For now, we'll simulate a fixed tier for the agent
      // This would be replaced with an actual API call to Supabase in production
      
      // Simulated profile data
      const mockProfile: AgentProfile = {
        id: user.id,
        tier: 3,
        tier_name: 'Team Leader' as AgentRank,
        commission_percentage: 83
      };
      
      return mockProfile;
    },
    enabled: !!user,
  });
};
