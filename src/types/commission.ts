
export interface CommissionTier {
  id: string;
  name: string;
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
  rank: string;
  percentage: number; // Instead of agentPercentage
  commissionRate: number;
  requirements: string[];
}

export interface CommissionBreakdown {
  totalCommission: number;
  agencyShare: number;
  agentShare: number;
  coAgencyCommission?: number;
  agentCommissionPercentage?: number;
  notes?: string;
}

export interface CommissionSummary {
  personal: number;
  override: number;
  total: number;
  pending: number;
  paid: number;
}

export interface CommissionHistory {
  id: string;
  transactionId: string;
  property: {
    title: string;
    location: string;
  };
  date: string;
  amount: number;
  type: 'personal' | 'override';
  source?: string;
  status: string;
}

export interface PaymentSchedule {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  installments: PaymentInstallment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  percentage: number;
  daysAfterTransaction: number;
  description?: string;
}

export interface CommissionApproval {
  id: string;
  transactionId: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Ready for Payment' | 'Paid';
  submittedBy: string;
  reviewerId?: string;
  reviewedAt?: string;
  notes?: string;
  thresholdExceeded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OverrideCommission {
  id: string;
  agentId: string;
  downlineAgentId: string;
  transactionId?: string;
  amount: number;
  percentage: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Paid';
}
