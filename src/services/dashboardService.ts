import { supabase } from '@/lib/supabase';
import { createSupabaseClient } from '@/lib/supabaseWithClerk';
import { ApiResponse, DashboardMetric, Property, Transaction, Opportunity } from '@/types';

/**
 * Service for fetching dashboard data directly from Supabase
 */
export const dashboardService = {
  /**
   * Get dashboard metrics
   */
  async getMetrics(clerkToken?: string): Promise<ApiResponse<{ metrics: DashboardMetric[] }>> {
    try {
      // Use token if provided
      const client = clerkToken ? createSupabaseClient(clerkToken) : supabase;
      
      // Get count of properties
      const { count: propertyCount, error: propertyError } = await client
        .from('enhanced_properties')
        .select('*', { count: 'exact', head: true });
      
      if (propertyError) {
        console.error('Error fetching property count:', propertyError);
        throw propertyError;
      }
      
      // Get count of agents
      const { count: agentCount, error: agentError } = await client
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'agent');
      
      if (agentError) {
        console.error('Error fetching agent count:', agentError);
        throw agentError;
      }
      
      // Get total commission
      const { data: transactionData, error: transactionError } = await client
        .from('property_transactions')
        .select('commission_amount');
      
      if (transactionError) {
        console.error('Error fetching transaction data:', transactionError);
        throw transactionError;
      }
      
      const totalCommission = transactionData.reduce(
        (sum, transaction) => sum + parseFloat(transaction.commission_amount || '0'), 
        0
      );
      
      // Calculate conversion rate (simplified example)
      const conversionRate = propertyCount && agentCount ? 
        Math.round((totalCommission / (propertyCount * 10000)) * 100) : 0;
      
      return {
        data: {
          metrics: [
            {
              id: "1",
              label: 'Total Listings',
              value: propertyCount?.toString() || '0',
              change: 0,
              trend: 'neutral',
              icon: 'building'
            },
            {
              id: "2",
              label: 'Active Agents',
              value: agentCount?.toString() || '0',
              change: 0,
              trend: 'neutral',
              icon: 'users'
            },
            {
              id: "3",
              label: 'Total Commission',
              value: `$${totalCommission.toLocaleString()}`,
              change: 0,
              trend: 'neutral',
              icon: 'dollar'
            },
            {
              id: "4",
              label: 'Conversion Rate',
              value: `${conversionRate}%`,
              change: 0,
              trend: 'neutral',
              icon: 'chart'
            }
          ]
        },
        message: 'Metrics retrieved successfully',
        success: true
      };
    } catch (error) {
      console.error('Error in getMetrics:', error);
      return {
        data: { metrics: [] },
        message: 'Failed to retrieve metrics',
        success: false
      };
    }
  },
  
  /**
   * Get recent properties
   */
  async getRecentProperties(limit = 5, clerkToken?: string): Promise<ApiResponse<Property[]>> {
    try {
      // Use token if provided
      const client = clerkToken ? createSupabaseClient(clerkToken) : supabase;
      
      const { data, error } = await client
        .from('enhanced_properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching recent properties:', error);
        throw error;
      }
      
      return {
        data: data || [],
        message: 'Recent properties retrieved successfully',
        success: true
      };
    } catch (error) {
      console.error('Error in getRecentProperties:', error);
      return {
        data: [],
        message: 'Failed to retrieve recent properties',
        success: false
      };
    }
  },
  
  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit = 5, clerkToken?: string): Promise<ApiResponse<Transaction[]>> {
    try {
      // Use token if provided
      const client = clerkToken ? createSupabaseClient(clerkToken) : supabase;
      
      const { data, error } = await client
        .from('property_transactions')
        .select(`
          *,
          property:property_id(id, title, address)
        `)
        .order('transaction_date', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching recent transactions:', error);
        throw error;
      }
      
      return {
        data: data || [],
        message: 'Recent transactions retrieved successfully',
        success: true
      };
    } catch (error) {
      console.error('Error in getRecentTransactions:', error);
      return {
        data: [],
        message: 'Failed to retrieve recent transactions',
        success: false
      };
    }
  },
  
  /**
   * Get opportunities
   */
  async getOpportunities(clerkToken?: string): Promise<ApiResponse<Opportunity[]>> {
    try {
      // Use token if provided
      const client = clerkToken ? createSupabaseClient(clerkToken) : supabase;
      
      const { data, error } = await client
        .from('opportunities')
        .select('*')
        .order('posted_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
      }
      
      // Map database fields to expected format
      const opportunities = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        propertyType: item.property_type,
        budget: item.budget,
        location: item.location,
        status: item.status,
        postedBy: item.posted_by,
        postedDate: item.posted_date
      }));
      
      return {
        data: opportunities || [],
        message: 'Opportunities retrieved successfully',
        success: true
      };
    } catch (error) {
      console.error('Error in getOpportunities:', error);
      return {
        data: [],
        message: 'Failed to retrieve opportunities',
        success: false
      };
    }
  }
};

export default dashboardService;
