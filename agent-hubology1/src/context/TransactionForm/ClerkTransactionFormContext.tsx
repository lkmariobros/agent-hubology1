import React, { createContext, useContext, ReactNode } from 'react';
import { useClerkTransactionFormActions } from './clerkActions';
import { TransactionFormContextType } from './types';

// Create the context
export const ClerkTransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Provider component
export const ClerkTransactionFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const actions = useClerkTransactionFormActions();
  
  return (
    <ClerkTransactionFormContext.Provider value={actions}>
      {children}
    </ClerkTransactionFormContext.Provider>
  );
};

// Custom hook to use the ClerkTransactionForm context
export const useClerkTransactionForm = (): TransactionFormContextType => {
  const context = useContext(ClerkTransactionFormContext);
  if (context === undefined) {
    throw new Error('useClerkTransactionForm must be used within a ClerkTransactionFormProvider');
  }
  return context;
};