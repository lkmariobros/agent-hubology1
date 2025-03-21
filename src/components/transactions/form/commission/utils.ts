
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
