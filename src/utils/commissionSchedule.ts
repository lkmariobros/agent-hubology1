
import { PaymentSchedule, ScheduleInstallment, CommissionInstallment } from '@/types/commission';
import { addDays, format } from 'date-fns';

/**
 * Generate commission installments based on a payment schedule
 */
export function generateInstallments(
  transactionId: string,
  agentId: string,
  totalCommission: number,
  paymentSchedule: PaymentSchedule,
  transactionDate: Date
): CommissionInstallment[] {
  if (!paymentSchedule.installments || paymentSchedule.installments.length === 0) {
    console.error('Payment schedule has no installments defined');
    return [];
  }
  
  // Verify total percentage adds up to 100%
  const totalPercentage = paymentSchedule.installments.reduce(
    (sum, installment) => sum + installment.percentage, 
    0
  );
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    console.warn(`Payment schedule percentages do not add up to 100%. Total: ${totalPercentage}%`);
  }
  
  // Generate installments
  return paymentSchedule.installments.map(installment => {
    const amount = (totalCommission * installment.percentage) / 100;
    const scheduledDate = addDays(transactionDate, installment.daysAfterTransaction);
    
    return {
      id: '', // Will be assigned by the backend
      transactionId,
      installmentNumber: installment.installmentNumber,
      agentId,
      amount,
      percentage: installment.percentage,
      scheduledDate: format(scheduledDate, 'yyyy-MM-dd'),
      status: 'Pending',
    };
  });
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Calculate total amount from a list of installments
 */
export function calculateTotalAmount(installments: CommissionInstallment[]): number {
  return installments.reduce((sum, installment) => sum + installment.amount, 0);
}

/**
 * Group commission installments by month for forecasting
 */
export function groupInstallmentsByMonth(installments: CommissionInstallment[]) {
  const grouped = installments.reduce((acc, installment) => {
    const month = installment.scheduledDate.substring(0, 7); // YYYY-MM format
    
    if (!acc[month]) {
      acc[month] = {
        month,
        totalAmount: 0,
        installments: []
      };
    }
    
    acc[month].installments.push(installment);
    acc[month].totalAmount += installment.amount;
    
    return acc;
  }, {} as Record<string, { month: string, totalAmount: number, installments: CommissionInstallment[] }>);
  
  // Convert to array and sort by month
  return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
}
