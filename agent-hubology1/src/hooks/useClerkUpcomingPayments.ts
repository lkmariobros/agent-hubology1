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
  transaction_id: string;
}

/**
 * Hook to fetch upcoming commission payments for the current agent using Clerk authentication
 */
export const useClerkUpcomingPayments = () => {
  const { getToken, userId } = useAuth();

  return useQuery({
    queryKey: ['upcomingPayments', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      
      try {
        // Get Supabase client with Clerk token
        const client = await getSupabaseWithClerkToken(getToken);
        
        const { data, error } = await client
          .from('commission_installments')
          .select(`
            *,
            transaction:transaction_id (
              *,
              property:property_id (
                title
              )
            )
          `)
          .eq('agent_id', userId)
          .in('status', ['Pending', 'Processing'])
          .order('scheduled_date', { ascending: true });
          
        if (error) {
          console.error('Error fetching upcoming payments:', error);
          return [];
        }
        
        return data as CommissionInstallment[];
      } catch (error: any) {
        console.error('Error in useClerkUpcomingPayments:', error);
        return [];
      }
    },
    enabled: !!userId,
  });
};

export default useClerkUpcomingPayments;
