
import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { 
  TransactionFormState, 
  TransactionFormContextType, 
  TransactionFormData, 
  TransactionDocument, 
  TransactionType,
  CommissionBreakdown
} from '../../types/transaction-form';
import { transactionFormReducer } from './reducer';
import { initialTransactionFormState } from './initialState';
import { saveFormAsDraft, submitTransactionForm } from './formSubmission';
import { toast } from 'sonner';

// Create context
export const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Provider component
export const TransactionFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionFormReducer, initialTransactionFormState);

  // Auto-save functionality
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    
    if (state.isDirty) {
      saveTimer = setTimeout(() => {
        saveForm();
      }, 60000); // Auto-save every minute if form is dirty
    }
    
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [state.isDirty, state.formData]);

  // Update form data
  const updateFormData = useCallback((data: Partial<TransactionFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  // Update transaction type
  const updateTransactionType = useCallback((type: TransactionType) => {
    dispatch({ type: 'UPDATE_TRANSACTION_TYPE', payload: type });
  }, []);

  // Document management
  const addDocument = useCallback((document: TransactionDocument) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: document });
  }, []);

  const removeDocument = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: index });
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      dispatch({ type: 'NEXT_STEP' });
    }
  }, [state.currentStep, state.formData]);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Calculate commission
  const calculateCommission = useCallback((): CommissionBreakdown => {
    const { transactionValue, commissionRate, coBroking } = state.formData;
    
    const totalCommission = (transactionValue * commissionRate) / 100;
    const agencyShare = totalCommission * 0.3; // 30% to agency
    
    let agentShare = totalCommission * 0.7; // 70% to agent
    let coAgentShare = 0;
    
    // If co-broking is enabled, split the agent share
    if (coBroking && coBroking.enabled) {
      coAgentShare = (agentShare * coBroking.commissionSplit) / 100;
      agentShare = agentShare - coAgentShare;
    }
    
    return {
      transactionValue,
      commissionRate,
      totalCommission,
      agencyShare,
      agentShare,
      coAgentShare: coBroking.enabled ? coAgentShare : undefined
    };
  }, [state.formData]);

  // Validation
  const validateCurrentStep = useCallback((): boolean => {
    const { currentStep, formData } = state;
    let errors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0: // Transaction Type
        if (!formData.transactionType) {
          errors.transactionType = 'Transaction type is required';
        }
        break;
      case 1: // Property Details
        if (!formData.property && !formData.propertyId) {
          errors.property = 'Property information is required';
        }
        break;
      case 2: // Client Information
        if (formData.transactionType === 'Sale') {
          if (!formData.buyer?.name) errors.buyerName = 'Buyer name is required';
          if (!formData.seller?.name) errors.sellerName = 'Seller name is required';
        } else if (formData.transactionType === 'Rent') {
          if (!formData.tenant?.name) errors.tenantName = 'Tenant name is required';
          if (!formData.landlord?.name) errors.landlordName = 'Landlord name is required';
        } else if (formData.transactionType === 'Primary') {
          if (!formData.buyer?.name) errors.buyerName = 'Buyer name is required';
          if (!formData.developer?.name) errors.developerName = 'Developer name is required';
        }
        break;
      case 3: // Co-Broking
        if (formData.coBroking.enabled) {
          if (!formData.coBroking.agentName) errors.coAgentName = 'Co-agent name is required';
          if (!formData.coBroking.agentCompany) errors.coAgentCompany = 'Co-agent company is required';
        }
        break;
      case 4: // Commission
        if (formData.transactionValue <= 0) errors.transactionValue = 'Transaction value must be greater than 0';
        if (formData.commissionRate <= 0) errors.commissionRate = 'Commission rate must be greater than 0';
        break;
    }
    
    dispatch({ type: 'SET_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  }, [state]);

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
      toast.error('Please fix the errors before submitting');
      return Promise.reject(new Error('Validation failed'));
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

// Custom hook to use the TransactionForm context
export const useTransactionForm = (): TransactionFormContextType => {
  const context = useContext(TransactionFormContext);
  if (context === undefined) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  return context;
};
