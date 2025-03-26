
import { useQuery } from '@tanstack/react-query';
import { Transaction, Property } from '@/types';

const fetchTransactions = async (page: number = 1, pageSize: number = 10) => {
  const response = await fetch(`/api/transactions?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
};

export const useTransactions = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['transactions', page, pageSize],
    queryFn: () => fetchTransactions(page, pageSize)
  });
};

const fetchProperties = async () => {
  const response = await fetch('/api/properties');
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

export const usePropertiesForTransactions = () => {
  return useQuery({
    queryKey: ['propertiesForTransactions'],
    queryFn: fetchProperties
  });
};

export const useTransactionOptions = () => {
  const { data: propertiesData, isLoading, error } = usePropertiesForTransactions();

  const propertyOptions = propertiesData?.map((property: any) => ({
    id: property.id,
    title: property.title,
    city: property.city,
    state: property.state
  })) || [];

  return {
    propertyOptions,
    isLoading,
    error,
  };
};

// Extended hook with query params support
export const useTransactionsQuery = ({ 
  page = 0, 
  limit = 10, 
  search = '', 
  status = ''
}: { 
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['transactions', { page, limit, search, status }],
    queryFn: async () => {
      // In a real app, this would be a real API call with query params
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);
      
      const mockResponse = {
        transactions: [
          {
            id: '1',
            date: new Date().toISOString(),
            propertyId: '101',
            property: {
              title: 'Luxury Condominium',
              address: { city: 'Kuala Lumpur', state: 'Malaysia' }
            },
            agent: { id: 'a1', name: 'John Doe' },
            price: 750000,
            commission: 22500,
            status: 'completed'
          },
          {
            id: '2',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            propertyId: '102',
            property: {
              title: 'Commercial Shop Lot',
              address: { city: 'Penang', state: 'Malaysia' }
            },
            agent: { id: 'a2', name: 'Jane Smith' },
            price: 1200000,
            commission: 36000,
            status: 'pending'
          },
          {
            id: '3',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            propertyId: '103',
            property: {
              title: 'Bungalow with Pool',
              address: { city: 'Johor Bahru', state: 'Malaysia' }
            },
            agent: { id: 'a3', name: 'Robert Johnson' },
            price: 1500000,
            commission: 45000,
            status: 'in progress'
          }
        ],
        total: 3
      };
      
      return mockResponse;
    },
    staleTime: 60000 // 1 minute
  });
};

// For use in components
export const useTransactions = () => {
  return {
    useTransactionsQuery
  };
};
