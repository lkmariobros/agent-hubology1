
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
}
