
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
    queryFn: () => propertiesApi.getById(id),
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
