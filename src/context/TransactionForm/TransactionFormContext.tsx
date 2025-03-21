
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { 
  TransactionFormState, 
  TransactionFormContextType, 
  TransactionFormData, 
  TransactionDocument, 
  TransactionType, 
  CommissionBreakdown,
  AgentRank
} from './types';
import { transactionFormReducer } from './reducer';
import { initialTransactionFormState } from './initialState';
import { saveFormAsDraft, submitTransactionForm } from './formSubmission';

// Create context with undefined initial value
const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Agent tier commission percentages
const AGENT_TIER_PERCENTAGES: Record<AgentRank, number> = {
  'Advisor': 70,
  'Sales Leader': 80,
  'Team Leader': 83,
  'Group Leader': 85,
  'Supreme Leader': 85
};

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
    const errors: Record<string, string> = {};
    const { formData, currentStep } = state;
    
    console.log('Validating step:', currentStep);
    console.log('Form data:', formData);
    
    switch (currentStep) {
      case 0: // Transaction Type
        // No validation needed for transaction type selection
        break;
        
      case 1: // Property Details
        if (!formData.property?.title) {
          errors.propertyTitle = 'Property title is required';
        }
        if (!formData.property?.address) {
          errors.propertyAddress = 'Property address is required';
        }
        break;
        
      case 2: // Client Information
        if (formData.transactionType === 'Sale' || formData.transactionType === 'Primary') {
          if (!formData.buyer?.name) {
            errors.buyerName = 'Buyer name is required';
          }
        }
        
        if (formData.transactionType === 'Sale') {
          if (!formData.seller?.name) {
            errors.sellerName = 'Seller name is required';
          }
        }
        
        if (formData.transactionType === 'Rent') {
          if (!formData.landlord?.name) {
            errors.landlordName = 'Landlord name is required';
          }
          if (!formData.tenant?.name) {
            errors.tenantName = 'Tenant name is required';
          }
        }
        
        if (formData.transactionType === 'Primary') {
          if (!formData.developer?.name) {
            errors.developerName = 'Developer name is required';
          }
        }
        break;
        
      case 3: // Co-Broking Setup
        if (formData.coBroking?.enabled) {
          if (!formData.coBroking.agentName) {
            errors.coAgentName = 'Co-broker agent name is required';
          }
          if (!formData.coBroking.agentCompany) {
            errors.coAgentCompany = 'Co-broker company is required';
          }
        }
        break;
        
      case 4: // Commission Calculation
        if (!formData.transactionValue || formData.transactionValue <= 0) {
          errors.transactionValue = 'Transaction value must be greater than 0';
        }
        if (!formData.commissionRate || formData.commissionRate <= 0) {
          errors.commissionRate = 'Commission rate must be greater than 0';
        }
        break;
        
      case 5: // Document Upload
        // Documents are optional
        break;
        
      case 6: // Review
        // All validations should be done in previous steps
        break;
    }
    
    console.log('Validation errors:', errors);
    
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

  // Helper function to get agent's commission percentage based on their tier
  const getAgentCommissionPercentage = (tier: AgentRank): number => {
    return AGENT_TIER_PERCENTAGES[tier] || 70; // Default to 70% if tier not found
  };

  // Calculate commission breakdown - updated to match business rules
  const calculateCommission = useCallback((): CommissionBreakdown => {
    const { transactionValue, commissionRate, coBroking, agentTier = 'Advisor' } = state.formData;
    
    // Calculate basic values
    const totalCommission = (transactionValue * commissionRate) / 100;
    
    // Get the agent's commission percentage based on their tier
    const agentTierPercentage = getAgentCommissionPercentage(agentTier);
    const agencyTierPercentage = 100 - agentTierPercentage;
    
    // Calculate split percentages for co-broking scenario
    const agencySplitPercentage = coBroking?.enabled ? (coBroking.commissionSplit || 50) : 100;
    const coAgencySplitPercentage = coBroking?.enabled ? (100 - agencySplitPercentage) : 0;
    
    // Calculate our agency's portion of the commission
    const ourAgencyCommission = totalCommission * (agencySplitPercentage / 100);
    
    // Calculate co-broker's agency portion
    const coAgencyCommission = coBroking?.enabled 
      ? totalCommission * (coAgencySplitPercentage / 100)
      : 0;
    
    // From our agency's portion, calculate agent and agency shares
    const agencyShare = ourAgencyCommission * (agencyTierPercentage / 100);
    const agentShare = ourAgencyCommission * (agentTierPercentage / 100);
    
    return {
      transactionValue: transactionValue || 0,
      commissionRate: commissionRate || 0,
      totalCommission,
      agencyShare,
      agentShare,
      ourAgencyCommission,
      coAgencyCommission,
      agentTier,
      agentCommissionPercentage: agentTierPercentage
    };
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
  
  if (!context) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  
  return context;
};

// Export the context
export { TransactionFormContext };
