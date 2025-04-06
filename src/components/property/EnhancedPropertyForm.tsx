import React, { useState, useEffect } from 'react';
import { PropertyFormData } from '@/types/property-form';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { PropertyFormProvider } from '@/context/PropertyForm/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import PropertyBasicInfo from './form/PropertyBasicInfo';
import PropertyDetails from './form/PropertyDetails';
import PropertyLocation from './form/PropertyLocation';
import PropertyPricing from './form/PropertyPricing';
import PropertyFeatures from './form/PropertyFeatures';
import PropertyImagesUpload from './form/PropertyImagesUpload';
import PropertyDocuments from './form/PropertyDocuments';
import ImageUploader from './ImageUploader';
import PropertyOwnerInfo from './form/PropertyOwnerInfo';

interface EnhancedPropertyFormProps {
  onSubmit?: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
  isEdit?: boolean;
  storageReady?: boolean;
}

const FormSteps = [
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'details', label: 'Details' },
  { id: 'location', label: 'Location' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'features', label: 'Features' },
  { id: 'owner', label: 'Owner' },
  { id: 'media', label: 'Media' },
  { id: 'documents', label: 'Documents' },
];

const EnhancedPropertyFormContent: React.FC<EnhancedPropertyFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEdit = false,
  storageReady = true
}) => {
  const { 
    state, 
    updateFormData, 
    nextStep, 
    prevStep, 
    goToStep, 
    submitForm,
    saveForm
  } = usePropertyForm();
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      updateFormData(initialData);
    }
  }, [initialData, updateFormData]);
  
  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Clear validation errors
    setValidationErrors([]);
    
    // If onSubmit is provided, use it
    if (onSubmit) {
      onSubmit(state.formData);
    } else {
      // Otherwise use the context's submit function
      await submitForm();
    }
  };
  
  const validateForm = (): string[] => {
    const errors: string[] = [];
    const { formData } = state;
    
    // Basic validation
    if (!formData.title) errors.push('Title is required');
    if (!formData.description) errors.push('Description is required');
    if (!formData.propertyType) errors.push('Property type is required');
    if (!formData.transactionType) errors.push('Transaction type is required');
    
    // Address validation
    if (!formData.address?.street) errors.push('Street address is required');
    if (!formData.address?.city) errors.push('City is required');
    if (!formData.address?.state) errors.push('State is required');
    
    // Price validation
    if (formData.transactionType === 'Sale' && !formData.price) {
      errors.push('Price is required for sale properties');
    }
    
    if (formData.transactionType === 'Rent' && !formData.rentalRate) {
      errors.push('Rental rate is required for rental properties');
    }
    
    return errors;
  };
  
  const handleSaveDraft = async () => {
    await saveForm();
  };
  
  const currentStepIndex = FormSteps.findIndex(step => step.id === state.currentStep.toString()) || 0;
  
  return (
    <div className="space-y-6">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Form Steps Progress */}
      <div className="hidden md:block">
        <Tabs 
          value={state.currentStep.toString()} 
          onValueChange={(value) => goToStep(parseInt(value))}
          className="w-full"
        >
          <TabsList className="grid grid-cols-8 w-full">
            {FormSteps.map((step, index) => (
              <TabsTrigger 
                key={step.id} 
                value={index.toString()}
                disabled={state.isSubmitting}
              >
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="0">
            <PropertyBasicInfo />
          </TabsContent>
          
          <TabsContent value="1">
            <PropertyDetails />
          </TabsContent>
          
          <TabsContent value="2">
            <PropertyLocation />
          </TabsContent>
          
          <TabsContent value="3">
            <PropertyPricing />
          </TabsContent>
          
          <TabsContent value="4">
            <PropertyFeatures />
          </TabsContent>
          
          <TabsContent value="5">
            <PropertyOwnerInfo />
          </TabsContent>
          
          <TabsContent value="6">
            <Card>
              <CardContent className="pt-6">
                <ImageUploader 
                  disabled={!storageReady} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="7">
            <PropertyDocuments />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Mobile Steps View */}
      <div className="md:hidden">
        <div className="text-lg font-semibold mb-4">
          {FormSteps[currentStepIndex]?.label || 'Property Form'}
        </div>
        
        {state.currentStep === 0 && <PropertyBasicInfo />}
        {state.currentStep === 1 && <PropertyDetails />}
        {state.currentStep === 2 && <PropertyLocation />}
        {state.currentStep === 3 && <PropertyPricing />}
        {state.currentStep === 4 && <PropertyFeatures />}
        {state.currentStep === 5 && <PropertyOwnerInfo />}
        {state.currentStep === 6 && (
          <Card>
            <CardContent className="pt-6">
              <ImageUploader 
                disabled={!storageReady} 
              />
            </CardContent>
          </Card>
        )}
        {state.currentStep === 7 && <PropertyDocuments />}
      </div>
      
      <Separator className="my-6" />
      
      {/* Navigation Buttons */}
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
            onClick={handleSaveDraft}
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
              onClick={handleSubmit}
              disabled={state.isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" /> {isEdit ? 'Update' : 'Submit'} Property
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const EnhancedPropertyForm: React.FC<EnhancedPropertyFormProps> = (props) => {
  return (
    <PropertyFormProvider>
      <EnhancedPropertyFormContent {...props} />
    </PropertyFormProvider>
  );
};

export default EnhancedPropertyForm;
