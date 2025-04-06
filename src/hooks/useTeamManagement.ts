
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';
import { AgentWithHierarchy, User } from '@/types';
import { toast } from 'sonner';

export function useTeamManagement() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<AgentWithHierarchy | null>(null);
  
  // Get team hierarchy based on user role
  const { data: teamHierarchy, isLoading: isLoadingHierarchy, error: hierarchyError } = useQuery({
    queryKey: ['teamHierarchy', user?.id],
    queryFn: async () => {
      try {
        // If admin, fetch the complete organization hierarchy
        if (isAdmin) {
          const { data: topLevelAgents, error } = await supabase
            .from('agent_profiles')
            .select('*')
            .is('upline_id', null);
            
          if (error) throw error;
          
          // For each top-level agent, fetch their downline recursively
          const fullHierarchy = await Promise.all(
            topLevelAgents.map(async (agent) => {
              return await fetchAgentWithDownline(agent.id);
            })
          );
          
          // Return the first complete hierarchy (typically there's one CEO/top person)
          return fullHierarchy[0] || null;
        } 
        // If team leader, fetch only their team hierarchy
        else {
          // First check if the user is a team leader
          const { data: userRole, error: roleError } = await supabase.rpc('has_role', {
            p_user_id: user?.id,
            p_role_name: 'team_leader'
          });
          
          if (roleError) throw roleError;
          
          // If team leader, fetch their team hierarchy
          if (userRole) {
            return await fetchAgentWithDownline(user?.id);
          } 
          // If regular agent, fetch their upline and personal info
          else {
            const { data: agentProfile, error: profileError } = await supabase
              .from('agent_profiles')
              .select('*, upline:upline_id(*)')
              .eq('id', user?.id)
              .single();
              
            if (profileError) throw profileError;
            
            // Convert to AgentWithHierarchy type
            return {
              id: agentProfile.id,
              name: agentProfile.full_name,
              email: agentProfile.email,
              tier: agentProfile.tier_name,
              commission: agentProfile.commission_percentage,
              avatar: agentProfile.avatar_url,
              rank: agentProfile.tier_name,
              upline: agentProfile.upline ? {
                id: agentProfile.upline.id,
                name: agentProfile.upline.full_name,
                tier: agentProfile.upline.tier_name,
                commission: agentProfile.upline.commission_percentage,
                avatar: agentProfile.upline.avatar_url,
                rank: agentProfile.upline.tier_name
              } : undefined,
              downline: []
            };
          }
        }
      } catch (error) {
        console.error('Error fetching team hierarchy:', error);
        toast.error('Failed to load team hierarchy');
        return null;
      }
    },
    enabled: !!user?.id
  });
  
  // Recursive function to fetch an agent with their complete downline
  async function fetchAgentWithDownline(agentId: string): Promise<AgentWithHierarchy | null> {
    try {
      // Fetch the agent
      const { data: agent, error: agentError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', agentId)
        .single();
        
      if (agentError) throw agentError;
      
      // Fetch the agent's direct downline
      const { data: directDownline, error: downlineError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('upline_id', agentId);
        
      if (downlineError) throw downlineError;
      
      // Recursively fetch each downline agent's own downline
      const downlineWithHierarchy = await Promise.all(
        directDownline.map(async (downlineAgent) => {
          return await fetchAgentWithDownline(downlineAgent.id);
        })
      );
      
      // Filter out null values and sort by tier or name
      const validDownline = downlineWithHierarchy
        .filter(Boolean)
        .sort((a, b) => 
          (parseInt(b?.tier?.replace(/[^0-9]/g, '') || '0') - 
          parseInt(a?.tier?.replace(/[^0-9]/g, '') || '0')) || 
          (a?.name || '').localeCompare(b?.name || '')
        );
      
      // Return the agent with their downline
      return {
        id: agent.id,
        name: agent.full_name,
        email: agent.email,
        tier: agent.tier_name,
        commission: agent.commission_percentage,
        avatar: agent.avatar_url,
        rank: agent.tier_name,
        phone: agent.phone,
        joinDate: agent.join_date,
        transactions: agent.total_transactions,
        salesVolume: agent.total_sales,
        personalCommission: calculatePersonalCommission(agent),
        overrideCommission: calculateOverrideCommission(agent, validDownline),
        downline: validDownline
      };
    } catch (error) {
      console.error('Error in fetchAgentWithDownline:', error);
      return null;
    }
  }
  
  // Helper function to calculate personal commission (placeholder logic)
  function calculatePersonalCommission(agent: any): number {
    return (agent.total_sales || 0) * (agent.commission_percentage / 100) || 0;
  }
  
  // Helper function to calculate override commission (placeholder logic)
  function calculateOverrideCommission(agent: any, downline: (AgentWithHierarchy | null)[]): number {
    // Simple placeholder calculation - in reality this would be more complex
    // based on the override percentages for each tier level
    return downline.reduce((sum, downlineAgent) => {
      if (!downlineAgent) return sum;
      const overridePercentage = 0.05; // 5% override - this would be tier-based in reality
      return sum + (downlineAgent.personalCommission || 0) * overridePercentage;
    }, 0);
  }

  // Get team performance metrics
  const { data: teamMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['teamMetrics', user?.id, selectedAgent?.id],
    queryFn: async () => {
      try {
        const targetAgentId = selectedAgent?.id || user?.id;
        
        // For admins looking at the whole organization or a specific team
        if (isAdmin || selectedAgent) {
          const { data, error } = await supabase.rpc('get_team_performance_metrics', {
            p_agent_id: targetAgentId
          });
          
          if (error) throw error;
          return data;
        } 
        // For team leaders looking at their own team
        else {
          const { data, error } = await supabase.rpc('get_team_performance_metrics', {
            p_agent_id: user?.id
          });
          
          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error('Error fetching team metrics:', error);
        toast.error('Failed to load team performance metrics');
        return null;
      }
    },
    enabled: !!user?.id && (!!selectedAgent?.id || isAdmin)
  });
  
  // Set a selected agent for detailed view
  const handleAgentSelect = (agent: AgentWithHierarchy) => {
    setSelectedAgent(agent);
  };

  // Update an agent's upline (for admin reorganization)
  const updateAgentUpline = useMutation({
    mutationFn: async ({ agentId, newUplineId }: { agentId: string, newUplineId: string }) => {
      const { error } = await supabase
        .from('agent_profiles')
        .update({ upline_id: newUplineId })
        .eq('id', agentId);
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Team structure updated successfully');
      queryClient.invalidateQueries({ queryKey: ['teamHierarchy'] });
    },
    onError: (error) => {
      toast.error('Failed to update team structure');
      console.error('Error updating agent upline:', error);
    }
  });

  return {
    teamHierarchy,
    teamMetrics,
    selectedAgent,
    isLoadingHierarchy,
    isLoadingMetrics,
    handleAgentSelect,
    updateAgentUpline,
    hierarchyError,
    isAdmin
  };
}
