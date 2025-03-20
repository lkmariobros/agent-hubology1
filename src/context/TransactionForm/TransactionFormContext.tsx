
import React, { createContext, ReactNode, useEffect } from 'react';
import { TransactionFormContextType } from './types';
import { useTransactionFormActions } from './actions';

// Create context
export const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Provider component
export const TransactionFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    state, 
    updateFormData,
    updateTransactionType,
    addDocument,
    removeDocument,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    saveForm,
    submitForm,
    calculateCommission,
    validateCurrentStep
  } = useTransactionFormActions();

  // Auto-save functionality
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    
    if (state.isDirty) {
      saveTimer = setTimeout(() => {
        saveForm();
      }, 120000); // Auto-save every 2 minutes if form is dirty
    }
    
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [state.isDirty, state.formData, saveForm]);

  // Calculate commission amount when transaction value or rate changes
  useEffect(() => {
    const { transactionValue, commissionRate } = state.formData;
    if (transactionValue && commissionRate) {
      const commissionAmount = (transactionValue * commissionRate) / 100;
      
      if (commissionAmount !== state.formData.commissionAmount) {
        updateFormData({ commissionAmount });
      }
    }
  }, [state.formData.transactionValue, state.formData.commissionRate, updateFormData]);

  const contextValue: TransactionFormContextType = {
    state,
    updateFormData,
    updateTransactionType,
    addDocument,
    removeDocument,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    saveForm,
    submitForm,
    calculateCommission,
    validateCurrentStep,
  };

  return (
    <TransactionFormContext.Provider value={contextValue}>
      {children}
    </TransactionFormContext.Provider>
  );
};
