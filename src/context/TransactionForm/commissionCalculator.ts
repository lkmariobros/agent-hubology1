
import { CommissionBreakdown, TransactionFormData, AgentRank } from './types';
import { getAgentCommissionPercentage } from './agentTiers';

// Calculate commission breakdown - handles both rental and sales transactions
export const calculateCommission = (formData: TransactionFormData): CommissionBreakdown => {
  const { transactionValue, commissionRate, commissionAmount, transactionType, coBroking, agentTier = 'Advisor' } = formData;
  
  // Calculate basic values
  const isRental = transactionType === 'Rent';
  
  // For rentals, use the commission amount directly (owner-provided commission)
  // For sales/primary, calculate based on rate
  const totalCommission = isRental 
    ? (commissionAmount || 0) 
    : (transactionValue * commissionRate) / 100;
  
  // Get the agent's commission percentage based on their tier
  const agentTierPercentage = getAgentCommissionPercentage(agentTier);
  const agencyTierPercentage = 100 - agentTierPercentage;
  
  // Calculate split percentages for co-broking scenario
  const agencySplitPercentage = coBroking?.enabled ? (coBroking.commissionSplit || 50) : 100;
  const coAgencySplitPercentage = coBroking?.enabled ? (100 - agencySplitPercentage) : 0;
  
  // Calculate our agency's portion of the commission
  const ourAgencyCommission = totalCommission * (agencySplitPercentage / 100);
  
  // Calculate co-broker's agency portion
  const coAgencyCommission = coBroking?.enabled 
    ? totalCommission * (coAgencySplitPercentage / 100)
    : 0;
  
  // From our agency's portion, calculate agent and agency shares
  const agencyShare = ourAgencyCommission * (agencyTierPercentage / 100);
  const agentShare = ourAgencyCommission * (agentTierPercentage / 100);
  
  return {
    transactionValue: transactionValue || 0,
    commissionRate: commissionRate || 0,
    totalCommission,
    agencyShare,
    agentShare,
    ourAgencyCommission,
    coAgencyCommission,
    agentTier,
    agentCommissionPercentage: agentTierPercentage
  };
};
