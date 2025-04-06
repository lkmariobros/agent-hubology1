import React, { useState, useEffect } from 'react';
import { PropertyFormData } from '@/types/property-form';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { PropertyFormProvider } from '@/context/PropertyForm/PropertyFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import FormStepsNavigation from './form/FormStepsNavigation';
import FormActions from './form/FormActions';
import ValidationErrors from './form/ValidationErrors';
import MobileFormStepsView from './form/MobileFormStepsView';

import PropertyBasicInfo from './form/PropertyBasicInfo';
import PropertyDetails from './form/PropertyDetails';
import PropertyLocation from './form/PropertyLocation';
import PropertyPricing from './form/PropertyPricing';
import PropertyFeatures from './form/PropertyFeatures';
import PropertyOwnerInfo from './form/PropertyOwnerInfo';
import ImageUploader from './ImageUploader';
import PropertyDocuments from './form/PropertyDocuments';

interface EnhancedPropertyFormProps {
  onSubmit?: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
  isEdit?: boolean;
  storageReady?: boolean;
}

const EnhancedPropertyFormContent: React.FC<EnhancedPropertyFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEdit = false,
  storageReady = true
}) => {
  const { 
    state, 
    updateFormData, 
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
  
  return (
    <div className="space-y-6">
      <ValidationErrors errors={validationErrors} />
      
      {/* Desktop Form Steps View */}
      <div className="hidden md:block">
        <FormStepsNavigation>
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
        </FormStepsNavigation>
      </div>
      
      {/* Mobile Steps View */}
      <MobileFormStepsView storageReady={storageReady} />
      
      <Separator className="my-6" />
      
      {/* Navigation Buttons */}
      <FormActions 
        isEdit={isEdit}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        validationErrors={validationErrors}
      />
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
