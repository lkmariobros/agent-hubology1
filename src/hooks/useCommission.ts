
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionApi } from '@/lib/api';
import { AgentRank, AgentWithHierarchy, CommissionTier, OverrideCommission } from '@/types';

// Get commission summary (current month, previous month, year to date)
export function useCommissionSummary() {
  return useQuery({
    queryKey: ['commission', 'summary'],
    queryFn: commissionApi.getSummary,
  });
}

// Get commission history with pagination
export function useCommissionHistory(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['commission', 'history', page, pageSize],
    queryFn: () => commissionApi.getHistory(page, pageSize),
    meta: {
      keepPreviousData: true
    }
  });
}

// Get commission tiers with proper typing
export function useCommissionTiers() {
  return useQuery<CommissionTier[]>({
    queryKey: ['commission', 'tiers'],
    queryFn: () => {
      const response = commissionApi.getTiers();
      return response.then(data => {
        // Handle the API response and transform it into CommissionTier[]
        return data.data || [];
      });
    },
  });
}

// Get agent hierarchy data (for org chart) with proper typing
export function useAgentHierarchy(agentId?: string) {
  return useQuery<AgentWithHierarchy>({
    queryKey: ['agents', 'hierarchy', agentId],
    queryFn: () => {
      const response = commissionApi.getAgentHierarchy(agentId);
      return response.then(data => {
        // Return the data from the API response or fallback to null
        return data.data || null;
      });
    },
    enabled: !!agentId,
  });
}

// Get agent's downline (direct reports)
export function useAgentDownline(agentId?: string) {
  return useQuery({
    queryKey: ['agents', 'downline', agentId],
    queryFn: () => commissionApi.getAgentDownline(agentId),
    enabled: !!agentId,
  });
}

// Calculate expected commission based on property price and agent tier
export function calculateCommission(propertyPrice: number, commissionRate: number): number {
  return propertyPrice * (commissionRate / 100);
}

// Calculate override commissions for upline agents
export function calculateOverrideCommissions(
  baseCommission: number, 
  agent: AgentWithHierarchy
): OverrideCommission[] {
  const overrides: OverrideCommission[] = [];
  
  if (!agent.upline) return overrides;
  
  let currentAgent = agent;
  let currentUpline = agent.upline;
  
  // Apply override percentages based on rank
  while (currentUpline) {
    // Only apply override if upline's rank is higher than the agent's rank
    if (getRankLevel(currentUpline.rank) > getRankLevel(currentAgent.rank)) {
      const overridePercentage = getOverridePercentage(currentUpline.rank);
      const overrideAmount = baseCommission * (overridePercentage / 100);
      
      overrides.push({
        agentId: currentUpline.id,
        agentName: currentUpline.name,
        rank: currentUpline.rank,
        percentage: overridePercentage,
        amount: overrideAmount
      });
    }
    
    currentAgent = currentUpline;
    currentUpline = currentUpline.upline;
  }
  
  return overrides;
}

// Helper function to get override percentage based on rank
function getOverridePercentage(rank: AgentRank): number {
  switch (rank) {
    case 'Sales Leader':
      return 7;
    case 'Team Leader':
      return 5;
    case 'Group Leader':
      return 8;
    case 'Supreme Leader':
      return 6;
    default:
      return 0;
  }
}

// Helper function to get rank level (higher number = higher rank)
function getRankLevel(rank: AgentRank): number {
  switch (rank) {
    case 'Advisor':
      return 1;
    case 'Sales Leader':
      return 2;
    case 'Team Leader':
      return 3;
    case 'Group Leader':
      return 4;
    case 'Supreme Leader':
      return 5;
    default:
      return 0;
  }
}

// Update agent rank
export function useUpdateAgentRank() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: commissionApi.updateAgentRank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });
}

// Add new agent to hierarchy
export function useAddAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: commissionApi.addAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });
}
