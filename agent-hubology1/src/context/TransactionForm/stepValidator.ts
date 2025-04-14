
import { TransactionFormState } from './types';

// Validate a specific form step
export function validateStep(state: TransactionFormState): Record<string, string> {
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
        if (!formData.coBroking.commissionSplit || formData.coBroking.commissionSplit <= 0 || formData.coBroking.commissionSplit > 100) {
          errors.coAgentCommissionSplit = 'Commission split must be between 1 and 100';
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
      if (!formData.agentTier) {
        errors.agentTier = 'Agent tier must be selected';
      }
      break;
      
    case 5: // Document Upload
      // Documents are optional, but can validate document types if needed
      break;
      
    case 6: // Review
      // All validations should be done in previous steps
      // Can add a final validation here if needed
      break;
  }
  
  console.log('Validation errors:', errors);
  
  return errors;
}
