
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CommissionInstallment } from '@/types/commission';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to fetch upcoming commission payments for the current agent
 */
export const useUpcomingPayments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['upcomingPayments', user?.id],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('commission_installments')
        .select(`
          *,
          transaction:property_transactions (
            *,
            property:property_id (
              title
            )
          )
        `)
        .eq('agent_id', user.id)
        .in('status', ['Pending', 'Processing'])
        .order('scheduled_date', { ascending: true });
        
      if (error) {
        console.error('Error fetching upcoming payments:', error);
        throw new Error(error.message);
      }
      
      return data as CommissionInstallment[];
    },
    enabled: !!user,
  });
};

/**
 * Hook to fetch commission payment forecast grouped by month
 */
export const useCommissionForecast = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['commissionForecast', user?.id],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('commission_installments')
        .select(`
          *,
          transaction:property_transactions (
            *,
            property:property_id (
              title,
              address
            ),
            agent:agent_id (
              first_name,
              last_name
            )
          )
        `)
        .eq('agent_id', user.id)
        .in('status', ['Pending', 'Processing'])
        .order('scheduled_date', { ascending: true });
        
      if (error) {
        console.error('Error fetching commission forecast:', error);
        throw new Error(error.message);
      }
      
      return data as CommissionInstallment[];
    },
    enabled: !!user,
  });
};
