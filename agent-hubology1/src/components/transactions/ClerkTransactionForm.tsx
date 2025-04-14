import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCreateTransactionMutation } from '@/hooks/useClerkTransactions';

// Form step components
import TransactionTypeSelector from './form/TransactionTypeSelector';
import PropertySelection from './form/PropertySelection';
import ClientInformation from './form/ClientInformation';
import CoBrokingSetup from './form/CoBrokingSetup';
// Import the new CommissionCalculation component
import CommissionCalculationNew from './form/CommissionCalculationNew';
import DocumentUpload from './form/DocumentUpload';
import TransactionReview from './form/TransactionReview';
import TransactionFormStepper from './form/TransactionFormStepper';

// Import the Clerk context
import { ClerkTransactionFormProvider, useClerkTransactionForm } from '@/context/TransactionForm/ClerkTransactionFormContext';

// Types
import { TransactionFormData } from '@/types/transaction-form';
import { useAuth } from '@clerk/clerk-react';

interface TransactionFormStepsProps {
  onSubmit?: (data: TransactionFormData) => Promise<void>;
}

const TransactionFormSteps: React.FC<TransactionFormStepsProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const createTransaction = useCreateTransactionMutation();
  const [submitting, setSubmitting] = useState(false);
  const { userId } = useAuth();

  // Handle submit transaction
  const handleSubmitTransaction = async (formData: TransactionFormData) => {
    if (!userId) {
      toast.error('You must be logged in to create a transaction');
      return;
    }

    try {
      setSubmitting(true);

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Use the Clerk-enabled mutation
        const result = await createTransaction.mutateAsync({
          ...formData,
          clerkId: userId // Include Clerk userId
        });

        toast.success('Transaction created successfully!');

        // After successful submission, invalidate relevant queries to update dashboard metrics
        if (window.queryClient) {
          window.queryClient.invalidateQueries({ queryKey: ['agentCommission'] });
          window.queryClient.invalidateQueries({ queryKey: ['clerk-transactions'] });
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
  // Using the Clerk transaction form context
  const { state, nextStep, prevStep, submitForm } = useClerkTransactionForm();
  const { currentStep, formData } = state;

  const handleSubmit = async () => {
    try {
      // This will call the submitTransactionForm function internally (with Clerk JWT)
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
        <CommissionCalculationNew />
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
const ClerkTransactionForm: React.FC = () => {
  return (
    <ClerkTransactionFormProvider>
      <TransactionFormSteps />
    </ClerkTransactionFormProvider>
  );
};

export default ClerkTransactionForm;