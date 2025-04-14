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
  userId: string | null | undefined,
  page: number = 1,
  pageSize: number = 10
) => {
  const startRow = (page - 1) * pageSize;

  try {
    console.log('Fetching transactions for user ID:', userId);

    if (!userId) {
      console.log('No user ID provided, returning empty result');
      return {
        transactions: [],
        total: 0
      };
    }

    // Get Supabase client with Clerk token
    const client = await getSupabaseWithClerkToken(getToken);

    // Use a simpler approach with a raw SQL query
    const { data, error, count } = await client
      .from('property_transactions')
      .select('*, property:property_id(title)', { count: 'exact' })
      .or(`clerk_id.eq.${userId},agent_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(startRow, startRow + pageSize - 1);

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} transactions for user ${userId}`);
    console.log('Transaction data:', data);

    return {
      transactions: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error in fetchTransactions:', error);
    return handleSupabaseError(error, 'fetchTransactions');
  }
};

/**
 * Hook for real-time transaction updates with Clerk authentication
 */
export const useRealtimeTransactions = () => {
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  useEffect(() => {
    // Don't set up subscription if we don't have a userId
    if (!userId) {
      console.log('No userId available, skipping realtime subscription');
      return;
    }

    console.log('Setting up realtime subscription for user:', userId);

    // Helper to setup subscription with Clerk token
    const setupSubscription = async () => {
      // Get Supabase client with Clerk token
      await getSupabaseWithClerkToken(getToken);

      // Subscribe to changes in property_transactions table
      // We'll listen to all changes and filter in the callback
      const channel = supabase
        .channel('public:property_transactions')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'property_transactions' },
          (payload) => {
            console.log('Realtime transaction update:', payload);

            // Get the transaction data from the payload
            const transaction = payload.new;

            // Check if this transaction belongs to the current user
            if (transaction && (transaction.clerk_id === userId || transaction.agent_id === userId)) {
              console.log('Transaction belongs to current user, invalidating queries');
              // Invalidate all transaction queries to trigger refetch
              queryClient.invalidateQueries({ queryKey: ['clerk-transactions'] });
            }
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
  }, [queryClient, getToken, userId]);
};

/**
 * Basic transaction fetching hook with Clerk authentication
 */
export const useClerkTransactions = (page: number = 1, pageSize: number = 10) => {
  const { getToken, userId } = useAuth();

  // Set up real-time subscription
  useRealtimeTransactions();

  return useQuery({
    queryKey: ['clerk-transactions', userId, page, pageSize],
    queryFn: () => fetchTransactions(getToken, userId, page, pageSize),
    enabled: !!userId // Only run the query if we have a userId
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
        if (!userId) {
          console.error('No user ID available for creating transaction');
          throw new Error('User not authenticated');
        }

        console.log('Creating transaction for user ID:', userId);
        console.log('Transaction data:', transactionData);

        // Get Supabase client with Clerk token
        const client = await getSupabaseWithClerkToken(getToken);

        // Prepare transaction data
        const transactionToInsert = {
          // Map the form data to database fields
          transaction_date: transactionData.transactionDate || new Date().toISOString().split('T')[0],
          property_id: transactionData.propertyId,
          transaction_value: transactionData.transactionValue || 100000,
          commission_rate: transactionData.commissionRate || 5,
          commission_amount: transactionData.commissionAmount || 5000,
          agent_id: userId,
          clerk_id: userId,
          status: 'Pending',
          notes: transactionData.notes || 'Test transaction',
          buyer_name: transactionData.buyer?.name || 'Test Buyer',
          buyer_email: transactionData.buyer?.email || 'buyer@test.com',
          buyer_phone: transactionData.buyer?.phone || '123-456-7890',
          seller_name: transactionData.seller?.name || 'Test Seller',
          seller_email: transactionData.seller?.email || 'seller@test.com',
          seller_phone: transactionData.seller?.phone || '123-456-7890',
          closing_date: transactionData.closingDate || new Date().toISOString().split('T')[0],
          co_agent_commission_percentage: transactionData.coAgentCommissionPercentage || 0
        };

        console.log('Transaction data to insert:', transactionToInsert);

        const { data, error } = await client
          .from('property_transactions')
          .insert(transactionToInsert)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Call the edge function to generate commission installments
        try {
          console.log('Calling edge function to generate installments for transaction:', data.id);
          const { data: installmentsData, error: installmentsError } = await client.functions.invoke(
            'generate_commission_installments',
            {
              body: { transactionId: data.id }
            }
          );

          if (installmentsError) {
            console.error('Error generating installments:', installmentsError);
            // Don't throw here, we still want to return the transaction data
          } else {
            console.log('Installments generated successfully:', installmentsData);
            // Update the transaction with installments_generated = true
            await client
              .from('property_transactions')
              .update({ installments_generated: true })
              .eq('id', data.id);
          }
        } catch (installmentsError) {
          console.error('Exception calling installments edge function:', installmentsError);
          // Don't throw here, we still want to return the transaction data
        }

        return data;
      } catch (error) {
        return handleSupabaseError(error, 'createTransaction');
      }
    },
    onSuccess: (data) => {
      console.log('Transaction created successfully:', data);
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['clerk-transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating transaction:', error);
      toast.error(`Failed to create transaction: ${error.message}`);
    }
  });
};