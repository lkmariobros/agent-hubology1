import { useQuery } from '@tanstack/react-query';
import { getSupabaseWithClerkToken } from '@/utils/supabaseHelpers';
import { useAuth } from '@clerk/clerk-react';

interface CommissionInstallment {
  id: string;
  installment_number: number;
  amount: number;
  percentage: number;
  scheduled_date: string;
  status: string;
  actual_payment_date?: string;
  notes?: string;
}

/**
 * Hook to fetch commission installments for a transaction
 */
export const useCommissionInstallments = (transactionId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['commission-installments', transactionId],
    queryFn: async () => {
      try {
        // Get Supabase client with Clerk token
        const client = await getSupabaseWithClerkToken(getToken);

        const { data, error } = await client
          .from('commission_installments')
          .select('*')
          .eq('transaction_id', transactionId)
          .order('installment_number', { ascending: true });

        if (error) {
          throw error;
        }

        return data as CommissionInstallment[];
      } catch (error: any) {
        console.error('Error fetching commission installments:', error);
        return [];
      }
    },
    enabled: !!transactionId,
  });
};

export default useCommissionInstallments;
