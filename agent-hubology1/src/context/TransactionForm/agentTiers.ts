
import { AgentRank } from '@/types';

// Agent tier commission percentages
export const AGENT_TIER_PERCENTAGES: Record<AgentRank, number> = {
  'Junior': 65,
  'Agent': 70,
  'Senior': 72,
  'Associate': 70,
  'Senior Associate': 75,
  'Advisor': 70,
  'Sales Leader': 80,
  'Team Leader': 83,
  'Group Leader': 85,
  'Director': 87,
  'Supreme Leader': 85
};

// Helper function to get agent's commission percentage based on their tier
export const getAgentCommissionPercentage = (tier: AgentRank): number => {
  return AGENT_TIER_PERCENTAGES[tier] || 70; // Default to 70% if tier not found
};
