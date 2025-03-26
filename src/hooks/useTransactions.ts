
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionFormValues } from '@/types';
import { toast } from 'sonner';

// Get all transactions with pagination, filtering, and sorting
export function useTransactions() {
  // Main query function for transactions with parameters
  const getTransactions = async ({ 
    page = 0, 
    limit = 10, 
    search = '', 
    filters = {} 
  } = {}) => {
    let query = supabase
      .from('property_transactions')
      .select(`
        *,
        property:property_id (
          title,
          address:street,
          city,
          state
        ),
        agent:agent_id (
          id,
          name:full_name
        )
      `);

    // Apply search filter if present
    if (search) {
      query = query.or(`
        buyer_name.ilike.%${search}%,
        seller_name.ilike.%${search}%,
        notes.ilike.%${search}%
      `);
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value);
      }
    });

    // Apply pagination
    const from = page * limit;
    const to = from + limit - 1;
    
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('property_transactions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting transactions:', countError);
      throw countError;
    }

    // Get paginated data
    const { data, error } = await query
      .order('transaction_date', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    // Map the data to our Transaction type
    const transactions = data.map(item => ({
      id: item.id,
      propertyId: item.property_id,
      agentId: item.agent_id,
      price: item.transaction_value,
      commission: item.commission_amount,
      status: item.status || 'pending',
      date: item.transaction_date,
      notes: item.notes,
      closingDate: item.closing_date,
      property: item.property ? {
        title: item.property.title,
        address: {
          city: item.property.city,
          state: item.property.state
        }
      } : undefined,
      agent: item.agent ? {
        id: item.agent.id || '',
        name: item.agent.name || ''
      } : undefined,
      buyer: {
        name: item.buyer_name,
        email: item.buyer_email,
        phone: item.buyer_phone
      },
      seller: {
        name: item.seller_name,
        email: item.seller_email,
        phone: item.seller_phone
      }
    }));

    return {
      transactions,
      total: count || 0,
      page,
      limit
    };
  };

  // Create a query hook that components can use
  const useTransactionsQuery = (params = {}) => {
    return useQuery({
      queryKey: ['transactions', params],
      queryFn: () => getTransactions(params),
    });
  };

  // Get a single transaction by ID
  const getTransaction = async (id: string) => {
    const { data, error } = await supabase
      .from('property_transactions')
      .select(`
        *,
        property:property_id (
          title,
          address:street,
          city,
          state
        ),
        agent:agent_id (
          id,
          name:full_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }

    // Map the data to our Transaction type
    return {
      id: data.id,
      propertyId: data.property_id,
      agentId: data.agent_id,
      price: data.transaction_value,
      commission: data.commission_amount,
      status: data.status || 'pending',
      date: data.transaction_date,
      notes: data.notes,
      closingDate: data.closing_date,
      property: data.property ? {
        title: data.property.title,
        address: {
          city: data.property.city,
          state: data.property.state
        }
      } : undefined,
      agent: data.agent ? {
        id: data.agent.id || '',
        name: data.agent.name || ''
      } : undefined,
      buyer: {
        name: data.buyer_name,
        email: data.buyer_email,
        phone: data.buyer_phone
      },
      seller: {
        name: data.seller_name,
        email: data.seller_email,
        phone: data.seller_phone
      },
      documents: [] // Add empty documents array to match the type
    };
  };

  // Create a mutation for creating transactions
  const useCreateTransactionMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (transaction: { formData: any, documents: any[] }) => {
        const { formData, documents } = transaction;
        
        // Insert transaction data
        const { data, error } = await supabase
          .from('property_transactions')
          .insert({
            property_id: formData.propertyId,
            agent_id: formData.agentId,
            buyer_name: formData.buyerName,
            buyer_email: formData.buyerEmail,
            buyer_phone: formData.buyerPhone,
            seller_name: formData.sellerName,
            seller_email: formData.sellerEmail,
            seller_phone: formData.sellerPhone,
            transaction_date: formData.transactionDate instanceof Date ? formData.transactionDate.toISOString() : formData.transactionDate,
            closing_date: formData.closingDate instanceof Date ? formData.closingDate.toISOString() : formData.closingDate,
            transaction_value: formData.transactionValue,
            commission_rate: formData.commissionRate,
            commission_amount: formData.commissionAmount,
            notes: formData.notes,
            status: formData.status,
            commission_split: formData.commissionSplit,
            co_agent_id: formData.coAgentId,
            co_agent_commission_percentage: formData.coAgentCommissionPercentage,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating transaction:', error);
          throw error;
        }

        // TODO: Handle document uploads if needed

        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast.success('Transaction created successfully');
      },
      onError: (error) => {
        console.error('Transaction creation error:', error);
        toast.error(`Failed to create transaction: ${error.message}`);
      }
    });
  };

  // Create a mutation for updating transactions
  const useUpdateTransactionMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, data }: { id: string, data: any }) => {
        const { error } = await supabase
          .from('property_transactions')
          .update({
            property_id: data.propertyId,
            buyer_name: data.buyerName,
            buyer_email: data.buyerEmail,
            buyer_phone: data.buyerPhone,
            seller_name: data.sellerName,
            seller_email: data.sellerEmail,
            seller_phone: data.sellerPhone,
            transaction_date: data.transactionDate instanceof Date ? data.transactionDate.toISOString() : data.transactionDate,
            closing_date: data.closingDate instanceof Date ? data.closingDate.toISOString() : data.closingDate,
            transaction_value: data.transactionValue,
            commission_rate: data.commissionRate,
            commission_amount: data.commissionAmount,
            notes: data.notes,
            status: data.status,
            commission_split: data.commissionSplit,
            co_agent_id: data.coAgentId,
            co_agent_commission_percentage: data.coAgentCommissionPercentage,
          })
          .eq('id', id);

        if (error) {
          console.error('Error updating transaction:', error);
          throw error;
        }

        return { success: true };
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
        toast.success('Transaction updated successfully');
      },
      onError: (error) => {
        toast.error(`Failed to update transaction: ${error.message}`);
      },
    });
  };

  // Create a mutation for deleting transactions
  const useDeleteTransactionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from('property_transactions')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting transaction:', error);
          throw error;
        }

        return { success: true };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast.success('Transaction deleted successfully');
      },
      onError: (error) => {
        toast.error(`Failed to delete transaction: ${error.message}`);
      },
    });
  };

  return {
    useTransaction: (id: string) => useQuery({
      queryKey: ['transaction', id],
      queryFn: () => getTransaction(id),
      enabled: !!id,
    }),
    useTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation
  };
}
