
import { Opportunity, Transaction, Property, DashboardMetric, ApiResponse, AgentWithHierarchy, CommissionTier } from '@/types';

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

// Commission API mock implementation
export const commissionApi = {
  // Get commission summary
  getSummary: async () => {
    return {
      currentMonth: { earned: 12750, target: 20000, progress: 63.75 },
      previousMonth: { earned: 18900, target: 20000, progress: 94.5 },
      yearToDate: { earned: 89500, target: 150000, progress: 59.67 }
    };
  },
  
  // Get commission history
  getHistory: async (page = 1, pageSize = 10) => {
    return {
      data: [],
      total: 0,
      page: page,
      pageSize: pageSize
    };
  },
  
  // Get commission tiers
  getTiers: async () => {
    return {
      data: [
        {
          id: 'bronze',
          name: 'Bronze',
          tier: 'Bronze',
          rate: 20,
          percentage: 70,
          minTransactions: 0,
          color: 'orange',
          rank: 'Associate'
        },
        {
          id: 'silver',
          name: 'Silver',
          tier: 'Silver',
          rate: 25,
          percentage: 75,
          minTransactions: 10,
          color: 'blue',
          rank: 'Senior Associate'
        }
      ],
      success: true
    };
  },
  
  // Get agent hierarchy
  getAgentHierarchy: async (agentId?: string) => {
    // Mock implementation
    return {
      id: 'agent123',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-123-4567',
      avatar: '',
      rank: 'Team Leader',
      tier: 'Team Leader',
      joinDate: '2023-01-15',
      transactions: 42,
      salesVolume: 4500000,
      personalCommission: 112500,
      overrideCommission: 45000,
      totalCommission: 157500,
      downline: []
    };
  },
  
  // Get agent downline
  getAgentDownline: async (agentId?: string) => {
    return {
      data: [],
      success: true
    };
  },
  
  // Update agent rank
  updateAgentRank: async (agentId: string, newRank: string) => {
    return {
      success: true,
      message: 'Agent rank updated successfully'
    };
  },
  
  // Add new agent
  addAgent: async (agentData: any) => {
    return {
      success: true,
      message: 'Agent added successfully',
      data: { id: 'new-agent-id' }
    };
  }
};

export const teamApi = {
  // API methods for team management
};
