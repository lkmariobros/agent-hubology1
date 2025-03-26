
import { useQuery } from '@tanstack/react-query';
import { Transaction, Property } from '@/types';

// Basic transaction fetch function
const fetchTransactions = async (page: number = 1, pageSize: number = 10) => {
  const response = await fetch(`/api/transactions?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
};

// Basic transaction fetching hook (renamed to avoid duplication)
export const useBasicTransactions = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['transactions', page, pageSize],
    queryFn: () => fetchTransactions(page, pageSize)
  });
};

// Property fetching function
const fetchProperties = async () => {
  const response = await fetch('/api/properties');
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

// Property fetching hook for transaction forms
export const usePropertiesForTransactions = () => {
  return useQuery({
    queryKey: ['propertiesForTransactions'],
    queryFn: fetchProperties
  });
};

// Hook to get property options for transaction forms
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

// Advanced transactions query with filtering
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

// Fetch a single transaction by ID
export const useTransactionQuery = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      // Mock implementation - in a real app, this would be a real API call
      const mockTransaction = {
        id,
        date: new Date().toISOString(),
        propertyId: '101',
        property: {
          title: 'Luxury Condominium',
          address: { city: 'Kuala Lumpur', state: 'Malaysia' }
        },
        agent: { id: 'a1', name: 'John Doe' },
        price: 750000,
        commission: 22500,
        commissionRate: 3, // Added the missing commissionRate property
        status: 'completed',
        buyer: {
          name: 'Alice Brown',
          email: 'alice@example.com',
          phone: '+601234567890'
        },
        seller: {
          name: 'Bob Green',
          email: 'bob@example.com',
          phone: '+601234567891'
        },
        notes: 'This is a sample transaction.',
        closingDate: new Date().toISOString(), // Added the missing closingDate property
        documents: [
          { id: 'd1', name: 'Sale Agreement.pdf' },
          { id: 'd2', name: 'Property Inspection.pdf' }
        ]
      };
      
      return mockTransaction;
    },
    staleTime: 60000 // 1 minute
  });
};

// Create transaction mutation
export const useCreateTransactionMutation = () => {
  return {
    mutateAsync: async (data: any) => {
      // Mock implementation - would be a real API call in production
      console.log('Creating transaction with data:', data);
      return { success: true, id: 'new-transaction-id' };
    },
    isLoading: false,
    isPending: false, // Added isPending property to match TanStack Query v5
    error: null
  };
};

// Main hook that exports all transaction-related hooks
export const useTransactions = () => {
  return {
    useTransactionsQuery,
    useTransactionQuery,
    useCreateTransactionMutation
  };
};
