
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  propertyId?: string;
}

export interface Transaction {
  id: string;
  date: string;
  property: {
    title: string;
    address: {
      city: string;
      state: string;
    }
  };
  agent: {
    id: string;
    name: string;
  };
  price: number;
  commission: number;
  status: string;
}

export const useTransactions = () => {
  const useTransactionsQuery = (params?: TransactionQueryParams) => {
    return useQuery({
      queryKey: ['transactions', params],
      queryFn: async () => {
        try {
          // In a real implementation, this would query the database
          // For now, return mock data
          const mockTransactions: Transaction[] = [];
          
          // If propertyId is specified, filter to just those for this property
          if (params?.propertyId) {
            // Add a mock transaction for this property
            mockTransactions.push({
              id: '1234-5678',
              date: new Date().toISOString(),
              property: {
                title: 'Sample Property',
                address: {
                  city: 'San Francisco',
                  state: 'CA'
                }
              },
              agent: {
                id: 'agent-123',
                name: 'Sarah Johnson'
              },
              price: 500000,
              commission: 15000,
              status: 'Completed'
            });
          }
          
          return {
            transactions: mockTransactions,
            totalCount: mockTransactions.length
          };
        } catch (error) {
          console.error('Error fetching transactions:', error);
          toast.error('Failed to load transactions');
          throw error;
        }
      }
    });
  };

  return {
    useTransactionsQuery
  };
};

export default useTransactions;
