
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { PropertyDetailProvider, usePropertyDetail } from '@/components/property/PropertyDetailContext';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertySummaryCard from '@/components/property/PropertySummaryCard';
import PropertyTabsSection from '@/components/property/PropertyTabsSection';
import PropertyErrorState from '@/components/property/PropertyErrorState';
import PropertyLoadingSkeleton from '@/components/property/PropertyLoadingSkeleton';
import LoadingIndicator from '@/components/ui/loading-indicator';
import DatabaseError from '@/components/ui/database-error';

// Main component that loads the context provider
const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { loading: authLoading } = useAuth();
  
  // Display loading state when auth is still loading
  if (authLoading) {
    return <LoadingIndicator fullScreen size="lg" text="Verifying authentication..." />;
  }
  
  // If no ID is provided, show error
  if (!id) {
    return <PropertyErrorState title="Property Not Found" message="No property ID was provided." errorCode={404} />;
  }
  
  return (
    <PropertyDetailProvider propertyId={id}>
      <PropertyDetailContent />
    </PropertyDetailProvider>
  );
};

// Separate component that consumes the context
const PropertyDetailContent = () => {
  const { 
    property, 
    propertyOwner, 
    notes, 
    isLoading, 
    error, 
    refetch, 
    handleAddNote, 
    propertyImages, 
    propertyType 
  } = usePropertyDetail();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const handleRetry = () => {
    refetch();
  };
  
  const handleEditProperty = () => {
    navigate(`/properties/edit/${property?.id}`);
  };

  const handleDeleteProperty = () => {
    // Implement delete functionality
    // toast.error('Delete functionality not implemented yet');
  };
  
  const handleGetHelp = () => {
    window.open('https://docs.example.com/property-database-issues', '_blank');
  };
  
  // Show skeleton during loading
  if (isLoading) {
    return <PropertyLoadingSkeleton />;
  }

  // Handle connection errors with a specific UI
  if (error && error.message.includes('Failed to fetch') || error?.message.includes('connect to database')) {
    return (
      <DatabaseError 
        message="Failed to read data from the Supabase database. Please check your connection and try again later."
        onRetry={handleRetry}
        onHelp={handleGetHelp}
        fullScreen
      />
    );
  }
  
  // Handle other errors gracefully
  if (error || !property) {
    return (
      <PropertyErrorState 
        title="Error Loading Property" 
        message={error?.message || 'The property data could not be loaded. Please try again.'}
        errorCode={error && 'code' in error ? (error as any).code : 404}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="p-6">
      <PropertyHeader 
        title={property.title}
        isAdmin={isAdmin}
        propertyType={propertyType}
        onEdit={handleEditProperty}
        onDelete={handleDeleteProperty}
      />
      
      <PropertySummaryCard 
        property={property}
        propertyImages={propertyImages}
        propertyType={propertyType}
      />
      
      <PropertyTabsSection 
        property={property}
        owner={propertyOwner}
        notes={notes}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default PropertyDetail;
