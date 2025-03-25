
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropertyFormData } from '@/types/property-form';

// Define the filters interface 
export interface PropertyFilters {
  propertyType?: string;
  transactionType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  title?: string;
  bedrooms?: number;
  bathrooms?: number;
  agentId?: string;
  featured?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  createdAfter?: string;
  [key: string]: any;
}

// Get all properties with filtering and pagination
export function useProperties(page = 1, pageSize = 10, filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', page, pageSize, filters],
    queryFn: async () => {
      console.log('Fetching properties with filters:', filters);
      
      // Start with the base query
      let query = supabase
        .from('enhanced_properties')
        .select(`
          *,
          property_types(name),
          transaction_types(name),
          property_statuses(name),
          property_images(id, storage_path, is_cover, display_order)
        `);
        
      // Apply sort order - default to newest first
      const sortBy = filters.sortBy || 'created_at';
      const sortDirection = filters.sortDirection || 'desc';
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
        
      // Apply filters if provided
      if (filters) {
        // Property type filter
        if (filters.propertyType && filters.propertyType !== 'all') {
          // Get the property type ID first
          const { data: propertyTypeData } = await supabase
            .from('property_types')
            .select('id')
            .eq('name', filters.propertyType)
            .single();
            
          if (propertyTypeData) {
            query = query.eq('property_type_id', propertyTypeData.id);
          }
        }
        
        // Transaction type filter
        if (filters.transactionType && filters.transactionType !== 'all') {
          // Get the transaction type ID first
          const { data: transactionTypeData } = await supabase
            .from('transaction_types')
            .select('id')
            .eq('name', filters.transactionType)
            .single();
            
          if (transactionTypeData) {
            query = query.eq('transaction_type_id', transactionTypeData.id);
          }
        }
        
        // Status filter
        if (filters.status && filters.status !== 'all') {
          // Get the status ID first
          const { data: statusData } = await supabase
            .from('property_statuses')
            .select('id')
            .eq('name', filters.status)
            .single();
            
          if (statusData) {
            query = query.eq('status_id', statusData.id);
          }
        }
        
        // Handle price range filters
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        
        // Handle title search
        if (filters.title) {
          query = query.ilike('title', `%${filters.title}%`);
        }
        
        // Filter by number of bedrooms
        if (filters.bedrooms) {
          query = query.gte('bedrooms', filters.bedrooms);
        }
        
        // Filter by number of bathrooms
        if (filters.bathrooms) {
          query = query.gte('bathrooms', filters.bathrooms);
        }
        
        // Filter by agent
        if (filters.agentId) {
          query = query.eq('agent_id', filters.agentId);
        }
        
        // Filter for featured properties
        if (filters.featured) {
          query = query.eq('featured', true);
        }
        
        // Filter by creation date
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter);
        }
      }
      
      // Apply pagination
      query = query.range((page - 1) * pageSize, page * pageSize - 1);
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }
      
      // Also get the total count for pagination
      const countQuery = supabase
        .from('enhanced_properties')
        .select('*', { count: 'exact', head: true });
        
      // Apply the same filters to the count query
      if (filters) {
        // Apply the same filters as above
        // Property type filter
        if (filters.propertyType && filters.propertyType !== 'all') {
          // Get the property type ID first
          const { data: propertyTypeData } = await supabase
            .from('property_types')
            .select('id')
            .eq('name', filters.propertyType)
            .single();
            
          if (propertyTypeData) {
            countQuery.eq('property_type_id', propertyTypeData.id);
          }
        }
        
        // Handle all other filters the same way as the main query
        // Handle price range filters
        if (filters.minPrice) {
          countQuery.gte('price', filters.minPrice);
        }
        
        if (filters.maxPrice) {
          countQuery.lte('price', filters.maxPrice);
        }
        
        // Handle title search
        if (filters.title) {
          countQuery.ilike('title', `%${filters.title}%`);
        }
        
        // Filter by number of bedrooms
        if (filters.bedrooms) {
          countQuery.gte('bedrooms', filters.bedrooms);
        }
        
        // Filter by number of bathrooms
        if (filters.bathrooms) {
          countQuery.gte('bathrooms', filters.bathrooms);
        }
        
        // Filter by agent
        if (filters.agentId) {
          countQuery.eq('agent_id', filters.agentId);
        }
        
        // Filter for featured properties
        if (filters.featured) {
          countQuery.eq('featured', true);
        }
        
        // Filter by creation date
        if (filters.createdAfter) {
          countQuery.gte('created_at', filters.createdAfter);
        }
      }
      
      const { count: totalCount, error: countError } = await countQuery;
        
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
        data
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
