
/**
 * Format currency values for display
 * Used in commission-related components
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculate the total of all installment percentages
 */
export function calculateTotalPercentage(installments: { percentage: number }[]): number {
  return installments.reduce((sum, installment) => sum + (installment.percentage || 0), 0);
}

/**
 * Format a date for display
 */
export function formatScheduledDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get appropriate CSS class for payment status
 */
export function getStatusClass(status: string): string {
  switch (status) {
    case 'Pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Processing':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Paid':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Cancelled':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Determine if a payment is overdue
 */
export function isPaymentOverdue(scheduledDate: string): boolean {
  if (!scheduledDate) return false;
  
  const today = new Date();
  const paymentDate = new Date(scheduledDate);
  
  return paymentDate < today;
}
