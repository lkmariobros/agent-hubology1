
import React, { createContext, useContext, ReactNode } from 'react';
import { useTransactionFormActions } from './actions';
import { TransactionFormContextType } from '@/types/transaction-form';

// Create the context
const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Provider component
export const TransactionFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const actions = useTransactionFormActions();
  
  return (
    <TransactionFormContext.Provider value={actions}>
      {children}
    </TransactionFormContext.Provider>
  );
};

// Custom hook to use the TransactionForm context
export const useTransactionForm = (): TransactionFormContextType => {
  const context = useContext(TransactionFormContext);
  if (context === undefined) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  return context;
};
