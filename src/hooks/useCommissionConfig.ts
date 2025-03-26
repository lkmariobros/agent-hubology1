import { AgentRank } from '@/types';

export interface RankRequirement {
  minSalesVolume: number;
  minTransactions: number;
  overrideRate: number;
  rank?: string;
  color?: string;
  personalSales?: number;
  recruitedAgents?: number;
}
