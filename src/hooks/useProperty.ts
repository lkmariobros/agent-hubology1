
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  type: string;
  price: number;
  created_at: string;
  updated_at: string;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  lot_size?: number;
  year_built?: number;
  annual_taxes?: number;
  hoa_fees?: number;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  agent_name?: string;
}

export const useProperty = (id?: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        // In a real implementation, fetch property from API
        // For now, return mock data
        const mockProperty: Property = {
          id: id,
          address: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          status: 'active',
          type: 'residential',
          price: 1250000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bedrooms: 3,
          bathrooms: 2,
          square_footage: 1800,
          lot_size: 0.25,
          year_built: 1998,
          annual_taxes: 12500,
          hoa_fees: 350,
          owner_name: 'John Smith',
          owner_email: 'john.smith@example.com',
          owner_phone: '(555) 123-4567',
          agent_name: 'Sarah Johnson'
        };
        
        return mockProperty;
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
        throw error;
      }
    },
    enabled: !!id
  });
};

export default useProperty;
