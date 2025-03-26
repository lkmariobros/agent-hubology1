
import { TransactionFormState } from './types';

// Function to save form as draft
export const saveFormAsDraft = async (state: TransactionFormState): Promise<void> => {
  console.log('Saving form as draft:', state);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, you would save to the database here
  // For now, we'll just save to localStorage as an example
  localStorage.setItem('transactionFormDraft', JSON.stringify({
    formData: state.formData,
    documents: state.documents
  }));
  
  return Promise.resolve();
};

// Function to submit the complete form
export const submitTransactionForm = async (state: TransactionFormState): Promise<void> => {
  console.log('Submitting transaction form:', state);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would submit to your API here
  
  return Promise.resolve();
};
