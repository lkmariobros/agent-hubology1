
/**
 * Format a number as USD currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate commission based on transaction value and rate
 */
export const calculateCommission = (transactionValue: number, commissionRate: number): number => {
  return (transactionValue * commissionRate) / 100;
};

/**
 * Get status color based on transaction or approval status
 */
export const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case 'completed':
    case 'approved':
    case 'paid':
      return 'text-green-500';
    case 'pending':
    case 'under review':
    case 'ready for payment':
      return 'text-amber-500';
    case 'cancelled':
    case 'rejected':
      return 'text-red-500';
    case 'draft':
    case 'in progress':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};
