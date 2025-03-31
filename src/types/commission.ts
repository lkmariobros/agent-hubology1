export type AgentRank =
  | 'Advisor'
  | 'Sales Leader'
  | 'Team Leader'
  | 'Group Leader'
  | 'Supreme Leader';

export interface AgentWithHierarchy {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rank: string;
  joinDate: string;
  transactions: number;
  salesVolume: number;
  personalCommission: number;
  overrideCommission: number;
  totalCommission: number;
  upline?: AgentWithHierarchy;
  downline?: AgentWithHierarchy[];
}

export interface CommissionHistory {
  id: string;
  transactionReference: string;
  property: {
    title: string;
    location: string;
  };
  date: string;
  amount: number;
  type: 'personal' | 'override';
  source?: string;
}

export interface CommissionTier {
  id: string;
  name: string;
  tier: string;
  rate: number;
  minTransactions: number;
  color: string;
  rank: string;
  agentPercentage: number;
}

export interface OverrideCommission {
  id: string;
  agentId: string;
  baseAgentId: string;
  transactionId: string;
  percentage: number;
  amount: number;
  status: string;
  agentName: string;
  rank: AgentRank;
}

// Commission Payment Schedule types
export interface CommissionPaymentSchedule {
  id: string;
  commission_approval_id: string;
  transaction_id: string;
  agent_id: string;
  total_amount: number;
  remaining_amount: number;
  installments_count: number;
  start_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  installments?: CommissionInstallment[];
}

export interface CommissionInstallment {
  id: string;
  schedule_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: 'Pending' | 'Processing' | 'Paid' | 'Cancelled';
  payment_date?: string;
  processed_by?: string;
  notes?: string;
}

export interface CommissionForecastSettings {
  id: string;
  agency_id: string;
  payment_cutoff_day: number;
  default_installment_count: number;
  default_installment_amounts: InstallmentAmountConfig[];
  forecast_horizon_months: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  active: boolean;
}

export interface InstallmentAmountConfig {
  number: number;
  amount: number | 'remainder';
}

export interface ForecastPeriod {
  month: string; // YYYY-MM format
  expectedAmount: number;
  confirmedAmount: number;
  pendingAmount: number;
}

export interface CommissionForecast {
  totalExpected: number;
  periods: ForecastPeriod[];
}
