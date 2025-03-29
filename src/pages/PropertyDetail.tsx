import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { getMockDataMode } from '@/config';
import { normalizeUuid, isValidUuid, createMockUuid } from '@/utils/uuidUtils';
import { dbLogger } from '@/utils/dbLogger';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertySummaryCard from '@/components/property/PropertySummaryCard';
import PropertyTabsSection from '@/components/property/PropertyTabsSection';
import PropertyErrorState from '@/components/property/PropertyErrorState';
import PropertyLoadingSkeleton from '@/components/property/PropertyLoadingSkeleton';
import { TeamNote } from '@/components/property/TeamNotes';

// Mock data for team notes
const mockNotes: TeamNote[] = [{
  id: 1,
  author: {
    name: "John Smith",
    initials: "JS",
    avatarColor: "bg-blue-500"
  },
  date: "2 hours ago",
  content: "Just showed this property to the Johnsons. They're very interested and might make an offer soon."
}, {
  id: 2,
  author: {
    name: "Sarah Lee",
    initials: "SL",
    avatarColor: "bg-green-500"
  },
  date: "Yesterday",
  content: "Owner mentioned they might be willing to negotiate on the price. Starting point is firm though."
}];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const normalizedId = id ? normalizeUuid(id) : null;

  // Check whether to use mock data based on config and localStorage
  const useMockData = getMockDataMode();
  
  // Only enable the query if we're not using mock data and we have a valid UUID
  const isValidPropertyId = normalizedId ? isValidUuid(normalizedId) : false;
  
  const { data: propertyResponse, isLoading, error, refetch } = useProperty(normalizedId || '', {
    enabled: !useMockData && isValidPropertyId && !!normalizedId
  });
  
  const [notes, setNotes] = useState<TeamNote[]>(mockNotes);
  const [property, setProperty] = useState<any>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  useEffect(() => {
    dbLogger.log(`Property detail loaded for ID: ${normalizedId}`, { id: normalizedId, useMockData }, {
      table: 'enhanced_properties',
      operation: 'select'
    });

    // In development mock data mode, use mock data
    if (useMockData || (import.meta.env.MODE === 'development' && (!isValidPropertyId || !normalizedId))) {
      dbLogger.log(`Using mock data for property ID: ${normalizedId || 'unknown'}`);
      
      // Generate a consistent mock ID based on the provided ID or create a new one
      const mockId = normalizedId || createMockUuid(normalizedId);
      
      // Load mock data based on the ID
      const mockProperty = {
        id: mockId,
        title: `Sample Property ${id || ''}`,
        description: 'This is a sample property description used for development.',
        price: 750000,
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zip: '94102',
        bedrooms: 3,
        bathrooms: 2,
        built_up_area: 1500,
        land_area: 2000,
        featured: true,
        agent_notes: 'Owner is highly motivated to sell.',
        created_at: new Date().toISOString(),
        property_types: {
          name: 'Residential'
        },
        transaction_types: {
          name: 'For Sale'
        },
        property_statuses: {
          name: 'Active'
        },
        property_images: [{
          id: 1,
          storage_path: 'https://picsum.photos/id/1067/800/600',
          is_cover: true
        }, {
          id: 2,
          storage_path: 'https://picsum.photos/id/1068/800/600'
        }, {
          id: 3,
          storage_path: 'https://picsum.photos/id/1069/800/600'
        }, {
          id: 4,
          storage_path: 'https://picsum.photos/id/1070/800/600'
        }, {
          id: 5,
          storage_path: 'https://picsum.photos/id/1071/800/600'
        }]
      };
      setProperty(mockProperty);
    } else if (propertyResponse?.data) {
      dbLogger.success('Property data loaded from Supabase', propertyResponse.data, 'enhanced_properties', 'select', false);
      setProperty(propertyResponse.data);
    }

    // Set local loading state to give the app time to process mock data
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [normalizedId, propertyResponse, useMockData, id, isValidPropertyId]);

  const handleAddNote = (note: Omit<TeamNote, 'id' | 'date'>) => {
    // In a real app, you would add the note to Supabase here
    const newNote: TeamNote = {
      id: notes.length + 1,
      author: note.author,
      content: note.content,
      date: 'Just now'
    };
    setNotes([newNote, ...notes]);
    toast.success('Note added successfully');
  };

  const handleEditProperty = () => {
    navigate(`/properties/edit/${id}`);
  };

  const handleDeleteProperty = () => {
    // Implement delete functionality
    toast.error('Delete functionality not implemented yet');
  };

  const handleRetry = () => {
    setIsLocalLoading(true);
    
    if (useMockData) {
      // Re-trigger the mock data effect by forcing a state update
      setProperty(null);
      setTimeout(() => setIsLocalLoading(false), 800);
    } else {
      // Real data - use the refetch function
      refetch().finally(() => {
        setTimeout(() => setIsLocalLoading(false), 300);
      });
    }
    
    toast.info('Retrying...');
  };

  // Show skeleton during loading
  if (isLoading || isLocalLoading) {
    return <PropertyLoadingSkeleton />;
  }

  // Handle error states more gracefully
  if ((error || !propertyResponse?.data) && !useMockData && !import.meta.env.DEV) {
    dbLogger.error('Error loading property', error?.message || 'Property not found', 'enhanced_properties', 'select');
    console.error('Error loading property:', error?.message || 'Property not found', propertyResponse);
    
    return <PropertyErrorState 
      title="Error Loading Property" 
      message={error?.message || 'The property data could not be loaded. Please try again.'}
      errorCode={error && 'code' in error ? (error as any).code : 404}
      onRetry={handleRetry}
    />;
  }

  // Handle missing property data
  if (!property) {
    return <PropertyErrorState 
      title="Property Not Found" 
      message="The requested property could not be found or may have been removed."
      errorCode={404}
      onRetry={handleRetry}
    />;
  }

  // Log successful property data
  dbLogger.log('Property data processed', property, {
    table: 'enhanced_properties',
    operation: 'select',
    showData: false
  });

  // Extract property type from property_types relation
  const propertyType = property.property_types?.name || 'Property';

  // Create an array of image URLs from property_images
  const propertyImages = property.property_images ? property.property_images.map((img: any) => img.storage_path).filter(Boolean) : [];

  // Mock owner data - in a real app this would come from the API
  const owner = {
    name: "Michael Roberts",
    email: "michael.roberts@example.com",
    phone: "+1 (555) 123-4567",
    company: "Roberts Real Estate Holdings"
  };

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
        owner={owner}
        notes={notes}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default PropertyDetail;
