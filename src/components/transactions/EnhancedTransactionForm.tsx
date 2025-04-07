
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionFormProvider } from '@/context/TransactionForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';

// Form step components
import TransactionTypeSelector from './form/TransactionTypeSelector';
import PropertySelection from './form/PropertySelection';
import ClientInformation from './form/ClientInformation';
import CoBrokingSetup from './form/CoBrokingSetup';
import CommissionCalculation from './form/CommissionCalculation';
import DocumentUpload from './form/DocumentUpload';
import TransactionReview from './form/TransactionReview';
import TransactionFormStepper from './form/TransactionFormStepper';

// Import the hook
import { useTransactionForm } from '@/context/TransactionForm';

// Types
import { TransactionFormData } from '@/types/transaction-form';

interface TransactionFormStepsProps {
  onSubmit?: (data: TransactionFormData) => Promise<void>;
}

const TransactionFormSteps: React.FC<TransactionFormStepsProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { useCreateTransactionMutation } = useTransactions();
  const createTransaction = useCreateTransactionMutation();
  const [submitting, setSubmitting] = useState(false);

  // Handle submit transaction
  const handleSubmitTransaction = async (formData: TransactionFormData) => {
    try {
      setSubmitting(true);
      
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Use the provided mutation
        const result = await createTransaction.mutateAsync(formData);
        toast.success('Transaction created successfully!');
        
        // After successful submission, invalidate relevant queries to update dashboard metrics
        if (window.queryClient) {
          window.queryClient.invalidateQueries({ queryKey: ['agentCommission'] });
          window.queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
        
        // Navigate to the dashboard to show updated metrics
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

  // This component is intended to be used within the TransactionFormProvider
  // which supplies the form state and functions via context
  return (
    <div className="space-y-6">
      <TransactionFormStepper />
      
      <Card>
        <CardContent className="pt-6">
          <TransactionStepContent
            submitting={submitting}
            onSubmit={handleSubmitTransaction}
            createTransactionIsPending={createTransaction.isPending || false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// This component renders the appropriate form step based on the current step in the form context
const TransactionStepContent: React.FC<{
  submitting: boolean;
  onSubmit: (formData: TransactionFormData) => Promise<void>;
  createTransactionIsPending: boolean;
}> = ({ submitting, onSubmit, createTransactionIsPending }) => {
  // This component will get the currentStep from the TransactionForm context
  const { state, nextStep, prevStep, submitForm } = useTransactionForm();
  const { currentStep, formData } = state;

  const handleSubmit = async () => {
    try {
      // This will call the submitTransactionForm function internally
      const result = await submitForm();
      
      // After the form has been submitted, pass the form data to the parent's onSubmit
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Please fix the errors before submitting');
    }
  };

  return (
    <div className="transaction-form-steps">
      {/* Step 0: Transaction Type */}
      {currentStep === 0 && (
        <TransactionTypeSelector />
      )}

      {/* Step 1: Property Selection */}
      {currentStep === 1 && (
        <PropertySelection />
      )}

      {/* Step 2: Client Information */}
      {currentStep === 2 && (
        <ClientInformation />
      )}

      {/* Step 3: Co-Broking Setup */}
      {currentStep === 3 && (
        <CoBrokingSetup />
      )}

      {/* Step 4: Commission Calculation */}
      {currentStep === 4 && (
        <CommissionCalculation />
      )}

      {/* Step 5: Document Upload */}
      {currentStep === 5 && (
        <DocumentUpload />
      )}

      {/* Step 6: Review & Submit */}
      {currentStep === 6 && (
        <TransactionReview 
          onSubmit={handleSubmit}
          isSubmitting={submitting || createTransactionIsPending}
        />
      )}

      {/* Navigation buttons - only show if not on first or last step */}
      {currentStep > 0 && currentStep < 6 && (
        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            disabled={submitting}
          >
            Back
          </Button>
          <Button 
            type="button" 
            onClick={nextStep}
            disabled={submitting}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

// Main exported component that wraps everything in the required provider
const EnhancedTransactionForm: React.FC = () => {
  return (
    <TransactionFormProvider>
      <TransactionFormSteps />
    </TransactionFormProvider>
  );
};

export default EnhancedTransactionForm;
