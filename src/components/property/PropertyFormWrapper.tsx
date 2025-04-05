import React, { useState, useEffect } from 'react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import EnhancedPropertyForm from '@/components/property/EnhancedPropertyForm';
import { PropertyFormData } from '@/types/property-form';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import propertyFormHelpers from '@/utils/propertyFormHelpers';

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
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { createProperty, updateProperty } = usePropertyManagement();
  
  // Initialize and check for necessary storage buckets
  useEffect(() => {
    const initializeForm = async () => {
      try {
        // Check if the required storage buckets exist
        await propertyFormHelpers.ensurePropertyBuckets();
        setIsInitializing(false);
      } catch (error) {
        console.error('Error initializing property form:', error);
        setError('Failed to initialize property form. Please try again later.');
        setIsInitializing(false);
      }
    };
    
    initializeForm();
  }, []);
  
  const handleFormSubmit = async (data: PropertyFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a property');
      return;
    }

    // Reset error state
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Validate that required fields have values based on property type
      const validatePropertySpecificFields = () => {
        switch (data.propertyType) {
          case 'Residential':
            if (!data.bedrooms) {
              throw new Error('Number of bedrooms is required for residential properties');
            }
            if (!data.bathrooms) {
              throw new Error('Number of bathrooms is required for residential properties');
            }
            if (!data.builtUpArea) {
              throw new Error('Built-up area is required for residential properties');
            }
            break;
          case 'Commercial':
            if (!data.floorArea) {
              throw new Error('Floor area is required for commercial properties');
            }
            break;
          case 'Land':
            if (!data.landSize) {
              throw new Error('Land size is required for land properties');
            }
            break;
        }
      };

      // Validate transaction-specific fields
      const validateTransactionFields = () => {
        if (data.transactionType === 'Sale' && (!data.price || data.price <= 0)) {
          throw new Error('A valid price is required for sale properties');
        }
        if (data.transactionType === 'Rent' && (!data.rentalRate || data.rentalRate <= 0)) {
          throw new Error('A valid rental rate is required for rental properties');
        }
      };

      // Perform validations
      validatePropertySpecificFields();
      validateTransactionFields();
      
      if (isEdit && propertyId) {
        // Update existing property
        await updateProperty.mutateAsync({ id: propertyId, data });
        toast.success('Property updated successfully!');
        navigate(`/properties/${propertyId}`);
      } else {
        // Create new property
        const result = await createProperty.mutateAsync(data);
        if (result.success) {
          // Check if propertyId exists in the result, otherwise use a fallback
          const createdPropertyId = 'propertyId' in result ? result.propertyId : undefined;
          
          toast.success('Property created successfully!');
          
          // Navigate to the property detail or back to list if we don't have an ID
          if (createdPropertyId) {
            navigate(`/properties/${createdPropertyId}`);
          } else {
            console.warn('Property created but no ID was returned');
            navigate('/properties');
          }
        } else {
          throw new Error('Failed to create property. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Error submitting property:', error);
      setError(error.message || 'An error occurred while submitting the property');
      toast.error(error.message || 'Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Initializing property form...
        </h3>
      </div>
    );
  }
  
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
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <EnhancedPropertyForm 
        onSubmit={handleFormSubmit}
        initialData={initialData}
        isEdit={isEdit}
      />
    </>
  );
};

export default PropertyFormWrapper;
