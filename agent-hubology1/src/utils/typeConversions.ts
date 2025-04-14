
import { TransactionType, AgentRank } from '@/types/transaction-form';

export const stringToTransactionType = (str: string): TransactionType => {
  switch (str) {
    case 'Sale':
      return 'Sale';
    case 'Rent':
      return 'Rent';
    case 'Developer':
      return 'Developer';
    default:
      return 'Sale'; // Default to Sale if unknown
  }
};

export const stringToAgentRank = (str: string): AgentRank => {
  switch (str) {
    case 'Associate':
      return 'Associate';
    case 'Senior Associate':
      return 'Senior Associate';
    case 'Advisor':
      return 'Advisor';
    case 'Sales Leader':
      return 'Sales Leader';
    case 'Team Leader':
      return 'Team Leader';
    case 'Group Leader':
      return 'Group Leader';
    case 'Director':
      return 'Director';
    case 'Supreme Leader':
      return 'Supreme Leader';
    default:
      return 'Advisor'; // Default to Advisor if unknown
  }
};
