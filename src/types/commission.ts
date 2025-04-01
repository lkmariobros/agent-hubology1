
import { AgentRank } from './index';

// Base commission tier structure
export interface CommissionTier {
  id: string;
  name: string;
  rank: AgentRank;
  agentPercentage: number;
  minTransactions?: number;
  minSalesVolume?: number;
  isDefault?: boolean;
  thresholdAmount?: number;
  tier?: string;
  rate?: number;
  color?: string;
}

// Commission payment schedule
export interface PaymentSchedule {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  installments: ScheduleInstallment[];
  createdAt?: string;
  updatedAt?: string;
}

// Individual installment in a payment schedule
export interface ScheduleInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  percentage: number;
  daysAfterTransaction: number;
  description?: string;
}

// Commission installment (actual payment record)
export interface CommissionInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  agentId: string;
  amount: number;
  percentage: number;
  scheduledDate: string;
  status: 'Pending' | 'Processing' | 'Paid' | 'Cancelled';
  actualPaymentDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Include transaction data in the response
  transaction?: {
    property?: {
      title: string;
      address?: string;
    };
    agent?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

// Commission forecast grouped by month
export interface CommissionForecast {
  month: string;
  totalAmount: number;
  installments: CommissionInstallment[];
}

// Consolidated RankRequirement interface to avoid duplication
export interface RankRequirement {
  minSalesVolume: number;
  minTransactions: number;
  overrideRate: number;
  rank?: string;
  color?: string;
  personalSales?: number;
  recruitedAgents?: number;
}
