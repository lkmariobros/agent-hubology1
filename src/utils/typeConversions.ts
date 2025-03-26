
import { AgentRank, TransactionType } from '@/types';

/**
 * Safely converts a string to AgentRank type
 */
export const stringToAgentRank = (value: string): AgentRank => {
  const validRanks: AgentRank[] = [
    'Associate', 'Senior Associate', 'Advisor', 'Sales Leader', 
    'Team Leader', 'Group Leader', 'Director', 'Supreme Leader'
  ];
  
  return validRanks.includes(value as AgentRank) 
    ? (value as AgentRank) 
    : 'Advisor';
};

/**
 * Safely converts a string to TransactionType type
 */
export const stringToTransactionType = (value: string): TransactionType => {
  const validTypes: TransactionType[] = ['Sale', 'Rent', 'Developer'];
  
  return validTypes.includes(value as TransactionType)
    ? (value as TransactionType)
    : 'Sale';
};
