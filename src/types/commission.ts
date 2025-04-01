
import { AgentRank } from './user';

export interface CommissionTier {
  id: string;
  name: string;
  commissionRate: number;
  requirements: string[];
  tier?: string;
  rate?: number;
  minTransactions?: number;
  color?: string;
  rank?: string;
  agentPercentage?: number;
}

export interface CommissionHistory {
  id: string;
  date: string;
  amount: number;
  property: string | {
    title: string;
    location: string;
  };
  status: string;
  type?: string;
  source?: string;
  transactionReference?: string;
  transactionId?: string;
}

export interface OverrideCommission {
  agentId: string;
  amount: number;
  id?: string;
  baseAgentId?: string;
  transactionId?: string;
  percentage?: number;
  status?: string;
  agentName?: string;
  rank?: string | AgentRank;
  tier?: string | AgentRank;
}

export interface ApprovalStatus {
  status: string;
  count: number;
  color: string;
}
