
import { useCallback } from 'react';
import { useReducer } from 'react';
import { 
  TransactionFormData, 
  TransactionDocument, 
  CommissionBreakdown,
  TransactionType,
  AgentRank
} from './types';
import { transactionFormReducer } from './reducer';
import { initialTransactionFormState, getDefaultCommissionRate } from './initialState';
import { saveFormAsDraft, submitTransactionForm } from './formSubmission';

// Agent tier commission percentages
const AGENT_TIER_PERCENTAGES: Record<AgentRank, number> = {
  'Advisor': 70,
  'Sales Leader': 80,
  'Team Leader': 83,
  'Group Leader': 85,
  'Supreme Leader': 85
};

export const useTransactionFormActions = () => {
  const [state, dispatch] = useReducer(transactionFormReducer, initialTransactionFormState);

  // Update form data
  const updateFormData = useCallback((data: Partial<TransactionFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  // Update transaction type
  const updateTransactionType = useCallback((type: TransactionType) => {
    dispatch({ type: 'UPDATE_TRANSACTION_TYPE', payload: type });
    
    // Update commission rate based on new transaction type
    const newCommissionRate = getDefaultCommissionRate(type);
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { commissionRate: newCommissionRate }
    });
  }, []);

  // Document management functions
  const addDocument = useCallback((document: TransactionDocument) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: document });
  }, []);

  const removeDocument = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: index });
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    const { formData, currentStep } = state;
    
    console.log('Validating step:', currentStep);
    
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
        if (formData.transactionType === 'Sale' || formData.transactionType === 'Developer') {
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
        
        if (formData.transactionType === 'Developer') {
          if (!formData.developer?.name) {
            errors.developerName = 'Developer name is required';
          }
        }
        break;
        
      case 3: // Co-Broking Setup
        // Only validate if co-broking is enabled
        if (formData.coBroking?.enabled) {
          if (!formData.coBroking.agentName || formData.coBroking.agentName.trim() === '') {
            errors.coAgentName = 'Co-broker agent name is required';
          }
          if (!formData.coBroking.agentCompany || formData.coBroking.agentCompany.trim() === '') {
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
  }, [state, dispatch]);

  // Navigation functions
  const nextStep = useCallback(() => {
    console.log('Attempting to proceed to next step');
    // Always validate the current step before moving to the next
    const isValid = validateCurrentStep();
    console.log('Step validation result:', isValid);
    
    if (isValid) {
      dispatch({ type: 'NEXT_STEP' });
      return true;
    }
    return false;
  }, [validateCurrentStep]);

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
    
    // Get agent's tier-based percentage
    const agentTierPercentage = getAgentCommissionPercentage(agentTier);
    
    // Calculate split percentages for co-broking scenario
    const agencySplitPercentage = coBroking?.enabled ? (coBroking.commissionSplit || 50) : 100;
    const coAgencySplitPercentage = coBroking?.enabled ? (100 - agencySplitPercentage) : 0;
    
    // Our agency's portion of the total commission
    const ourAgencyCommission = totalCommission * (agencySplitPercentage / 100);
    
    // Co-broker agency's portion
    const coAgencyCommission = coBroking?.enabled 
      ? totalCommission * (coAgencySplitPercentage / 100)
      : undefined;
    
    // From our agency's portion, calculate agent and agency shares
    const agentShare = ourAgencyCommission * (agentTierPercentage / 100);
    const agencyShare = ourAgencyCommission * ((100 - agentTierPercentage) / 100);
    
    return {
      totalCommission,
      agencyShare,
      agentShare,
      ourAgencyCommission,
      coAgencyCommission,
      agentTier,
      agentCommissionPercentage: agentTierPercentage,
      // Add these for display purposes in CommissionBreakdownCard
      transactionValue: transactionValue || 0,
      commissionRate: commissionRate || 0
    };
  }, [state.formData]);

  return {
    state,
    dispatch,
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
};
