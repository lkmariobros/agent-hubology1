
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { withRetry, logError, handleApiError } from '@/utils/errorHandlingUtils';
import { safeSupabaseOperation } from '@/utils/supabaseHelpers';

export interface PropertyFilters {
  title?: string;
  propertyType?: string;
  featured?: boolean;
  status?: string;
  transactionType?: string;
  priceMin?: number;
  priceMax?: number;
  [key: string]: any;
}

export const useProperties = (page: number = 1, pageSize: number = 10, filters: PropertyFilters = {}) => {
  const fetchProperties = async () => {
    try {
      console.log('Fetching properties with filters:', filters);
      // Calculate pagination values
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Start building the query
      let query = supabase
        .from('enhanced_properties')
        .select(`
          *,
          property_types(*),
          transaction_types(*),
          property_statuses(*),
          property_images(*)
        `, { count: 'exact' });
      
      // Apply filters if they exist
      if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`);
      }
      
      if (filters.propertyType && filters.propertyType !== 'all') {
        // Join to property_types and filter by name
        query = query.eq('property_types.name', filters.propertyType);
      }
      
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      
      if (filters.status && filters.status !== 'all') {
        // Join to property_statuses and filter by name
        query = query.eq('property_statuses.name', filters.status);
      }
      
      if (filters.transactionType && filters.transactionType !== 'all') {
        // Join to transaction_types and filter by name
        query = query.eq('transaction_types.name', filters.transactionType);
      }
      
      if (filters.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin);
      }
      
      if (filters.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax);
      }
      
      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false });
      
      // Apply pagination
      query = query.range(from, to);
      
      // Use the retry wrapper for better resilience
      const { data, error, count } = await withRetry(
        () => query,
        3, // 3 retries
        1000, // Start with 1 second delay
        'useProperties'
      );
      
      if (error) {
        logError(error, 'useProperties', { filters, page, pageSize });
        toast.error(`Failed to load properties: ${error.message}`);
        throw error;
      }
      
      return {
        properties: data || [],
        totalCount: count || 0
      };
    } catch (err: any) {
      logError(err, 'useProperties', { filters, page, pageSize });
      toast.error(`An error occurred while loading properties: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };
  
  return useQuery({
    queryKey: ['properties', page, pageSize, filters],
    queryFn: fetchProperties,
    placeholderData: (previousData) => previousData, // This replaces keepPreviousData in v5
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    // Add better error fallback
    meta: {
      errorMessage: 'Failed to load properties'
    }
  });
};

// Single property hook with improved error handling
export const useProperty = (propertyId: string, options = {}) => {
  const fetchProperty = async () => {
    try {
      console.log('Fetching property details for ID:', propertyId);
      
      // Use withRetry for better resilience
      const { data, error } = await withRetry(
        () => supabase
          .from('enhanced_properties')
          .select(`
            *,
            property_types(*),
            transaction_types(*),
            property_statuses(*),
            property_images(*)
          `)
          .eq('id', propertyId)
          .maybeSingle(),
        3,
        1000,
        'useProperty'
      );
      
      if (error) {
        logError(error, 'useProperty', { propertyId });
        toast.error(`Failed to load property details: ${error.message}`);
        throw error;
      }
      
      return { data };
    } catch (err: any) {
      logError(err, 'useProperty', { propertyId });
      toast.error(`An error occurred: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };
  
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: fetchProperty,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    // Add better error fallback
    meta: {
      errorMessage: 'Failed to load property details'
    }
  });
};
