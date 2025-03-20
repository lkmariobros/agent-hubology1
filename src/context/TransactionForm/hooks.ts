
import { useContext } from 'react';
import { TransactionFormContext } from './TransactionFormContext';
import { TransactionFormContextType } from './types';

// Custom hook to use the TransactionForm context
export const useTransactionForm = (): TransactionFormContextType => {
  const context = useContext(TransactionFormContext);
  
  if (!context) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  
  return context;
};
