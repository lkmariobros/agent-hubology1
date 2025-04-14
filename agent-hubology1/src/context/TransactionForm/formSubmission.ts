
import { TransactionFormState } from './types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Function to save form as draft
export const saveFormAsDraft = async (state: TransactionFormState): Promise<void> => {
  console.log('Saving form as draft:', state);
  
  try {
    // Save to localStorage for recovery purposes
    localStorage.setItem('transactionFormDraft', JSON.stringify({
      formData: state.formData,
      documents: state.documents
    }));
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('property_transactions')
      .insert({
        status: 'Draft',
        transaction_date: state.formData.transactionDate,
        property_id: state.formData.propertyId,
        transaction_value: state.formData.transactionValue,
        commission_rate: state.formData.commissionRate,
        commission_amount: state.formData.commissionAmount,
        agent_id: supabase.auth.getUser().then(res => res.data.user?.id) || null,
        notes: state.formData.notes,
        buyer_name: state.formData.buyer?.name,
        buyer_email: state.formData.buyer?.email,
        buyer_phone: state.formData.buyer?.phone,
        seller_name: state.formData.seller?.name,
        seller_email: state.formData.seller?.email,
        seller_phone: state.formData.seller?.phone,
        closing_date: state.formData.closingDate,
        payment_schedule_id: state.formData.paymentScheduleId
      });
      
    if (error) {
      console.error('Error saving draft to database:', error);
      toast.error('Failed to save draft to server');
      return Promise.resolve(); // We still consider local storage save a success
    }
    
    toast.success('Draft saved successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error in saveFormAsDraft:', error);
    return Promise.resolve(); // Consider local storage as backup
  }
};

// Function to submit the complete form
export const submitTransactionForm = async (state: TransactionFormState): Promise<any> => {
  console.log('Submitting transaction form:', state);
  
  try {
    // Validate required fields
    const validationErrors: string[] = [];
    
    if (!state.formData.transactionDate) {
      validationErrors.push('Transaction date is required');
    }
    
    if (!state.formData.propertyId) {
      validationErrors.push('Property is required');
    }
    
    if (!state.formData.transactionValue || state.formData.transactionValue <= 0) {
      validationErrors.push('Transaction value must be greater than 0');
    }
    
    if (!state.formData.commissionRate || state.formData.commissionRate <= 0) {
      validationErrors.push('Commission rate must be greater than 0');
    }
    
    if (!state.formData.commissionAmount || state.formData.commissionAmount <= 0) {
      validationErrors.push('Commission amount must be greater than 0');
    }
    
    // Check payment schedule with detailed error message
    if (!state.formData.paymentScheduleId) {
      validationErrors.push('Payment schedule is required');
      console.error('Payment schedule missing. Current form data:', {
        paymentScheduleId: state.formData.paymentScheduleId,
        formData: state.formData
      });
    }
    
    if (validationErrors.length > 0) {
      const errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
      console.error(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Authentication error:', userError);
      throw new Error('Authentication failed: ' + userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Prepare transaction data
    const transactionData = {
      status: 'Pending',
      transaction_date: state.formData.transactionDate,
      property_id: state.formData.propertyId,
      transaction_value: state.formData.transactionValue,
      commission_rate: state.formData.commissionRate,
      commission_amount: state.formData.commissionAmount,
      agent_id: userId,
      notes: state.formData.notes,
      buyer_name: state.formData.buyer?.name,
      buyer_email: state.formData.buyer?.email,
      buyer_phone: state.formData.buyer?.phone,
      seller_name: state.formData.seller?.name,
      seller_email: state.formData.seller?.email,
      seller_phone: state.formData.seller?.phone,
      closing_date: state.formData.closingDate,
      commission_split: state.formData.coBroking?.enabled || false,
      co_agent_id: state.formData.coBroking?.enabled ? 
        state.formData.coBroking.agentName : null,
      co_agent_commission_percentage: state.formData.coBroking?.enabled ? 
        state.formData.coBroking.commissionSplit : null,
      payment_schedule_id: state.formData.paymentScheduleId
    };
    
    console.log('Transaction data to insert:', transactionData);
    
    // Insert transaction
    const { data, error } = await supabase
      .from('property_transactions')
      .insert(transactionData)
      .select('id, status, transaction_date, transaction_value, commission_amount')
      .single();
      
    if (error) {
      console.error('Error submitting transaction:', error);
      throw new Error('Failed to submit transaction: ' + error.message);
    }
    
    console.log('Transaction created successfully:', data);
    
    // Upload documents if they exist
    if (state.documents.length > 0) {
      const documentPromises = state.documents.map(async (doc) => {
        if (doc.file) {
          try {
            // Upload file to storage
            const fileName = `${Date.now()}_${doc.file.name}`;
            const filePath = `transactions/${data.id}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('transaction_documents')
              .upload(filePath, doc.file);
              
            if (uploadError) {
              console.error('Error uploading document:', uploadError);
              return null;
            }
            
            // Add record to transaction_documents table
            const { error: docError } = await supabase.from('transaction_documents').insert({
              transaction_id: data.id,
              name: doc.name,
              document_type: doc.documentType,
              storage_path: filePath
            });
            
            if (docError) {
              console.error('Error saving document metadata:', docError);
              return null;
            }
            
            return filePath;
          } catch (err) {
            console.error('Error processing document:', err);
            return null;
          }
        }
        return null;
      });
      
      // Wait for all document uploads to complete
      await Promise.all(documentPromises);
    }
    
    toast.success('Transaction submitted successfully');
    
    // The real-time subscription will handle updates to the UI
    // but we'll invalidate these queries explicitly to ensure immediate updates
    if (window.queryClient) {
      window.queryClient.invalidateQueries({ queryKey: ['agentCommission'] });
      window.queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
    
    return data; // Return the created transaction
  } catch (error) {
    console.error('Error in submitTransactionForm:', error);
    toast.error(error instanceof Error 
      ? `Failed to submit transaction: ${error.message}` 
      : 'Failed to submit transaction'
    );
    return Promise.reject(error);
  }
};
