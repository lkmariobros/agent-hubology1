
// Payment schedule types
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
  createdAt: string;
  updatedAt: string;
  installments: ScheduleInstallment[];
}

// Commission installment types
export interface CommissionInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  amount: number;
  percentage: number;
  scheduledDate: string;
  actualPaymentDate?: string;
  status: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
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

// Commission history type
export interface CommissionHistory {
  id: string;
  transactionId: string;
  transactionReference?: string;
  property: string | { title: string; location: string };
  date: string;
  amount: number;
  type: 'personal' | 'override';
  source?: string;
  status: string;
}

// Commission tier type
export interface CommissionTier {
  id: string;
  name: string;
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
  rank: string;
  agentPercentage: number;
  commissionRate: number;
  requirements: string[];
}

// Override commission type
export interface OverrideCommission {
  id: string;
  agentId: string;
  baseAgentId: string;
  transactionId: string;
  percentage: number;
  amount: number;
  status: string;
  agentName: string;
  rank: string;
  tier: string;
}
