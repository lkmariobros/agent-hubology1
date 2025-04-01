
export interface CommissionInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  agentId: string;
  amount: number;
  percentage: number;
  scheduledDate: string;
  actualPaymentDate?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  transaction?: any;
  // Snake case alternatives for API compatibility
  transaction_id?: string;
  installment_number?: number;
  agent_id?: string;
  scheduled_date?: string;
  actual_payment_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionForecast {
  month: string;
  totalAmount: number;
  installments: CommissionInstallment[];
  // Snake case alternatives for API compatibility
  total_amount?: number;
}

export interface PaymentSchedule {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  installments: PaymentScheduleInstallment[];
}

export interface PaymentScheduleInstallment {
  id: string;
  scheduleId: string;
  installmentNumber: number;
  daysAfterTransaction: number;
  percentage: number;
  description?: string;
}

// Alias for backward compatibility
export type ScheduleInstallment = PaymentScheduleInstallment;

