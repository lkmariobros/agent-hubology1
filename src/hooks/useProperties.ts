
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '@/lib/api';
import { toast } from 'sonner';
import { Property } from '@/types';

// Get all properties with filtering and pagination
export function useProperties(page = 1, pageSize = 10, filters = {}) {
  return useQuery({
    queryKey: ['properties', page, pageSize, filters],
    queryFn: () => propertiesApi.getAll(page, pageSize, filters),
    meta: {
      keepPreviousData: true
    }
  });
}

// Get a single property by ID
export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => {
      // For development, return mock data for property details
      // In a real app, this would call propertiesApi.getById(id)
      if (!id) return { success: false, message: 'No property ID provided', data: null };
      
      // Mock data for property with ID
      const mockProperties = [
        {
          id: '1',
          title: 'Modern Apartment in City Center',
          description: 'A beautiful modern apartment located in the heart of the city. Features high ceilings, hardwood floors, and state-of-the-art appliances.\n\nThe apartment includes a spacious living room, a modern kitchen, and a balcony with a stunning view of the city skyline. The building offers 24/7 security, a fitness center, and a rooftop garden.',
          price: 650000,
          address: {
            street: '123 Main Street',
            city: 'Kuala Lumpur',
            state: 'Federal Territory',
            zip: '50000',
            country: 'Malaysia'
          },
          type: 'residential',
          subtype: 'apartment',
          features: ['Parking', 'Swimming Pool', 'Gym', 'Security System', 'Balcony', 'Air Conditioning'],
          size: 1200,
          bedrooms: 2,
          bathrooms: 2,
          images: ['/placeholder.svg'],
          status: 'available',
          createdAt: '2023-07-15T10:30:00Z',
          updatedAt: '2023-07-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Luxury Bungalow with Pool',
          description: 'Elegant luxury bungalow situated in a prestigious neighborhood with a private swimming pool and landscaped garden.',
          price: 1750000,
          address: {
            street: '45 Palm Avenue',
            city: 'Johor Bahru',
            state: 'Johor',
            zip: '80100',
            country: 'Malaysia'
          },
          type: 'residential',
          subtype: 'bungalow',
          features: ['Private Pool', 'Garden', 'Parking', 'Security System', 'Smart Home Features'],
          size: 3800,
          bedrooms: 5,
          bathrooms: 6,
          images: ['/placeholder.svg'],
          status: 'available',
          createdAt: '2023-06-22T14:45:00Z',
          updatedAt: '2023-06-25T09:15:00Z'
        }
      ];
      
      const property = mockProperties.find(p => p.id === id);
      
      if (!property) {
        return { success: false, message: 'Property not found', data: null };
      }
      
      return { 
        success: true, 
        message: 'Property retrieved successfully', 
        data: property 
      };
    },
    enabled: !!id, // Only run when id is available
  });
}

// Create a new property
export function useCreateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyData: Partial<Property>) => propertiesApi.create(propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create property: ${error.message}`);
    },
  });
}

// Update an existing property
export function useUpdateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) => 
      propertiesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      toast.success('Property updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update property: ${error.message}`);
    },
  });
}

// Delete a property
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete property: ${error.message}`);
    },
  });
}
