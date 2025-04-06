
import { Opportunity, Transaction, Property, DashboardMetric, ApiResponse } from '@/types';
import { Building2, Users, DollarSign, LineChart } from 'lucide-react';

// Mock API client for dashboard data
// In a real implementation, this would fetch from Supabase
export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: async (): Promise<ApiResponse<{ metrics: DashboardMetric[] }>> => {
    // Mock data for now
    const metrics: DashboardMetric[] = [
      {
        id: "1",
        label: 'Total Listings',
        value: '142',
        change: 12.5,
        trend: 'up',
        icon: 'building'
      },
      {
        id: "2",
        label: 'Active Agents',
        value: '38',
        change: 4.2,
        trend: 'up',
        icon: 'users'
      },
      {
        id: "3",
        label: 'Monthly Revenue',
        value: '$92,428',
        change: -2.8,
        trend: 'down',
        icon: 'dollar'
      },
      {
        id: "4",
        label: 'Conversion Rate',
        value: '24.3%',
        change: 6.1,
        trend: 'up',
        icon: 'chart'
      }
    ];

    return {
      data: { metrics },
      message: 'Metrics retrieved successfully',
      success: true
    };
  },

  // Get recent properties
  getRecentProperties: async (limit = 5): Promise<ApiResponse<Property[]>> => {
    // Mock implementation
    return {
      data: [],
      message: 'Recent properties retrieved successfully',
      success: true
    };
  },

  // Get recent transactions
  getRecentTransactions: async (limit = 5): Promise<ApiResponse<Transaction[]>> => {
    // Mock implementation
    return {
      data: [],
      message: 'Recent transactions retrieved successfully',
      success: true
    };
  },

  // Get opportunities
  getOpportunities: async (): Promise<ApiResponse<Opportunity[]>> => {
    // Mock implementation
    return {
      data: [],
      message: 'Opportunities retrieved successfully',
      success: true
    };
  }
};

// Export other API modules for different sections
export const propertiesApi = {
  // API methods for properties
};

export const transactionsApi = {
  // API methods for transactions
};

export const commissionApi = {
  // API methods for commissions
};

export const teamApi = {
  // API methods for team management
};
