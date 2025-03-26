
import { useQuery } from '@tanstack/react-query';
import { AgentRank } from '@/types/transaction-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AgentProfile {
  id: string;
  tier: number;
  tier_name: AgentRank;
  commission_percentage: number;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  agency_id: string;
  upline_id?: string | null;
  specializations?: string[];
  total_sales?: number;
  total_transactions?: number;
}

export const useAgentProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['agentProfile', user?.id],
    queryFn: async (): Promise<AgentProfile> => {
      if (!user) throw new Error('User not authenticated');
      
      // Fetch the agent profile from the new table
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching agent profile:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('No agent profile found, using defaults');
        // Provide a fallback profile with default values
        return {
          id: user.id,
          tier: 3,
          tier_name: 'Team Leader' as AgentRank,
          commission_percentage: 83,
          agency_id: '11111111-1111-1111-1111-111111111111'
        };
      }
      
      return {
        id: data.id,
        tier: data.tier,
        tier_name: data.tier_name as AgentRank,
        commission_percentage: data.commission_percentage,
        full_name: data.full_name,
        email: data.email,
        avatar_url: data.avatar_url,
        agency_id: data.agency_id,
        upline_id: data.upline_id,
        specializations: data.specializations,
        total_sales: data.total_sales,
        total_transactions: data.total_transactions
      };
    },
    enabled: !!user,
  });
};
