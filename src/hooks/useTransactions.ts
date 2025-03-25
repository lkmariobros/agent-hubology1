
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionFormData, TransactionDocument } from '@/types';
import { toast } from 'sonner';

interface TransactionsQueryParams {
  status?: string;
  agentId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  limit?: number;
  page?: number;
}

export const useTransactions = () => {
  const queryClient = useQueryClient();

  // Fetch transactions with filters
  const getTransactions = async (params: TransactionsQueryParams = {}) => {
    console.log('Fetching transactions with params:', params);
    
    let query = supabase
      .from('property_transactions')
      .select(`
        *,
        property:property_id (
          id,
          title,
          description,
          price,
          built_up_area,
          street,
          city,
          state,
          zip,
          country
        ),
        agent:agent_id (
          id,
          name:id,
          email:id
        ),
        transaction_type:transaction_type_id (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status);
    }
    
    if (params.agentId) {
      query = query.eq('agent_id', params.agentId);
    }
    
    if (params.startDate) {
      query = query.gte('transaction_date', params.startDate.toISOString().split('T')[0]);
    }
    
    if (params.endDate) {
      query = query.lte('transaction_date', params.endDate.toISOString().split('T')[0]);
    }
    
    if (params.search) {
      query = query.or(`
        buyer_name.ilike.%${params.search}%,
        seller_name.ilike.%${params.search}%,
        notes.ilike.%${params.search}%
      `);
    }
    
    // Apply pagination
    const limit = params.limit || 10;
    const page = params.page || 0;
    const from = page * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return {
      transactions: data.map(mapTransactionData),
      total: count || 0
    };
  };

  // Get a single transaction by ID
  const getTransactionById = async (id: string) => {
    const { data, error } = await supabase
      .from('property_transactions')
      .select(`
        *,
        property:property_id (
          id,
          title,
          description,
          price,
          built_up_area,
          street,
          city,
          state,
          zip,
          country
        ),
        agent:agent_id (
          id,
          name:id,
          email:id
        ),
        transaction_type:transaction_type_id (
          id,
          name
        ),
        documents:transaction_documents (
          id,
          name,
          document_type,
          storage_path,
          created_at
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
    
    return mapTransactionData(data);
  };

  // Create a new transaction
  const createTransaction = async (formData: TransactionFormData, documents: TransactionDocument[] = []) => {
    // Start a transaction to ensure both transaction and documents are saved
    try {
      // 1. Insert the transaction
      const { data, error } = await supabase
        .from('property_transactions')
        .insert({
          transaction_type_id: formData.transactionType === 'Primary' ? 
            (await getTransactionTypeId('Primary')) : 
            (formData.transactionType === 'Rent' ? 
              (await getTransactionTypeId('Rent')) : 
              (await getTransactionTypeId('Sale'))),
          property_id: formData.propertyId,
          transaction_date: new Date(formData.transactionDate).toISOString().split('T')[0],
          closing_date: formData.closingDate ? new Date(formData.closingDate).toISOString().split('T')[0] : null,
          status: formData.status,
          transaction_value: formData.transactionValue,
          commission_rate: formData.commissionRate,
          commission_amount: formData.commissionAmount,
          commission_split: formData.coBroking?.enabled || false,
          co_agent_id: formData.coBroking?.enabled ? null : null, // Would store the co-agent ID if available
          co_agent_commission_percentage: formData.coBroking?.enabled ? formData.coBroking.commissionSplit : null,
          agent_id: '00000000-0000-0000-0000-000000000000', // This should be the current user's ID in a real app
          buyer_name: formData.buyer?.name || null,
          buyer_email: formData.buyer?.email || null,
          buyer_phone: formData.buyer?.phone || null,
          seller_name: formData.seller?.name || null,
          seller_email: formData.seller?.email || null,
          seller_phone: formData.seller?.phone || null,
          notes: formData.notes || ''
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      const transactionId = data.id;

      // 2. Upload and save documents if any
      if (documents.length > 0) {
        await Promise.all(documents.map(async (doc) => {
          if (doc.file) {
            // Upload file to storage
            const filePath = `transaction_documents/${transactionId}/${Date.now()}_${doc.file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('transaction-documents')
              .upload(filePath, doc.file);

            if (uploadError) {
              console.error('Error uploading document:', uploadError);
              throw uploadError;
            }

            // Save document reference in database
            const { error: docError } = await supabase
              .from('transaction_documents')
              .insert({
                transaction_id: transactionId,
                name: doc.name,
                document_type: doc.documentType,
                storage_path: filePath
              });

            if (docError) {
              console.error('Error saving document reference:', docError);
              throw docError;
            }
          }
        }));
      }

      return transactionId;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id: string, formData: Partial<TransactionFormData>, documents: TransactionDocument[] = []) => {
    try {
      // 1. Update the transaction
      const { error } = await supabase
        .from('property_transactions')
        .update({
          transaction_type_id: formData.transactionType ? 
            (formData.transactionType === 'Primary' ? 
              (await getTransactionTypeId('Primary')) : 
              (formData.transactionType === 'Rent' ? 
                (await getTransactionTypeId('Rent')) : 
                (await getTransactionTypeId('Sale')))) : undefined,
          property_id: formData.propertyId,
          transaction_date: formData.transactionDate ? new Date(formData.transactionDate).toISOString().split('T')[0] : undefined,
          closing_date: formData.closingDate ? new Date(formData.closingDate).toISOString().split('T')[0] : null,
          status: formData.status,
          transaction_value: formData.transactionValue,
          commission_rate: formData.commissionRate,
          commission_amount: formData.commissionAmount,
          commission_split: formData.coBroking?.enabled !== undefined ? formData.coBroking.enabled : undefined,
          co_agent_commission_percentage: formData.coBroking?.enabled && formData.coBroking.commissionSplit ? 
            formData.coBroking.commissionSplit : null,
          buyer_name: formData.buyer?.name,
          buyer_email: formData.buyer?.email,
          buyer_phone: formData.buyer?.phone,
          seller_name: formData.seller?.name,
          seller_email: formData.seller?.email,
          seller_phone: formData.seller?.phone,
          notes: formData.notes
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // 2. Upload and save new documents if any
      if (documents.length > 0) {
        await Promise.all(documents.map(async (doc) => {
          if (doc.file) {
            // Upload file to storage
            const filePath = `transaction_documents/${id}/${Date.now()}_${doc.file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('transaction-documents')
              .upload(filePath, doc.file);

            if (uploadError) {
              console.error('Error uploading document:', uploadError);
              throw uploadError;
            }

            // Save document reference in database
            const { error: docError } = await supabase
              .from('transaction_documents')
              .insert({
                transaction_id: id,
                name: doc.name,
                document_type: doc.documentType,
                storage_path: filePath
              });

            if (docError) {
              console.error('Error saving document reference:', docError);
              throw docError;
            }
          }
        }));
      }

      return id;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      // Delete the transaction (related documents will be cascaded)
      const { error } = await supabase
        .from('property_transactions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  // Helper function to get transaction type ID
  const getTransactionTypeId = async (typeName: string): Promise<string> => {
    const { data, error } = await supabase
      .from('transaction_types')
      .select('id')
      .eq('name', typeName)
      .single();

    if (error) {
      console.error(`Error getting transaction type ID for ${typeName}:`, error);
      throw error;
    }

    return data.id;
  };

  // Helper function to map database transaction to frontend model
  const mapTransactionData = (transaction: any): Transaction => {
    const propertyTitle = transaction.property?.title || `Property ID: ${transaction.property_id}`;
    const propertyAddress = transaction.property ? {
      city: transaction.property.city || '',
      state: transaction.property.state || ''
    } : { city: '', state: '' };

    return {
      id: transaction.id,
      propertyId: transaction.property_id,
      property: {
        title: propertyTitle,
        address: propertyAddress
      },
      agentId: transaction.agent_id,
      agent: {
        name: transaction.agent?.name || 'Unknown Agent',
        email: transaction.agent?.email || ''
      },
      buyerId: transaction.buyer_id,
      buyer: {
        name: transaction.buyer_name || ''
      },
      sellerId: transaction.seller_id,
      seller: {
        name: transaction.seller_name || ''
      },
      price: transaction.transaction_value,
      commission: transaction.commission_amount,
      status: transaction.status.toLowerCase(),
      date: transaction.transaction_date,
      type: transaction.transaction_type?.name?.toLowerCase() === 'primary' ? 'developer' : 'individual',
      documents: transaction.documents ? transaction.documents.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        url: doc.storage_path
      })) : [],
      notes: transaction.notes
    };
  };

  // React Query hooks
  const useTransactionsQuery = (params: TransactionsQueryParams = {}) => {
    return useQuery({
      queryKey: ['transactions', params],
      queryFn: () => getTransactions(params)
    });
  };

  const useTransactionQuery = (id: string) => {
    return useQuery({
      queryKey: ['transaction', id],
      queryFn: () => getTransactionById(id),
      enabled: !!id
    });
  };

  const useCreateTransactionMutation = () => {
    return useMutation({
      mutationFn: ({ formData, documents }: { formData: TransactionFormData, documents: TransactionDocument[] }) => 
        createTransaction(formData, documents),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast.success('Transaction created successfully');
      },
      onError: (error) => {
        console.error('Error creating transaction:', error);
        toast.error('Failed to create transaction');
      }
    });
  };

  const useUpdateTransactionMutation = () => {
    return useMutation({
      mutationFn: ({ id, formData, documents }: { id: string, formData: Partial<TransactionFormData>, documents: TransactionDocument[] }) => 
        updateTransaction(id, formData, documents),
      onSuccess: (id) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['transaction', id] });
        toast.success('Transaction updated successfully');
      },
      onError: (error) => {
        console.error('Error updating transaction:', error);
        toast.error('Failed to update transaction');
      }
    });
  };

  const useDeleteTransactionMutation = () => {
    return useMutation({
      mutationFn: deleteTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast.success('Transaction deleted successfully');
      },
      onError: (error) => {
        console.error('Error deleting transaction:', error);
        toast.error('Failed to delete transaction');
      }
    });
  };

  return {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    useTransactionsQuery,
    useTransactionQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation
  };
};
