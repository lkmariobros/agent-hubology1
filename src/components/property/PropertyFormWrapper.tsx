
import React, { useState, useEffect, useRef } from 'react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import EnhancedPropertyForm from '@/components/property/EnhancedPropertyForm';
import { PropertyFormData } from '@/types/property-form';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import propertyFormHelpers from '@/utils/propertyFormHelpers';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { Button } from '@/components/ui/button';

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
  const [storageReady, setStorageReady] = useState(false);
  const { createProperty, updateProperty } = usePropertyManagement();
  const { checkStorageBuckets, forceCheckStorageBuckets } = useStorageUpload();
  const initializationAttempted = useRef(false);
  const [retryCount, setRetryCount] = useState(0);
  const isComponentMounted = useRef(true);
  
  // Initialize form and check storage
  useEffect(() => {
    isComponentMounted.current = true;
    
    // Prevent multiple initialization attempts
    if (initializationAttempted.current && retryCount === 0) {
      return;
    }
    
    const initializeForm = async () => {
      try {
        if (!isComponentMounted.current) return;
        
        initializationAttempted.current = true;
        setIsInitializing(true);
        
        // Check storage configuration - use force check if retrying
        const requiredBuckets = ['property-images', 'property-documents'];
        const bucketsExist = retryCount > 0
          ? await forceCheckStorageBuckets(requiredBuckets)
          : await checkStorageBuckets(requiredBuckets);
        
        if (!isComponentMounted.current) return;
        
        setStorageReady(bucketsExist);
        
        if (!bucketsExist) {
          console.warn('Missing required storage buckets');
          // Only show toast on retry to avoid duplicate notifications
          if (retryCount > 0) {
            toast.warning('Storage bucket issue persists. Please check Supabase configuration.');
          }
        } else {
          console.log('All required storage buckets are available');
          if (retryCount > 0) {
            toast.success('Successfully connected to storage buckets');
          }
        }
      } catch (error) {
        if (!isComponentMounted.current) return;
        console.error('Error initializing property form:', error);
        setStorageReady(false);
      } finally {
        if (isComponentMounted.current) {
          setIsInitializing(false);
        }
      }
    };
    
    initializeForm();
    
    return () => {
      isComponentMounted.current = false;
    };
  }, [checkStorageBuckets, forceCheckStorageBuckets, retryCount]);
  
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
  
  // Function to recheck storage buckets
  const recheckStorageBuckets = () => {
    setRetryCount(prev => prev + 1);
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
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!storageReady && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertTitle>Storage Buckets Missing</AlertTitle>
          <AlertDescription className="flex flex-col space-y-3">
            <p>
              Image and document uploads will not work because the required storage buckets 
              ('property-images', 'property-documents') are missing or inaccessible in your Supabase project.
            </p>
            <div className="flex flex-col space-y-1 text-sm mt-1">
              <p className="font-semibold flex items-center">
                <Info className="h-3 w-3 mr-1" /> Troubleshooting:
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Ensure both buckets exist in your Supabase storage</li>
                <li>Check that your buckets have the correct RLS policies for uploads</li>
                <li>Verify that your application has the correct permissions</li>
              </ol>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={recheckStorageBuckets}
              className="self-start mt-2"
            >
              Check Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <EnhancedPropertyForm 
        onSubmit={handleFormSubmit}
        initialData={initialData}
        isEdit={isEdit}
        storageReady={storageReady}
      />
    </>
  );
};

export default PropertyFormWrapper;
