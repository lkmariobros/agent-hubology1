
import React, { useState } from 'react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import EnhancedPropertyForm from '@/components/property/EnhancedPropertyForm';
import { PropertyFormData } from '@/types/property-form';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProperty, updateProperty } = usePropertyManagement();
  
  const handleFormSubmit = async (data: PropertyFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a property');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Augment data with current user ID
      const augmentedData = {
        ...data,
        agentId: user.id
      };
      
      if (isEdit && propertyId) {
        // Update existing property
        await updateProperty.mutateAsync({ id: propertyId, data: augmentedData });
        navigate(`/properties/${propertyId}`);
      } else {
        // Create new property
        const result = await createProperty.mutateAsync(augmentedData);
        navigate(`/properties/${result.propertyId}`);
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      // Toast errors are shown by the mutation hooks
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {isEdit ? 'Updating' : 'Creating'} property...
        </h3>
        <p className="text-muted-foreground">
          This may take a moment if uploading images or documents.
        </p>
      </div>
    );
  }
  
  return (
    <EnhancedPropertyForm 
      onSubmit={handleFormSubmit}
      initialData={initialData}
      isEdit={isEdit}
    />
  );
};

export default PropertyFormWrapper;
