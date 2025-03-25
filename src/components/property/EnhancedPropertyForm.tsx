
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyFormProvider, usePropertyForm } from '@/context/PropertyForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, ArrowRight } from 'lucide-react';

// Form step components
import PropertyTypeSelector from './form/PropertyTypeSelector';
import TransactionTypeToggle from './form/TransactionTypeToggle';
import PropertyBasicInfo from './form/PropertyBasicInfo';
import PropertyAddress from './form/PropertyAddress';
import PropertyImagesUpload from './form/PropertyImagesUpload';
import PropertyDocumentsUpload from './form/PropertyDocumentsUpload';
import PropertyAgentNotes from './form/PropertyAgentNotes';
import PropertyFormStepper from './form/PropertyFormStepper';
import PropertyOwnerContacts from './form/PropertyOwnerContacts';

// Property type specific components
import PropertyResidentialDetails from './form/PropertyResidentialDetails';
import PropertyCommercialDetails from './form/PropertyCommercialDetails';
import PropertyIndustrialDetails from './form/PropertyIndustrialDetails';
import PropertyLandDetails from './form/PropertyLandDetails';

const PropertyFormSteps: React.FC = () => {
  const { state, prevStep, nextStep, saveForm, submitForm } = usePropertyForm();
  const { currentStep, isSubmitting, lastSaved, formData } = state;
  const navigate = useNavigate();

  const PropertyDetailsComponent = () => {
    switch (formData.propertyType) {
      case 'Residential':
        return <PropertyResidentialDetails />;
      case 'Commercial':
        return <PropertyCommercialDetails />;
      case 'Industrial':
        return <PropertyIndustrialDetails />;
      case 'Land':
        return <PropertyLandDetails />;
      default:
        return null;
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveForm();
      toast.success('Property saved as draft');
    } catch (error) {
      toast.error('Failed to save property');
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForm();
      toast.success('Property listing created successfully!');
      navigate('/properties');
    } catch (error) {
      toast.error('Failed to create property listing');
    }
  };

  // Form validation by step
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return !!formData.title && !!formData.description;
      case 1: // Details
        return true; // All fields are optional or have defaults
      case 2: // Location
        return !!formData.address.street && !!formData.address.city && !!formData.address.state;
      case 3: // Owner Contacts
        return true; // Contacts are optional
      case 4: // Images
      case 5: // Documents
        return true; // Images and documents are optional
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      <PropertyFormStepper />
      
      <Card>
        <CardContent className="pt-6">
          {/* Step 0: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <PropertyTypeSelector />
              <TransactionTypeToggle />
              <PropertyBasicInfo />
            </div>
          )}

          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <PropertyDetailsComponent />
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <PropertyAddress />
            </div>
          )}

          {/* Step 3: Owner Contacts */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <PropertyOwnerContacts />
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <PropertyImagesUpload />
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <PropertyDocumentsUpload />
              <PropertyAgentNotes />
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Review & Submit</h3>
                <p className="text-muted-foreground">
                  Please review all details before submitting your property listing.
                </p>
                
                {/* Summary of property info */}
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Property Type</h4>
                      <p>{formData.propertyType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Transaction Type</h4>
                      <p>{formData.transactionType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Title</h4>
                      <p>{formData.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                      <p>{formData.status}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {formData.transactionType === 'Sale' ? 'Price' : 'Rental Rate'}
                      </h4>
                      <p>
                        RM {formData.transactionType === 'Sale' 
                          ? (formData.price || 0).toLocaleString() 
                          : (formData.rentalRate || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                      <p>
                        {formData.address.street}, {formData.address.city}, {formData.address.state}
                        {formData.address.zip ? `, ${formData.address.zip}` : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Owner Contacts</h4>
                      <p>{formData.ownerContacts.length} contacts</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Images</h4>
                      <p>{state.images.length} images attached</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Documents</h4>
                      <p>{state.documents.length} documents attached</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  onClick={nextStep}
                  disabled={!canProceed() || isSubmitting}
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
                    'Submit Property'
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

const EnhancedPropertyForm: React.FC = () => {
  return (
    <PropertyFormProvider>
      <PropertyFormSteps />
    </PropertyFormProvider>
  );
};

export default EnhancedPropertyForm;
