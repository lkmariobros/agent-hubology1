
import React from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Send, AlertTriangle } from 'lucide-react';
import { FormSteps } from './FormStepsNavigation';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  
  const handleNextStep = () => {
    // Check if we're on the media tab and uploads are in progress
    if (state.currentStep === 6) {
      const uploadsInProgress = state.images.some(img => img.uploadStatus === 'uploading');
      if (uploadsInProgress) {
        toast.warning("Please wait for image uploads to complete before proceeding");
        return;
      }
    }
    
    nextStep();
  };
  
  // Check if any uploads are in progress
  const uploadsInProgress = state.images.some(img => img.uploadStatus === 'uploading');
  
  return (
    <div className="space-y-4">
      {uploadsInProgress && state.currentStep === 6 && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-400">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          <AlertDescription className="text-yellow-800 font-medium">
            Please wait for image uploads to complete before proceeding
          </AlertDescription>
        </Alert>
      )}
      
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
              onClick={handleNextStep}
              disabled={state.isSubmitting || (state.currentStep === 6 && uploadsInProgress)}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={state.isSubmitting || validationErrors.length > 0 || uploadsInProgress}
            >
              <Send className="mr-2 h-4 w-4" /> {isEdit ? 'Update' : 'Submit'} Property
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormActions;
