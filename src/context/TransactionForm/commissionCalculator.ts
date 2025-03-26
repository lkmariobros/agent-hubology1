
import { TransactionFormData, CommissionBreakdown } from './types';
import { getAgentCommissionPercentage } from './agentTiers';
import { stringToAgentRank } from '@/utils/typeConversions';

export const calculateCommission = (formData: TransactionFormData): CommissionBreakdown => {
  const {
    transactionValue = 0,
    commissionRate = 0,
    agentTier = 'Advisor',
    coBroking
  } = formData;
  
  // Convert string to AgentRank type if needed
  const agentRankTier = stringToAgentRank(agentTier as string);
  
  // Get agent tier percentage
  const agentCommissionPercentage = getAgentCommissionPercentage(agentRankTier);
  
  // Calculate basic commission values
  let totalCommission = (transactionValue * commissionRate) / 100;
  
  // Handle co-broking split
  const agencySplitPercentage = coBroking?.enabled ? (coBroking.commissionSplit || 50) : 100;
  const coAgencySplitPercentage = coBroking?.enabled ? (100 - agencySplitPercentage) : 0;
  
  // Our agency's portion of the total commission
  const ourAgencyCommission = totalCommission * (agencySplitPercentage / 100);
  
  // Co-broker agency's portion
  const coAgencyCommission = coBroking?.enabled 
    ? totalCommission * (coAgencySplitPercentage / 100)
    : undefined;
  
  // From our agency's portion, calculate agent and agency shares
  const agentShare = ourAgencyCommission * (agentCommissionPercentage / 100);
  const agencyShare = ourAgencyCommission * ((100 - agentCommissionPercentage) / 100);
  
  return {
    totalCommission,
    agencyShare,
    agentShare,
    ourAgencyCommission,
    coAgencyCommission,
    agentTier: agentRankTier,
    agentCommissionPercentage,
    transactionValue,
    commissionRate
  };
};
