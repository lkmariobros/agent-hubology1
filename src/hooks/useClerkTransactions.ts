import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getSupabaseWithClerkToken, handleSupabaseError } from '@/utils/supabaseHelpers';

/**
 * Fetch transactions from Supabase with Clerk authentication
 */
const fetchTransactions = async (
  getToken: () => Promise<string | null>,
  page: number = 1,
  pageSize: number = 10
) => {
  const startRow = (page - 1) * pageSize;

  try {
    // Get Supabase client with Clerk token
    const client = await getSupabaseWithClerkToken(getToken);

    const { data, error, count } = await client
      .from('property_transactions')
      .select('*, property:property_id(title)', { count: 'exact' })
      .range(startRow, startRow + pageSize - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      transactions: data,
      total: count || 0
    };
  } catch (error) {
    return handleSupabaseError(error, 'fetchTransactions');
  }
};

/**
 * Hook for real-time transaction updates with Clerk authentication
 */
export const useRealtimeTransactions = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  useEffect(() => {
    // Helper to setup subscription with Clerk token
    const setupSubscription = async () => {
      // Get Supabase client with Clerk token
      await getSupabaseWithClerkToken(getToken);

      // Subscribe to changes in property_transactions table
      const channel = supabase
        .channel('public:property_transactions')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'property_transactions' },
          (payload) => {
            console.log('Realtime transaction update:', payload);
            // Invalidate all transaction queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['clerk-transactions'] });
          }
        )
        .subscribe();

      // Return cleanup function
      return () => {
        supabase.removeChannel(channel);
      };
    };

    // Set up subscription
    const cleanup = setupSubscription();

    // Cleanup subscription on unmount
    return () => {
      cleanup.then(cleanupFn => cleanupFn());
    };
  }, [queryClient, getToken]);
};

/**
 * Basic transaction fetching hook with Clerk authentication
 */
export const useClerkTransactions = (page: number = 1, pageSize: number = 10) => {
  const { getToken } = useAuth();

  // Set up real-time subscription
  useRealtimeTransactions();

  return useQuery({
    queryKey: ['clerk-transactions', page, pageSize],
    queryFn: () => fetchTransactions(getToken, page, pageSize)
  });
};

/**
 * Create transaction mutation with Clerk authentication
 */
export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  return useMutation({
    mutationFn: async (transactionData: any) => {
      try {
        // Get Supabase client with Clerk token
        const client = await getSupabaseWithClerkToken(getToken);

        const { data, error } = await client
          .from('property_transactions')
          .insert({
            // Map the form data to database fields
            transaction_date: transactionData.transactionDate,
            property_id: transactionData.propertyId,
            transaction_value: transactionData.transactionValue,
            commission_rate: transactionData.commissionRate,
            commission_amount: transactionData.commissionAmount,
            agent_id: userId, // This will be cast to UUID in the database
            clerk_id: userId, // Keep clerk_id as TEXT for direct comparison
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
          throw error;
        }

        return data;
      } catch (error) {
        return handleSupabaseError(error, 'createTransaction');
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['clerk-transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    }
  });
};