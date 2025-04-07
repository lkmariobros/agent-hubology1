
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

// Hook to get the current agent's total commission amount
export const useAgentCommission = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['agentCommission', user?.id],
    queryFn: async () => {
      if (!user?.id) return { total: 0, change: 0 };
      
      // Get total commission for current agent
      const { data: totalData, error: totalError } = await supabase
        .from('property_transactions')
        .select('commission_amount')
        .eq('agent_id', user.id);
      
      if (totalError) {
        console.error('Error fetching total commission:', totalError);
        throw totalError;
      }
      
      // Calculate total commission
      const totalCommission = totalData.reduce((sum, transaction) => 
        sum + (parseFloat(transaction.commission_amount) || 0), 0);
      
      // Get last month's total for comparison
      const lastMonthStart = new Date();
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      lastMonthStart.setDate(1);
      
      const lastMonthEnd = new Date();
      lastMonthEnd.setDate(0); // Last day of previous month
      
      const { data: lastMonthData, error: lastMonthError } = await supabase
        .from('property_transactions')
        .select('commission_amount')
        .eq('agent_id', user.id)
        .gte('transaction_date', lastMonthStart.toISOString().split('T')[0])
        .lte('transaction_date', lastMonthEnd.toISOString().split('T')[0]);
      
      if (lastMonthError) {
        console.error('Error fetching last month commission:', lastMonthError);
        return { total: totalCommission, change: 0 };
      }
      
      // Calculate last month's commission
      const lastMonthCommission = lastMonthData.reduce((sum, transaction) => 
        sum + (parseFloat(transaction.commission_amount) || 0), 0);
      
      // Calculate percent change (if previous month had transactions)
      const previousMonthStart = new Date(lastMonthStart);
      previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
      
      const previousMonthEnd = new Date(lastMonthStart);
      previousMonthEnd.setDate(0); // Last day of previous month
      
      const { data: previousMonthData, error: previousMonthError } = await supabase
        .from('property_transactions')
        .select('commission_amount')
        .eq('agent_id', user.id)
        .gte('transaction_date', previousMonthStart.toISOString().split('T')[0])
        .lte('transaction_date', previousMonthEnd.toISOString().split('T')[0]);
      
      if (previousMonthError) {
        console.error('Error fetching previous month commission:', previousMonthError);
        return { total: totalCommission, change: 0 };
      }
      
      const previousMonthCommission = previousMonthData.reduce((sum, transaction) => 
        sum + (parseFloat(transaction.commission_amount) || 0), 0);
      
      let percentChange = 0;
      if (previousMonthCommission > 0) {
        percentChange = ((lastMonthCommission - previousMonthCommission) / previousMonthCommission) * 100;
      }
      
      return { 
        total: totalCommission,
        change: Math.round(percentChange * 10) / 10 // Round to 1 decimal place
      };
    },
    enabled: !!user?.id
  });
};

// Hook to get agent's leaderboard position
export const useAgentLeaderboardPosition = () => {
  const { user } = useAuth();
  const [leaderboardPosition, setLeaderboardPosition] = useState<{
    position: number | string;
    change: number;
    hasTransactions: boolean;
  }>({
    position: '-',
    change: 0,
    hasTransactions: false
  });
  
  useEffect(() => {
    const fetchLeaderboardPosition = async () => {
      if (!user?.id) return;
      
      try {
        // Get last month's date range
        const lastMonthStart = new Date();
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        lastMonthStart.setDate(1);
        
        const lastMonthEnd = new Date();
        lastMonthEnd.setDate(0); // Last day of previous month
        
        // Fetch all agents' commissions for last month
        const { data, error } = await supabase
          .from('property_transactions')
          .select('agent_id, commission_amount')
          .gte('transaction_date', lastMonthStart.toISOString().split('T')[0])
          .lte('transaction_date', lastMonthEnd.toISOString().split('T')[0]);
        
        if (error) {
          console.error('Error fetching leaderboard data:', error);
          return;
        }
        
        // Group by agent and sum commissions
        const agentCommissions: Record<string, number> = {};
        
        data.forEach(transaction => {
          const agentId = transaction.agent_id;
          const amount = parseFloat(transaction.commission_amount) || 0;
          
          if (agentId) {
            agentCommissions[agentId] = (agentCommissions[agentId] || 0) + amount;
          }
        });
        
        // Convert to array and sort
        const leaderboard = Object.entries(agentCommissions)
          .map(([agentId, commission]) => ({ agentId, commission }))
          .sort((a, b) => b.commission - a.commission);
        
        // Find current agent's position
        const currentAgentIndex = leaderboard.findIndex(item => item.agentId === user.id);
        
        // Check if agent has any transactions last month
        const hasTransactions = currentAgentIndex !== -1;
        
        // Calculate position (add 1 since array is 0-indexed)
        const position = hasTransactions ? currentAgentIndex + 1 : 'N/A';
        
        // Get position from previous month for change calculation
        const previousMonthStart = new Date(lastMonthStart);
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
        
        const previousMonthEnd = new Date(lastMonthStart);
        previousMonthEnd.setDate(0);
        
        const { data: prevData, error: prevError } = await supabase
          .from('property_transactions')
          .select('agent_id, commission_amount')
          .gte('transaction_date', previousMonthStart.toISOString().split('T')[0])
          .lte('transaction_date', previousMonthEnd.toISOString().split('T')[0]);
        
        if (prevError) {
          console.error('Error fetching previous month leaderboard:', prevError);
          setLeaderboardPosition({ position, change: 0, hasTransactions });
          return;
        }
        
        // Calculate previous month position
        const prevAgentCommissions: Record<string, number> = {};
        
        prevData.forEach(transaction => {
          const agentId = transaction.agent_id;
          const amount = parseFloat(transaction.commission_amount) || 0;
          
          if (agentId) {
            prevAgentCommissions[agentId] = (prevAgentCommissions[agentId] || 0) + amount;
          }
        });
        
        const prevLeaderboard = Object.entries(prevAgentCommissions)
          .map(([agentId, commission]) => ({ agentId, commission }))
          .sort((a, b) => b.commission - a.commission);
        
        const prevPosition = prevLeaderboard.findIndex(item => item.agentId === user.id) + 1;
        
        // Calculate position change (positive means improved rank)
        let change = 0;
        if (prevPosition > 0 && hasTransactions) {
          change = prevPosition - (position as number);
        }
        
        setLeaderboardPosition({ position, change, hasTransactions });
      } catch (error) {
        console.error('Error in leaderboard calculation:', error);
        setLeaderboardPosition({ position: '-', change: 0, hasTransactions: false });
      }
    };
    
    fetchLeaderboardPosition();
    
    // Set up real-time subscription for transaction changes
    const channel = supabase
      .channel('dashboard_metrics_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'property_transactions' }, 
        () => {
          // Refetch leaderboard data when transactions change
          fetchLeaderboardPosition();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  
  return { leaderboardPosition };
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
