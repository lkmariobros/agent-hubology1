
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { deleteStorageFile } from '@/integrations/supabase/storage';

// Get all properties
export const useProperties = (filters?: any) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('enhanced_properties')
        .select(`
          *,
          property_types (*),
          transaction_types (*),
          property_statuses (*),
          property_images (*)
        `);
      
      // Apply filters if provided
      if (filters) {
        if (filters.type) {
          query = query.eq('property_type_id', filters.type);
        }
        
        if (filters.status) {
          query = query.eq('status_id', filters.status);
        }
        
        if (filters.transactionType) {
          query = query.eq('transaction_type_id', filters.transactionType);
        }
        
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        
        if (filters.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }
        
        if (filters.city) {
          query = query.ilike('city', `%${filters.city}%`);
        }
        
        if (filters.bedrooms) {
          query = query.gte('bedrooms', filters.bedrooms);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        throw new Error(error.message);
      }
      
      return { data };
    },
  });
};

// Get a single property by ID
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enhanced_properties')
        .select(`
          *,
          property_types (*),
          transaction_types (*),
          property_statuses (*),
          property_images (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching property ${id}:`, error);
        throw new Error(error.message);
      }
      
      return { data };
    },
    enabled: !!id,
  });
};

// Delete a property
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First, get the property to find associated images/documents
      const { data: property, error: propertyError } = await supabase
        .from('enhanced_properties')
        .select(`
          id,
          property_images (storage_path),
          property_documents (storage_path)
        `)
        .eq('id', id)
        .single();
      
      if (propertyError) {
        console.error(`Error fetching property ${id} for deletion:`, propertyError);
        throw new Error(propertyError.message);
      }
      
      // Delete associated images from storage
      if (property.property_images && property.property_images.length > 0) {
        for (const image of property.property_images) {
          await deleteStorageFile('property-images', image.storage_path);
        }
      }
      
      // Delete associated documents from storage
      if (property.property_documents && property.property_documents.length > 0) {
        for (const document of property.property_documents) {
          await deleteStorageFile('property-documents', document.storage_path);
        }
      }
      
      // Delete the property record
      const { error } = await supabase
        .from('enhanced_properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting property ${id}:`, error);
        throw new Error(error.message);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// Get property types
export const usePropertyTypes = () => {
  return useQuery({
    queryKey: ['property-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_types')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching property types:', error);
        throw new Error(error.message);
      }
      
      return { types: data || [] };
    },
  });
};

// Get transaction types
export const useTransactionTypes = () => {
  return useQuery({
    queryKey: ['transaction-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transaction_types')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching transaction types:', error);
        throw new Error(error.message);
      }
      
      return { types: data || [] };
    },
  });
};

// Get property statuses
export const usePropertyStatuses = () => {
  return useQuery({
    queryKey: ['property-statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_statuses')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching property statuses:', error);
        throw new Error(error.message);
      }
      
      return { statuses: data || [] };
    },
  });
};
