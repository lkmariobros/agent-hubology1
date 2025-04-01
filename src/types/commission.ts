
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

// New types for commission payment schedules
export interface PaymentSchedule {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  installments: ScheduleInstallment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  percentage: number;
  daysAfterTransaction: number;
  description?: string;
}

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
}

export interface CommissionForecast {
  month: string;
  totalAmount: number;
  installments: CommissionInstallment[];
}
