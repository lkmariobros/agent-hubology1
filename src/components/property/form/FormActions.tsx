
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import { FormSteps } from './FormStepsNavigation';

interface FormActionsProps {
  isEdit?: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
  validationErrors: string[];
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isEdit = false, 
  onSubmit, 
  onSaveDraft,
  validationErrors
}) => {
  const { state, nextStep, prevStep } = usePropertyForm();
  
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={state.currentStep === 0 || state.isSubmitting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={state.isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" /> Save Draft
        </Button>
        
        {state.currentStep < FormSteps.length - 1 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={state.isSubmitting}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={state.isSubmitting || validationErrors.length > 0}
          >
            <Send className="mr-2 h-4 w-4" /> {isEdit ? 'Update' : 'Submit'} Property
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormActions;
