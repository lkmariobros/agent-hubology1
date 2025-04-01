
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

// Add PaymentSchedule and related types
export interface ScheduleInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  percentage: number;
  daysAfterTransaction: number;
  description?: string;
}

export interface PaymentSchedule {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
  installments: ScheduleInstallment[];
}

export interface CommissionInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  agentId: string;
  amount: number;
  percentage: number;
  scheduledDate: string;
  actualPaymentDate?: string | null;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  transaction?: {
    property?: {
      title?: string;
      address?: string;
    };
    agent?: {
      first_name?: string;
      last_name?: string;
    };
  };
}
