
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionFormProvider, useTransactionForm } from '@/context/TransactionForm'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, ArrowRight } from 'lucide-react';

// Step components
import TransactionFormStepper from './form/TransactionFormStepper';
import TransactionTypeSelector from './form/TransactionTypeSelector';
import PropertyDetails from './form/PropertyDetails';
import ClientInformation from './form/ClientInformation';
import CoBrokingSetup from './form/CoBrokingSetup';
import CommissionCalculation from './form/CommissionCalculation';
import DocumentUpload from './form/DocumentUpload';
import TransactionReview from './form/TransactionReview';

const TransactionFormSteps: React.FC = () => {
  const { state, prevStep, nextStep, saveForm, submitForm, validateCurrentStep } = useTransactionForm();
  const { currentStep, isSubmitting, lastSaved, errors } = state;
  const navigate = useNavigate();

  const handleSaveDraft = async () => {
    try {
      await saveForm();
      toast.success('Transaction saved as draft');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save transaction');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validateCurrentStep()) {
        toast.error('Please fix the validation errors before submitting');
        return;
      }
      
      await submitForm();
      toast.success('Transaction created successfully!');
      navigate('/transactions');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to create transaction');
    }
  };
  
  const handleNextStep = () => {
    console.log('Next button clicked, proceeding to validation');
    // Validate the current step before proceeding
    if (validateCurrentStep()) {
      console.log('Validation passed, moving to next step');
      nextStep();
    } else {
      console.log('Validation failed:', errors);
      toast.error('Please fix the validation errors before proceeding');
    }
  };

  // Render the current step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TransactionTypeSelector />;
      case 1:
        return <PropertyDetails />;
      case 2:
        return <ClientInformation />;
      case 3:
        return <CoBrokingSetup />;
      case 4:
        return <CommissionCalculation />;
      case 5:
        return <DocumentUpload />;
      case 6:
        return <TransactionReview />;
      default:
        return <TransactionTypeSelector />;
    }
  };

  return (
    <div className="space-y-6">
      <TransactionFormStepper />
      
      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Transaction'
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="mt-4 text-right">
              <p className="text-xs text-muted-foreground">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const EnhancedTransactionForm: React.FC = () => {
  return (
    <TransactionFormProvider>
      <TransactionFormSteps />
    </TransactionFormProvider>
  );
};

export default EnhancedTransactionForm;
