
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProperty } from '@/hooks/useProperties';
import { supabase } from '@/lib/supabase';
import { dbLogger } from '@/utils/dbLogger';
import { getMockDataMode } from '@/config';
import { normalizeUuid, isValidUuid, createMockUuid } from '@/utils/uuidUtils';
import { toast } from 'sonner';

// Context type definition
interface PropertyDetailContextType {
  property: any;
  propertyOwner: any;
  notes: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  handleAddNote: (note: any) => void;
  propertyImages: string[];
  propertyType: string;
}

// Create context with default values
const PropertyDetailContext = createContext<PropertyDetailContextType>({
  property: null,
  propertyOwner: null,
  notes: [],
  isLoading: true,
  error: null,
  refetch: () => {},
  handleAddNote: () => {},
  propertyImages: [],
  propertyType: 'Property'
});

// Hook to use the context
export const usePropertyDetail = () => useContext(PropertyDetailContext);

interface PropertyDetailProviderProps {
  propertyId: string;
  children: ReactNode;
}

// Provider component
export const PropertyDetailProvider: React.FC<PropertyDetailProviderProps> = ({ 
  propertyId, 
  children 
}) => {
  const normalizedId = propertyId ? normalizeUuid(propertyId) : null;
  const [notes, setNotes] = useState<any[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [propertyOwner, setPropertyOwner] = useState<any>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Check whether to use mock data
  const useMockData = getMockDataMode();
  const isValidPropertyId = normalizedId ? isValidUuid(normalizedId) : false;
  
  // Get property data from Supabase
  const { 
    data: propertyResponse, 
    isLoading: isQueryLoading, 
    error: queryError, 
    refetch 
  } = useProperty(normalizedId || '', {
    enabled: !useMockData && isValidPropertyId && !!normalizedId
  });
  
  // Fetch property owner
  useEffect(() => {
    const fetchPropertyOwner = async () => {
      if (!normalizedId || useMockData) return;
      
      try {
        const { data, error } = await supabase
          .from('property_owners')
          .select('*')
          .eq('property_id', normalizedId)
          .eq('is_primary_contact', true)
          .maybeSingle();
          
        if (error) throw error;
        if (data) {
          console.log('PropertyDetail: Owner data loaded:', data);
          setPropertyOwner(data);
        }
      } catch (err) {
        console.error('Error fetching property owner:', err);
      }
    };
    
    fetchPropertyOwner();
  }, [normalizedId, useMockData]);
  
  useEffect(() => {
    console.log('PropertyDetail: useEffect running with propertyResponse =', propertyResponse);
    
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
        title: `Sample Property ${propertyId || ''}`,
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
      
      // Mock owner data
      setPropertyOwner({
        id: 'mock-owner',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Smith Properties',
        is_primary_contact: true
      });
      
      console.log('PropertyDetail: Mock property set', mockProperty);
    } else if (propertyResponse?.data) {
      // Log successful data fetch
      dbLogger.success('Property data loaded from Supabase', propertyResponse.data, 'enhanced_properties', 'select', false);
      
      // Fetch property images if they aren't included
      if (!propertyResponse.data.property_images || propertyResponse.data.property_images.length === 0) {
        console.log('PropertyDetail: No property_images in data, fetching separately');
        fetchPropertyImages(propertyResponse.data.id).then(images => {
          if (images && images.length > 0) {
            console.log('PropertyDetail: Fetched property images:', images);
            setProperty({
              ...propertyResponse.data,
              property_images: images
            });
          } else {
            console.log('PropertyDetail: No images found for property');
            setProperty(propertyResponse.data);
          }
        });
      } else {
        setProperty(propertyResponse.data);
      }
      
      console.log('PropertyDetail: Real property data set', propertyResponse.data);
    }

    // Set local loading state to give the app time to process mock data
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
      console.log('PropertyDetail: Local loading complete');
    }, 800);

    return () => clearTimeout(timer);
  }, [normalizedId, propertyResponse, useMockData, propertyId, isValidPropertyId]);

  // Function to fetch property images separately
  const fetchPropertyImages = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching property images:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching property images:', err);
      return [];
    }
  };

  // Function to add a note
  const handleAddNote = (note: any) => {
    // In a real app, you would add the note to Supabase here
    const newNote = {
      id: notes.length + 1,
      author: note.author,
      content: note.content,
      date: 'Just now'
    };
    setNotes([newNote, ...notes]);
    toast.success('Note added successfully');
  };

  // Create an array of image URLs from property_images
  const propertyImages = property?.property_images 
    ? property.property_images.map((img: any) => img.storage_path).filter(Boolean) 
    : [];
    
  // Extract property type from property_types relation
  const propertyType = property?.property_types?.name || 'Property';

  // Determine if we are in a loading state
  const isLoading = isQueryLoading || isLocalLoading;

  // Provide context value
  const contextValue = {
    property,
    propertyOwner,
    notes,
    isLoading,
    error: queryError as Error | null,
    refetch,
    handleAddNote,
    propertyImages,
    propertyType
  };

  return (
    <PropertyDetailContext.Provider value={contextValue}>
      {children}
    </PropertyDetailContext.Provider>
  );
};

export default PropertyDetailProvider;
