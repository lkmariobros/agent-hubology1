
import React, { createContext, useReducer, ReactNode, useCallback } from 'react';
import { 
  TransactionFormState, 
  TransactionFormContextType, 
  TransactionFormData, 
  TransactionDocument, 
  TransactionType, 
  CommissionBreakdown
} from './types';
import { transactionFormReducer } from './reducer';
import { initialTransactionFormState } from './initialState';
import { saveFormAsDraft, submitTransactionForm } from './formSubmission';
import { calculateCommission } from './commissionCalculator';
import { validateStep } from './stepValidator';

// Create context with undefined initial value
const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Provider component
export const TransactionFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionFormReducer, initialTransactionFormState);
  
  console.log('TransactionFormProvider rendered with state:', state);

  // Update form data
  const updateFormData = useCallback((data: Partial<TransactionFormData>) => {
    console.log('updateFormData called with:', data);
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  // Update transaction type
  const updateTransactionType = useCallback((type: TransactionType) => {
    console.log('updateTransactionType called with:', type);
    dispatch({ type: 'UPDATE_TRANSACTION_TYPE', payload: type });
  }, []);

  // Document management functions
  const addDocument = useCallback((document: TransactionDocument) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: document });
  }, []);

  const removeDocument = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: index });
  }, []);

  // Navigation functions
  const nextStep = useCallback(() => {
    console.log('nextStep called, validating current step');
    if (validateCurrentStep()) {
      console.log('Validation passed, dispatching NEXT_STEP');
      dispatch({ type: 'NEXT_STEP' });
      return true;
    }
    console.log('Validation failed, not proceeding to next step');
    return false;
  }, [state]);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const errors = validateStep(state);
    
    // Update the state with any validation errors
    dispatch({ type: 'SET_ERRORS', payload: errors });
    
    // Return true if there are no errors
    return Object.keys(errors).length === 0;
  }, [state]);

  // Reset form
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Save form as draft
  const saveForm = useCallback(async () => {
    try {
      await saveFormAsDraft(state);
      dispatch({ type: 'FORM_SAVED', payload: new Date() });
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving form:', error);
      return Promise.reject(error);
    }
  }, [state]);

  // Submit form
  const submitForm = useCallback(async () => {
    if (!validateCurrentStep()) {
      return Promise.reject(new Error('Please fix validation errors before submitting'));
    }
    
    dispatch({ type: 'SUBMITTING', payload: true });
    
    try {
      await submitTransactionForm(state);
      dispatch({ type: 'SUBMITTING', payload: false });
      resetForm();
      return Promise.resolve();
    } catch (error) {
      dispatch({ type: 'SUBMITTING', payload: false });
      return Promise.reject(error);
    }
  }, [state, resetForm, validateCurrentStep]);

  // Wrapper for calculateCommission that uses the current form data
  const calculateCommissionWithState = useCallback((): CommissionBreakdown => {
    return calculateCommission(state.formData);
  }, [state.formData]);
  
  // Create context value object
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
    calculateCommission: calculateCommissionWithState,
    validateCurrentStep,
  };

  return (
    <TransactionFormContext.Provider value={contextValue}>
      {children}
    </TransactionFormContext.Provider>
  );
};

// Export the context
export { TransactionFormContext };
