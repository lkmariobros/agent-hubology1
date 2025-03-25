
import { TransactionFormState } from './types';

// Mock function to save form as draft
export const saveFormAsDraft = async (state: TransactionFormState): Promise<void> => {
  console.log('Saving form as draft:', state);
  
  // Simulate API call with 500ms delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would save to your backend
      localStorage.setItem('transactionFormDraft', JSON.stringify(state));
      resolve();
    }, 500);
  });
};

// Mock function to submit transaction form
export const submitTransactionForm = async (state: TransactionFormState): Promise<void> => {
  console.log('Submitting transaction form:', state);
  
  // Simulate API call with 1s delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would submit to your backend
      localStorage.removeItem('transactionFormDraft');
      resolve();
    }, 1000);
  });
};
