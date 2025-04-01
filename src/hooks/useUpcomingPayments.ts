
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CommissionInstallment } from '@/types/commission';

export function useUpcomingPayments(agentId?: string, limit = 10) {
  return useQuery({
    queryKey: ['upcoming-payments', agentId, limit],
    queryFn: async () => {
      // Use the current user's ID if no agent ID is provided
      const user = agentId || (await supabase.auth.getSession()).data.session?.user?.id;
      
      if (!user) {
        throw new Error('No user ID available');
      }
      
      const { data, error } = await supabase
        .from('commission_installments')
        .select(`
          *,
          transaction:property_transactions (
            id,
            property:property_id (
              id,
              title
            )
          )
        `)
        .eq('agent_id', user)
        .eq('status', 'Pending')
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        transactionId: item.transaction_id,
        installmentNumber: item.installment_number,
        agentId: item.agent_id,
        amount: item.amount,
        percentage: item.percentage,
        scheduledDate: item.scheduled_date,
        status: item.status,
        actualPaymentDate: item.actual_payment_date,
        notes: item.notes,
        transaction: item.transaction
      })) as (CommissionInstallment & {
        transaction?: {
          id: string;
          property?: {
            id: string;
            title: string;
          }
        }
      })[];
    }
  });
}
