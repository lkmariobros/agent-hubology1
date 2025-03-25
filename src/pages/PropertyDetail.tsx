
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProperty, useDeleteProperty } from '@/hooks/useProperties';
import { toast } from 'sonner';
import PropertyDetailComponent from '@/components/property/PropertyDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, ChevronLeft } from 'lucide-react';
import { mapPropertyData } from '@/utils/propertyUtils';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: propertyData, isLoading, error } = useProperty(id || '');
  const deleteProperty = useDeleteProperty();
  
  if (error) {
    toast.error("Failed to load property details");
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/properties')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Error loading property details. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Map the raw property data to our expected format
  const rawProperty = propertyData?.data;
  const property = rawProperty ? mapPropertyData(rawProperty) : null;

  const handleEditProperty = () => {
    navigate(`/properties/${id}/edit`);
  };

  const handleDeleteProperty = () => {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      deleteProperty.mutate(id || '', {
        onSuccess: () => {
          toast.success("Property deleted successfully");
          navigate('/properties');
        },
        onError: (error) => {
          toast.error(`Failed to delete property: ${error.message}`);
        }
      });
    }
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <PropertyDetailSkeleton />
      ) : property ? (
        <PropertyDetailComponent 
          property={property}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      ) : (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <p className="mt-2 text-sm text-muted-foreground">Property not found</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/properties')}>
            Back to Properties
          </Button>
        </div>
      )}
    </div>
  );
};

// Loading skeleton for property details
const PropertyDetailSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="grid grid-cols-6 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
