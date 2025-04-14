
import { TransactionFormData } from '@/context/TransactionForm/types';

// Format currency for display
export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Check if transaction is a rental
export const isRentalTransaction = (transactionType: string | undefined): boolean => {
  return transactionType === 'Rent';
};

// Get the appropriate label for transaction value based on transaction type
export const getTransactionValueLabel = (transactionType: string | undefined): string => {
  return isRentalTransaction(transactionType) ? "Monthly Rental Value" : "Transaction Value";
};

// Get status badge styling
export const getStatusBadgeClass = (status: string) => {
  switch(status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Under Review':
      return 'bg-blue-100 text-blue-800';
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Ready for Payment':
      return 'bg-purple-100 text-purple-800';
    case 'Paid':
      return 'bg-gray-100 text-gray-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format date for display
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
