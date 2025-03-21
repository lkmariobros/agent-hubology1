
import { TransactionFormState } from './types';

// Validate current step
export const validateStep = (state: TransactionFormState): Record<string, string> => {
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
        errors.transactionValue = formData.transactionType === 'Rent' 
          ? 'Monthly rental value must be greater than 0' 
          : 'Transaction value must be greater than 0';
      }
      
      if (formData.transactionType === 'Rent') {
        if (!formData.commissionAmount || formData.commissionAmount <= 0) {
          errors.commissionAmount = 'Owner commission amount must be greater than 0';
        }
      } else {
        if (!formData.commissionRate || formData.commissionRate <= 0) {
          errors.commissionRate = 'Commission rate must be greater than 0';
        }
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
  return errors;
};
