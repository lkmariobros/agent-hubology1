
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, Property } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Fetch transactions from Supabase with secure RLS enforcement
const fetchTransactions = async (page: number = 1, pageSize: number = 10) => {
  const startRow = (page - 1) * pageSize;
  
  // Get current user - this ensures RLS policies are applied correctly
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData?.user) {
    console.warn('No authenticated user found for fetching transactions');
    return { transactions: [], total: 0 };
  }
  
  const { data, error, count } = await supabase
    .from('property_transactions')
    .select('*, property:property_id(title)', { count: 'exact' })
    .range(startRow, startRow + pageSize - 1)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
  
  return {
    transactions: data,
    total: count || 0
  };
};

// Basic transaction fetching hook
export const useBasicTransactions = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['transactions', page, pageSize],
    queryFn: () => fetchTransactions(page, pageSize)
  });
};

// Property fetching function
const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('enhanced_properties')
    .select('id, title, city, state, status_id, price')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
  
  return data;
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

// Advanced transactions query with filtering - respects RLS
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
      // Get current user first to ensure RLS is applied
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        console.warn('No authenticated user found for fetching transactions');
        return { transactions: [], total: 0 };
      }
      
      // Build query with filters
      let query = supabase
        .from('property_transactions')
        .select(`
          *,
          property:property_id(title, state, city),
          agent:agent_id(full_name)
        `, { count: 'exact' });
      
      // Apply filters
      if (search) {
        query = query.or(`
          property.title.ilike.%${search}%,
          agent.full_name.ilike.%${search}%,
          buyer_name.ilike.%${search}%,
          seller_name.ilike.%${search}%
        `);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      // Pagination
      const from = page * limit;
      const to = from + limit - 1;
      query = query.range(from, to).order('created_at', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      return {
        transactions: data || [],
        total: count || 0
      };
    },
    staleTime: 60000 // 1 minute
  });
};

// Fetch a single transaction by ID
export const useTransactionQuery = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_transactions')
        .select(`
          *,
          property:property_id(*),
          agent:agent_id(*),
          documents:transaction_documents(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching transaction:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 60000 // 1 minute
  });
};

// Create transaction mutation
export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData: any) => {
      // Get current user to ensure RLS is applied
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('property_transactions')
        .insert({
          // Map the form data to database fields
          transaction_date: transactionData.transactionDate,
          property_id: transactionData.propertyId,
          transaction_value: transactionData.transactionValue,
          commission_rate: transactionData.commissionRate,
          commission_amount: transactionData.commissionAmount,
          agent_id: userData.user.id,
          status: 'Pending',
          notes: transactionData.notes,
          buyer_name: transactionData.buyer?.name,
          buyer_email: transactionData.buyer?.email,
          buyer_phone: transactionData.buyer?.phone,
          seller_name: transactionData.seller?.name,
          seller_email: transactionData.seller?.email,
          seller_phone: transactionData.seller?.phone,
          closing_date: transactionData.closingDate
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    }
  });
};

// Main hook that exports all transaction-related hooks
export const useTransactions = () => {
  return {
    useTransactionsQuery,
    useTransactionQuery,
    useCreateTransactionMutation
  };
};
