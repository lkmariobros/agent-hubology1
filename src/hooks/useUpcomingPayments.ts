
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CommissionInstallment } from '@/types/commission';
import { useAuth } from './useAuth';

export function useUpcomingPayments(limit: number = 5) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['upcomingPayments', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('commission_installments')
        .select(`
          *,
          transaction:property_transactions (
            property:property_id (title)
          )
        `)
        .eq('agent_id', user.id)
        .eq('status', 'Pending')
        .order('scheduled_date')
        .limit(limit);
        
      if (error) throw error;
      
      return data as CommissionInstallment[];
    },
    enabled: !!user?.id
  });
}

export function useCommissionForecast() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['commissionForecast', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('commission_installments')
        .select(`
          *,
          transaction:property_transactions (
            property:property_id (title)
          )
        `)
        .eq('agent_id', user.id)
        .in('status', ['Pending', 'Processing'])
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .order('scheduled_date');
        
      if (error) throw error;
      
      return data as CommissionInstallment[];
    },
    enabled: !!user?.id
  });
}
