
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyFormProvider } from '@/context/PropertyForm/PropertyFormContext';
import { PropertyFormData } from '@/types/property-form';
import { toast } from 'sonner';
import { submitPropertyForm } from '@/context/PropertyForm/formSubmission';
import BasicInfoTab from './BasicInfoTab';
import AddressTab from './AddressTab';
import FeaturesTab from './FeaturesTab';
import MediaTab from './MediaTab';
import AdditionalDetailsTab from './AdditionalDetailsTab';
import PropertyOwnerInfo from './PropertyOwnerInfo';

interface PropertyFormWrapperProps {
  propertyId?: string;
  initialData?: Partial<PropertyFormData>;
  isEdit?: boolean;
}

const PropertyFormWrapper: React.FC<PropertyFormWrapperProps> = ({ 
  propertyId,
  initialData,
  isEdit = false
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get the form state from the context during submission
      // We need to pass the state to submitPropertyForm
      await submitPropertyForm();
      
      toast.success(`Property ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/properties');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} property. Please check your form and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PropertyFormProvider>
      <div className="space-y-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="address">Location</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="owner">Owner</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <Card className="mt-4 p-4">
            <TabsContent value="basic" className="mt-0">
              <BasicInfoTab />
            </TabsContent>
            
            <TabsContent value="address" className="mt-0">
              <AddressTab />
            </TabsContent>
            
            <TabsContent value="features" className="mt-0">
              <FeaturesTab />
            </TabsContent>
            
            <TabsContent value="owner" className="mt-0">
              <PropertyOwnerInfo />
            </TabsContent>
            
            <TabsContent value="media" className="mt-0">
              <MediaTab />
            </TabsContent>
            
            <TabsContent value="additional" className="mt-0">
              <AdditionalDetailsTab />
            </TabsContent>
          </Card>
        </Tabs>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/properties')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <div className="space-x-2">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </div>
      </div>
    </PropertyFormProvider>
  );
};

export default PropertyFormWrapper;
