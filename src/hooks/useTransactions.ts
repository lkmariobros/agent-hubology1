
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Transaction, TransactionDocument } from '@/types';

export function useTransactions() {
  const queryClient = useQueryClient();

  const useTransactionsQuery = (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return useQuery({
      queryKey: ['transactions', params],
      queryFn: async () => {
        let query = supabase.from('property_transactions').select(`
          id,
          transaction_value,
          status,
          transaction_date,
          property_id,
          agent_id,
          commission_amount,
          closing_date,
          notes,
          property:property_id (
            id,
            title,
            city,
            state
          )
        `);

        if (params?.search) {
          query = query.or(`
            title.ilike.%${params.search}%,
            property.title.ilike.%${params.search}%
          `);
        }

        if (params?.status) {
          query = query.eq('status', params.status);
        }

        // Calculate pagination
        const page = params?.page || 0;
        const limit = params?.limit || 10;
        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
          .range(from, to)
          .order('transaction_date', { ascending: false })
          .returns<any[]>();

        if (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }

        // Map the Supabase data to our Transaction interface
        const transactions: Transaction[] = data.map(item => ({
          id: item.id,
          propertyId: item.property_id,
          agentId: item.agent_id,
          price: item.transaction_value || 0,
          commission: item.commission_amount || 0,
          status: item.status,
          date: item.transaction_date,
          notes: item.notes || '',
          closingDate: item.closing_date,
          property: item.property ? {
            title: item.property.title,
            address: {
              city: item.property.city,
              state: item.property.state
            }
          } : undefined,
          agent: {
            id: item.agent_id,
            name: 'Agent Name' // We need to fetch this from a join or separate query
          },
          buyer: {
            name: item.buyer_name || 'Unknown Buyer'
          },
          seller: {
            name: item.seller_name || 'Unknown Seller'
          }
        }));

        return {
          transactions,
          total: count || transactions.length
        };
      },
      placeholderData: (previousData) => previousData
    });
  };

  const useTransactionQuery = (id: string) => {
    return useQuery({
      queryKey: ['transaction', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('property_transactions')
          .select(`
            id,
            transaction_value,
            status,
            transaction_date,
            property_id,
            agent_id,
            commission_amount,
            commission_rate,
            closing_date,
            notes,
            buyer_name,
            buyer_email,
            buyer_phone,
            seller_name,
            seller_email,
            seller_phone,
            property:property_id (
              id,
              title,
              city,
              state
            ),
            transaction_documents (
              id,
              name,
              document_type,
              storage_path
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching transaction:', error);
          throw error;
        }

        // Map to our Transaction interface
        const transaction: Transaction = {
          id: data.id,
          propertyId: data.property_id,
          agentId: data.agent_id,
          price: data.transaction_value || 0,
          commission: data.commission_amount || 0,
          status: data.status,
          date: data.transaction_date,
          notes: data.notes || '',
          closingDate: data.closing_date,
          property: data.property ? {
            title: data.property.title,
            address: {
              city: data.property.city,
              state: data.property.state
            }
          } : undefined,
          agent: {
            id: data.agent_id,
            name: 'Agent Name' // We need to fetch this separately
          },
          buyer: {
            name: data.buyer_name || 'Unknown Buyer',
            email: data.buyer_email,
            phone: data.buyer_phone
          },
          seller: {
            name: data.seller_name || 'Unknown Seller',
            email: data.seller_email,
            phone: data.seller_phone
          },
          documents: data.transaction_documents?.map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            documentType: doc.document_type,
            url: doc.storage_path
          })) || []
        };

        return transaction;
      },
      enabled: !!id
    });
  };

  const useCreateTransactionMutation = () => {
    return useMutation({
      mutationFn: async ({ 
        formData, 
        documents 
      }: { 
        formData: any; 
        documents: TransactionDocument[] 
      }) => {
        console.log('Creating transaction with:', formData, documents);
        
        // First, insert the transaction
        const { data, error } = await supabase
          .from('property_transactions')
          .insert({
            transaction_value: formData.transactionValue,
            status: formData.status,
            property_id: formData.propertyId,
            agent_id: formData.agentId || '00000000-0000-0000-0000-000000000000', // Default agent ID
            commission_amount: formData.commissionAmount,
            commission_rate: formData.commissionRate,
            transaction_date: formData.transactionDate,
            closing_date: formData.closingDate,
            notes: formData.notes,
            buyer_name: formData.buyer?.name,
            buyer_email: formData.buyer?.email,
            buyer_phone: formData.buyer?.phone,
            seller_name: formData.seller?.name,
            seller_email: formData.seller?.email,
            seller_phone: formData.seller?.phone
          })
          .select();

        if (error) {
          console.error('Error creating transaction:', error);
          throw error;
        }

        const transactionId = data[0].id;

        // Handle document uploads if we have documents
        if (documents && documents.length > 0) {
          // Process document uploads
          console.log('Uploading documents:', documents);
          // In a real app, you would upload each document to storage and save metadata
        }

        return transactionId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    });
  };

  const useUpdateTransactionMutation = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
        const { data, error } = await supabase
          .from('property_transactions')
          .update(updates)
          .eq('id', id)
          .select();

        if (error) {
          console.error('Error updating transaction:', error);
          throw error;
        }

        return data[0];
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['transaction', data.id] });
      }
    });
  };

  const useDeleteTransactionMutation = () => {
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

        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    });
  };

  return {
    useTransactionsQuery,
    useTransactionQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation
  };
}
