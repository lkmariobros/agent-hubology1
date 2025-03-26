import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionFormValues } from '@/types';
import { toast } from 'sonner';

// Get all transactions
export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*');

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      return data;
    },
  });
}

// Get a single transaction by ID
export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching transaction:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
}

// Create a new transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionFormValues) => {
      const { error } = await supabase
        .from('transactions')
        .insert({
          propertyId: transaction.propertyId,
          buyerName: transaction.buyerName,
          buyerEmail: transaction.buyerEmail,
          buyerPhone: transaction.buyerPhone,
          sellerName: transaction.sellerName,
          sellerEmail: transaction.sellerEmail,
          sellerPhone: transaction.sellerPhone,
          date: transaction.transactionDate.toISOString(),
          closingDate: transaction.closingDate ? transaction.closingDate.toISOString() : null,
          price: transaction.transactionValue,
          commissionRate: transaction.commissionRate,
          commission: transaction.commissionAmount,
          notes: transaction.notes,
          status: transaction.status,
          commissionSplit: transaction.commissionSplit,
          coAgentId: transaction.coAgentId,
          coAgentCommissionPercentage: transaction.coAgentCommissionPercentage,
        });

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    },
  });
}

// Update an existing transaction
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TransactionFormValues> }) => {
      const { error } = await supabase
        .from('transactions')
        .update({
          propertyId: data.propertyId,
          buyerName: data.buyerName,
          buyerEmail: data.buyerEmail,
          buyerPhone: data.buyerPhone,
          sellerName: data.sellerName,
          sellerEmail: data.sellerEmail,
          sellerPhone: data.sellerPhone,
          date: data.transactionDate instanceof Date ? data.transactionDate.toISOString() : data.transactionDate,
          closingDate: data.closingDate instanceof Date ? data.closingDate.toISOString() : data.closingDate,
          price: data.transactionValue,
          commissionRate: data.commissionRate,
          commission: data.commissionAmount,
          notes: data.notes,
          status: data.status,
          commissionSplit: data.commissionSplit,
          coAgentId: data.coAgentId,
          coAgentCommissionPercentage: data.coAgentCommissionPercentage,
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
      queryClient.invalidateQueries({ queryKey: ['transactions', variables.id] });
      toast.success('Transaction updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });
}

// Delete a transaction
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
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
    onError: (error: Error) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    },
  });
}
