
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PropertyFormValues } from '@/types';
import PropertyEssentialInfo from './PropertyEssentialInfo';
import PropertyDetailsInfo from './PropertyDetailsInfo';
import PropertyAddressInfo from './PropertyAddressInfo';
import PropertyMediaUpload from './PropertyMediaUpload';
import ProgressIndicator from './ProgressIndicator';
import { Button } from '@/components/ui/button';
import { Loader2, Save, ArrowLeft, ArrowRight } from 'lucide-react';

interface PropertyFormStepsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyFormSteps: React.FC<PropertyFormStepsProps> = ({ form }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("essential");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Navigation functions for form steps
  const nextTab = () => {
    // Validate current tab before proceeding
    if (activeTab === "essential") {
      const { title, description, propertyType } = form.getValues();
      if (!title || title.length < 3) {
        form.setError('title', { message: 'Title is required and must be at least 3 characters' });
        return;
      }
      if (!description || description.length < 20) {
        form.setError('description', { message: 'Description is required and must be at least 20 characters' });
        return;
      }
      if (!propertyType) {
        form.setError('propertyType', { message: 'Property type is required' });
        return;
      }
      
      setActiveTab("details");
    } else if (activeTab === "details") {
      const propertyType = form.getValues('propertyType');
      const price = form.getValues('price');
      
      // Specific validation based on property type
      if (propertyType === 'residential') {
        const bedrooms = form.getValues('bedrooms');
        const bathrooms = form.getValues('bathrooms');
        if (bedrooms === undefined || bedrooms < 0) {
          form.setError('bedrooms', { message: 'Number of bedrooms is required' });
          return;
        }
        if (bathrooms === undefined || bathrooms < 0) {
          form.setError('bathrooms', { message: 'Number of bathrooms is required' });
          return;
        }
      }
      
      // Validate price
      if (price === undefined || price <= 0) {
        form.setError('price', { message: 'A valid price is required' });
        return;
      }
      
      setActiveTab("address");
    } else if (activeTab === "address") {
      const { address } = form.getValues();
      if (!address?.street) {
        form.setError('address.street', { message: 'Street address is required' });
        return;
      }
      if (!address?.city) {
        form.setError('address.city', { message: 'City is required' });
        return;
      }
      if (!address?.state) {
        form.setError('address.state', { message: 'State is required' });
        return;
      }
      
      setActiveTab("media");
    }
  };

  const prevTab = () => {
    if (activeTab === "details") setActiveTab("essential");
    else if (activeTab === "address") setActiveTab("details");
    else if (activeTab === "media") setActiveTab("address");
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // No API implementation, just save to localStorage for now
      const formData = form.getValues();
      localStorage.setItem('propertyFormDraft', JSON.stringify(formData));
      toast.success('Property saved as draft');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Log submission for debugging
      console.log('Property submitted:', data);
      
      // Success message
      toast.success('Property created successfully!');
      
      // Clear draft from localStorage if it exists
      localStorage.removeItem('propertyFormDraft');
      
      // Navigate to properties list
      setTimeout(() => {
        navigate('/properties');
      }, 1000);
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to load draft from localStorage
  const loadDraft = () => {
    try {
      const draftData = localStorage.getItem('propertyFormDraft');
      if (draftData) {
        const parsedData = JSON.parse(draftData);
        form.reset(parsedData);
        toast.success('Draft loaded successfully');
      } else {
        toast.info('No draft found');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Failed to load draft');
    }
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator
        steps={[
          { id: "essential", label: "Basic Info" },
          { id: "details", label: "Details" },
          { id: "address", label: "Location" },
          { id: "media", label: "Media" }
        ]}
        currentStep={activeTab}
        onStepClick={setActiveTab}
      />
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Essential Information */}
        {activeTab === "essential" && (
          <div className="space-y-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadDraft}
              className="mb-4"
            >
              Load Draft
            </Button>
            <PropertyEssentialInfo form={form} nextTab={nextTab} />
          </div>
        )}
        
        {/* Step 2: Property Details */}
        {activeTab === "details" && (
          <PropertyDetailsInfo form={form} nextTab={nextTab} prevTab={prevTab} />
        )}
        
        {/* Step 3: Address Information */}
        {activeTab === "address" && (
          <PropertyAddressInfo form={form} nextTab={nextTab} prevTab={prevTab} />
        )}
        
        {/* Step 4: Media Upload */}
        {activeTab === "media" && (
          <PropertyMediaUpload form={form} />
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <div>
            {activeTab !== "essential" && (
              <Button
                type="button"
                variant="outline"
                onClick={prevTab}
                disabled={isSubmitting || isSaving}
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
              disabled={isSubmitting || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
            
            {activeTab !== "media" ? (
              <Button
                type="button"
                onClick={nextTab}
                disabled={isSubmitting || isSaving}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || isSaving}
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
      </form>
    </div>
  );
};

export default PropertyFormSteps;
