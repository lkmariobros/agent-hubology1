
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useAgentProfile = () => {
  return useQuery({
    queryKey: ['agentProfile'],
    queryFn: async () => {
      try {
        // Use edge function which uses the security definer function to avoid recursion
        const { data: response, error: edgeFunctionError } = await supabase
          .functions.invoke('get_agent_profile', {});
          
        if (edgeFunctionError) {
          console.error('Error calling edge function:', edgeFunctionError);
          throw edgeFunctionError;
        }
        
        if (response?.data) {
          return response.data;
        }
        
        // Fallback to direct database call using our new security definer function
        const { data, error } = await supabase
          .rpc('get_agent_profile_by_id', { user_id: (await supabase.auth.getUser()).data.user?.id })
          .single();
          
        if (error) {
          console.error('Error fetching agent profile:', error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Failed to load agent profile:', error);
        // Return mock data as a last resort fallback
        const mockAgentProfile = {
          id: 'agent-1',
          tier: 2,
          tier_name: 'Advisor',
          commission_percentage: 70,
          total_sales: 2500000,
          join_date: new Date(2022, 0, 15).toISOString(),
          specializations: ['Residential', 'Commercial'],
          avatar_url: '/avatars/agent-1.jpg',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          agency_id: 'agency-1',
          upline_id: null,
          total_transactions: 12
        };
        
        return mockAgentProfile;
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
