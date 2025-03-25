
import { TransactionFormData, CommissionBreakdown, AgentRank } from './types';

// Agent tier commission percentages
const AGENT_TIER_PERCENTAGES: Record<AgentRank, number> = {
  'Advisor': 70,
  'Sales Leader': 80,
  'Team Leader': 83,
  'Group Leader': 85,
  'Supreme Leader': 85
};

// Calculate commission breakdown for a transaction
export const calculateCommission = (formData: TransactionFormData): CommissionBreakdown => {
  const { 
    transactionValue = 0, 
    commissionRate = 0, 
    coBroking, 
    agentTier = 'Advisor' 
  } = formData;
  
  // Calculate total commission
  const totalCommission = (transactionValue * commissionRate) / 100;
  
  // Get agent's tier-based percentage
  const agentTierPercentage = AGENT_TIER_PERCENTAGES[agentTier] || 70;
  
  // Calculate split percentages for co-broking scenario
  const agencySplitPercentage = coBroking?.enabled ? (coBroking.commissionSplit || 50) : 100;
  const coAgencySplitPercentage = coBroking?.enabled ? (100 - agencySplitPercentage) : 0;
  
  // Our agency's portion of the total commission
  const ourAgencyCommission = totalCommission * (agencySplitPercentage / 100);
  
  // Co-broker agency's portion
  const coAgencyCommission = coBroking?.enabled 
    ? totalCommission * (coAgencySplitPercentage / 100)
    : undefined;
  
  // From our agency's portion, calculate agent and agency shares
  const agentShare = ourAgencyCommission * (agentTierPercentage / 100);
  const agencyShare = ourAgencyCommission * ((100 - agentTierPercentage) / 100);
  
  return {
    totalCommission,
    agencyShare,
    agentShare,
    ourAgencyCommission,
    coAgencyCommission,
    agentTier,
    agentCommissionPercentage: agentTierPercentage,
    // Add these for display purposes
    transactionValue,
    commissionRate
  };
};
