
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropertyFormData } from '@/types/property-form';

// Get all properties with filtering and pagination
export function useProperties(page = 1, pageSize = 10, filters = {}) {
  return useQuery({
    queryKey: ['properties', page, pageSize, filters],
    queryFn: async () => {
      console.log('Fetching properties with filters:', filters);
      
      let query = supabase
        .from('enhanced_properties')
        .select(`
          *,
          property_types(name),
          transaction_types(name),
          property_statuses(name),
          property_images(id, storage_path, is_cover, display_order)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
        
      // Apply filters if provided
      if (filters) {
        // Example filter handling - expand as needed
        if (filters.propertyType) {
          query = query.eq('property_type_id', filters.propertyType);
        }
        
        if (filters.transactionType) {
          query = query.eq('transaction_type_id', filters.transactionType);
        }
        
        if (filters.status) {
          query = query.eq('status_id', filters.status);
        }
        
        // Handle price range filters
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }
      
      // Also get the total count for pagination
      const { count: totalCount, error: countError } = await supabase
        .from('enhanced_properties')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error('Error fetching property count:', countError);
      }
      
      return { 
        properties: data || [], 
        totalCount: totalCount || 0
      };
    }
  });
}

// Get a single property by ID
export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return { success: false, message: 'No property ID provided', data: null };
      
      console.log('Fetching property with ID:', id);
      
      const { data, error } = await supabase
        .from('enhanced_properties')
        .select(`
          *,
          property_types(name),
          transaction_types(name),
          property_statuses(name),
          property_images(id, storage_path, is_cover, display_order)
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching property:', error);
        return { success: false, message: error.message, data: null };
      }
      
      return { 
        success: true, 
        message: 'Property retrieved successfully', 
        data: data 
      };
    },
    enabled: !!id,
  });
}

// Create a new property
export function useCreateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (propertyData: Partial<PropertyFormData>) => {
      // This function is now handled by the formSubmission.ts file
      // which does all the property creation including image uploads
      console.log('Property creation is handled by formSubmission.ts');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => {
      console.log('Updating property with ID:', id, data);
      
      const { error } = await supabase
        .from('enhanced_properties')
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          // Add all other fields to update
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating property:', error);
        throw error;
      }
      
      return { success: true };
    },
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
    mutationFn: async (id: string) => {
      console.log('Deleting property with ID:', id);
      
      // Delete associated images and documents first
      const { error: imagesError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', id);
        
      if (imagesError) {
        console.error('Error deleting property images:', imagesError);
      }
      
      const { error: documentsError } = await supabase
        .from('property_documents')
        .delete()
        .eq('property_id', id);
        
      if (documentsError) {
        console.error('Error deleting property documents:', documentsError);
      }
      
      // Then delete the property
      const { error } = await supabase
        .from('enhanced_properties')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting property:', error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete property: ${error.message}`);
    },
  });
}
