
/**
 * Utility functions for handling commission schedules and installments
 */

/**
 * Format a currency value
 * @param value The numeric value to format
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

/**
 * Calculate installment amounts for a commission
 * @param commissionAmount The total commission amount
 * @param percentageArray Array of percentage values
 */
export const calculateInstallmentAmounts = (
  commissionAmount: number,
  percentageArray: number[]
): number[] => {
  return percentageArray.map(percentage => {
    const amount = (commissionAmount * percentage) / 100;
    return Math.round(amount * 100) / 100; // Round to 2 decimal places
  });
};

/**
 * Check if installment percentages sum to 100%
 * @param percentageArray Array of percentage values
 */
export const validateInstallmentPercentages = (
  percentageArray: number[]
): boolean => {
  const sum = percentageArray.reduce((acc, cur) => acc + cur, 0);
  return Math.round(sum) === 100;
};

/**
 * Get a status badge color based on installment status
 * @param status Installment status
 */
export const getInstallmentStatusColor = (status: string): string => {
  switch (status) {
    case 'Paid':
      return 'bg-green-500';
    case 'Processing':
      return 'bg-blue-500';
    case 'Pending':
      return 'bg-yellow-500';
    case 'Projected':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};
