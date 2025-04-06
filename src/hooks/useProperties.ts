
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        toast.error(`Failed to load properties: ${error.message}`);
        throw error;
      }
      
      return {
        properties: data || [],
        totalCount: count || 0
      };
    } catch (err: any) {
      console.error('Exception in useProperties:', err);
      toast.error(`An error occurred: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };
  
  return useQuery({
    queryKey: ['properties', page, pageSize, filters],
    queryFn: fetchProperties,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
};
