
import { supabase } from '@/integrations/supabase/client';
import { TransactionFormState, TransactionDocument } from '@/types/transaction-form';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';

// Save form as draft
export const saveFormAsDraft = async (state: TransactionFormState): Promise<void> => {
  try {
    console.log('Saving transaction form as draft:', state);
    
    // Get the transaction type ID
    const { data: typeData, error: typeError } = await supabase
      .from('transaction_types')
      .select('id')
      .eq('name', state.formData.transactionType)
      .single();
    
    if (typeError) {
      console.error('Error getting transaction type:', typeError);
      throw typeError;
    }
    
    // Create or update the transaction
    const transactionData = {
      transaction_type_id: typeData.id,
      property_id: state.formData.propertyId,
      transaction_date: new Date(state.formData.transactionDate).toISOString().split('T')[0],
      closing_date: state.formData.closingDate ? new Date(state.formData.closingDate).toISOString().split('T')[0] : null,
      status: 'Draft',
      transaction_value: state.formData.transactionValue,
      commission_rate: state.formData.commissionRate,
      commission_amount: state.formData.commissionAmount,
      commission_split: state.formData.coBroking?.enabled || false,
      co_agent_commission_percentage: state.formData.coBroking?.enabled ? state.formData.coBroking.commissionSplit : null,
      agent_id: '00000000-0000-0000-0000-000000000000', // This should be the current user's ID in a real app
      buyer_name: state.formData.buyer?.name || null,
      buyer_email: state.formData.buyer?.email || null,
      buyer_phone: state.formData.buyer?.phone || null,
      seller_name: state.formData.seller?.name || null,
      seller_email: state.formData.seller?.email || null,
      seller_phone: state.formData.seller?.phone || null,
      notes: state.formData.notes || '',
      updated_at: new Date().toISOString() // Convert Date to ISO string for Supabase
    };
    
    let transactionId = state.formData.id;
    
    if (transactionId) {
      // Update existing transaction
      const { error } = await supabase
        .from('property_transactions')
        .update(transactionData)
        .eq('id', transactionId);
      
      if (error) throw error;
    } else {
      // Create new transaction
      const { data, error } = await supabase
        .from('property_transactions')
        .insert(transactionData)
        .select('id')
        .single();
      
      if (error) throw error;
      transactionId = data.id;
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving transaction form:', error);
    toast.error('Failed to save draft');
    return Promise.reject(error);
  }
};

// Upload document to storage
export const uploadDocument = async (document: TransactionDocument, transactionId: string): Promise<string> => {
  if (!document.file) {
    return document.url || '';
  }
  
  try {
    // Check if storage bucket exists, create it if not
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'transaction-documents');
    
    if (!bucketExists) {
      await supabase.storage.createBucket('transaction-documents', {
        public: false
      });
    }
    
    // Generate a unique file path
    const filePath = `transaction_documents/${transactionId}/${Date.now()}_${document.file.name}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('transaction-documents')
      .upload(filePath, document.file);
    
    if (error) throw error;
    
    // Save document reference in database
    const { error: docError } = await supabase
      .from('transaction_documents')
      .insert({
        transaction_id: transactionId,
        name: document.name,
        document_type: document.documentType,
        storage_path: filePath
      });
    
    if (docError) throw docError;
    
    return filePath;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Submit complete transaction form
export const submitTransactionForm = async (state: TransactionFormState): Promise<void> => {
  try {
    console.log('Submitting transaction form:', state);
    
    // Get the transaction type ID
    const { data: typeData, error: typeError } = await supabase
      .from('transaction_types')
      .select('id')
      .eq('name', state.formData.transactionType)
      .single();
    
    if (typeError) {
      console.error('Error getting transaction type:', typeError);
      throw typeError;
    }
    
    // Create or update the transaction
    const transactionData = {
      transaction_type_id: typeData.id,
      property_id: state.formData.propertyId,
      transaction_date: new Date(state.formData.transactionDate).toISOString().split('T')[0],
      closing_date: state.formData.closingDate ? new Date(state.formData.closingDate).toISOString().split('T')[0] : null,
      status: state.formData.status,
      transaction_value: state.formData.transactionValue,
      commission_rate: state.formData.commissionRate,
      commission_amount: state.formData.commissionAmount,
      commission_split: state.formData.coBroking?.enabled || false,
      co_agent_commission_percentage: state.formData.coBroking?.enabled ? state.formData.coBroking.commissionSplit : null,
      agent_id: '00000000-0000-0000-0000-000000000000', // This should be the current user's ID in a real app
      buyer_name: state.formData.buyer?.name || null,
      buyer_email: state.formData.buyer?.email || null,
      buyer_phone: state.formData.buyer?.phone || null,
      seller_name: state.formData.seller?.name || null,
      seller_email: state.formData.seller?.email || null,
      seller_phone: state.formData.seller?.phone || null,
      notes: state.formData.notes || '',
      updated_at: new Date().toISOString() // Convert Date to ISO string for Supabase
    };
    
    let transactionId = state.formData.id;
    
    if (transactionId) {
      // Update existing transaction
      const { error } = await supabase
        .from('property_transactions')
        .update(transactionData)
        .eq('id', transactionId);
      
      if (error) throw error;
    } else {
      // Create new transaction
      const { data, error } = await supabase
        .from('property_transactions')
        .insert(transactionData)
        .select('id')
        .single();
      
      if (error) throw error;
      transactionId = data.id;
    }
    
    // Upload documents
    await Promise.all(state.documents.map(async (document) => {
      if (document.file) {
        await uploadDocument(document, transactionId!);
      }
    }));
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error submitting transaction form:', error);
    toast.error('Failed to submit transaction');
    return Promise.reject(error);
  }
};
