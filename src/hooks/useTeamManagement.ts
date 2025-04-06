
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
          // Get top-level agents (those without uplines)
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
          // Check if the user is a team leader using the security definer function
          const { data: isTeamLeader, error: roleError } = await supabase
            .rpc('is_user_team_leader', { user_id: user?.id });
          
          if (roleError) throw roleError;
          
          // If team leader, fetch their team hierarchy
          if (isTeamLeader) {
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
            
            // Calculate commission values
            const personalCommission = calculatePersonalCommission(agentProfile);
            const overrideCommission = 0; // No overrides for agents without downlines
            const totalCommission = personalCommission + overrideCommission;
            
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
                rank: agentProfile.upline.tier_name,
                salesVolume: 0,
                personalCommission: 0,
                overrideCommission: 0,
                totalCommission: 0
              } : undefined,
              downline: [],
              salesVolume: agentProfile.total_sales || 0,
              personalCommission,
              overrideCommission,
              totalCommission,
              phone: agentProfile.phone,
              joinDate: agentProfile.join_date,
              transactions: agentProfile.total_transactions
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
      // Fetch the agent using the security definer function
      const { data: agent, error: agentError } = await supabase
        .rpc('get_agent_profile_by_id', { user_id: agentId });
        
      if (agentError || !agent || agent.length === 0) throw agentError;
      
      // Use the first result if multiple are returned
      const agentData = Array.isArray(agent) ? agent[0] : agent;
      
      // Fetch the agent's direct downline using security definer function
      const { data: directDownline, error: downlineError } = await supabase
        .rpc('get_direct_reports', { manager_id: agentId });
        
      if (downlineError) throw downlineError;
      
      const downlineArray = Array.isArray(directDownline) ? directDownline : [directDownline];
      
      // Recursively fetch each downline agent's own downline
      const downlineWithHierarchy = await Promise.all(
        downlineArray.map(async (downlineAgent) => {
          return await fetchAgentWithDownline(downlineAgent.id);
        })
      );
      
      // Filter out null values and sort by tier or name
      const validDownline = downlineWithHierarchy
        .filter(Boolean)
        .sort((a, b) => 
          (parseInt((b?.tier || '').replace(/[^0-9]/g, '') || '0') - 
          parseInt((a?.tier || '').replace(/[^0-9]/g, '') || '0')) || 
          ((a?.name || '').localeCompare(b?.name || ''))
        );
      
      // Calculate commissions
      const personalCommission = calculatePersonalCommission(agentData);
      const overrideCommission = calculateOverrideCommission(agentData, validDownline);
      const totalCommission = personalCommission + overrideCommission;
      
      // Return the agent with their downline
      return {
        id: agentData.id,
        name: agentData.full_name,
        email: agentData.email,
        tier: agentData.tier_name,
        commission: agentData.commission_percentage,
        avatar: agentData.avatar_url,
        rank: agentData.tier_name,
        phone: agentData.phone,
        joinDate: agentData.join_date,
        transactions: agentData.total_transactions,
        salesVolume: agentData.total_sales || 0,
        personalCommission,
        overrideCommission,
        totalCommission,
        downline: validDownline as AgentWithHierarchy[]
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
        
        const { data, error } = await supabase.rpc('get_team_performance_metrics', {
          p_agent_id: targetAgentId
        });
        
        if (error) throw error;
        return data;
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
    hierarchyError,
    updateAgentUpline,
    isAdmin
  };
}

export default useTeamManagement;
