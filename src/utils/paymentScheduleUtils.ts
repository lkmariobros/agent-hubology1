
import { format, addDays } from 'date-fns';
import { PaymentSchedule, CommissionInstallment, ScheduleInstallment } from '@/types/commission';
import { formatCurrency } from '@/lib/utils';

/**
 * Generates a human-readable summary of a payment schedule
 */
export function getScheduleSummary(schedule: PaymentSchedule): string {
  if (!schedule.installments || schedule.installments.length === 0) {
    return 'No installments defined';
  }
  
  const installmentCount = schedule.installments.length;
  
  if (installmentCount === 1) {
    return 'One-time payment (100%)';
  }
  
  const firstPayment = schedule.installments.find(i => i.installmentNumber === 1);
  const lastPayment = schedule.installments.find(i => i.installmentNumber === installmentCount);
  
  if (firstPayment && lastPayment) {
    return `${installmentCount} installments (${firstPayment.percentage}% initial, ${lastPayment.percentage}% final)`;
  }
  
  return `${installmentCount} installments`;
}

/**
 * Formats a date based on days after a transaction date
 */
export function formatEstimatedDate(transactionDate: Date, daysAfter: number): string {
  const estimatedDate = addDays(transactionDate, daysAfter);
  return format(estimatedDate, 'MMM d, yyyy');
}

/**
 * Calculates the payment amount for an installment based on percentage and total amount
 */
export function calculateInstallmentAmount(percentage: number, totalAmount: number): number {
  return (percentage / 100) * totalAmount;
}

/**
 * Creates a formatted string representation of an installment
 */
export function formatInstallment(
  installment: ScheduleInstallment, 
  totalAmount: number,
  transactionDate?: Date
): string {
  const amount = calculateInstallmentAmount(installment.percentage, totalAmount);
  let result = `Installment ${installment.installmentNumber}: ${formatCurrency(amount)} (${installment.percentage}%)`;
  
  if (transactionDate) {
    result += ` - due ${formatEstimatedDate(transactionDate, installment.daysAfterTransaction)}`;
  } else {
    result += ` - due ${installment.daysAfterTransaction} days after transaction`;
  }
  
  return result;
}

/**
 * Group installments by month for charting/display
 */
export function groupInstallmentsByMonth(installments: CommissionInstallment[]): Record<string, number> {
  return installments.reduce((acc, installment) => {
    const month = format(new Date(installment.scheduledDate), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + installment.amount;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get appropriate CSS classes for status badges
 */
export function getStatusBadgeClasses(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    case 'ready for payment':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
