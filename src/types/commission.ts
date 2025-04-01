
import { AgentRank } from './index';

export interface CommissionTier {
  id: string;
  name: string;
  rank: AgentRank;
  agentPercentage: number;
  minTransactions?: number;
  minSalesVolume?: number;
  isDefault?: boolean;
  thresholdAmount?: number;
  // Properties needed by CommissionTiers component
  tier?: string;
  rate?: number;
  color?: string;
}
