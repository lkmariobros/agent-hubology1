
import { supabase } from '@/lib/supabase';
import { 
  CommissionTier, 
  PaymentSchedule,
  CommissionApproval,
  CommissionHistory,
  AgentWithHierarchy
} from '@/types';

// Commission API service
export const commissionApi = {
  // Get commission summary
  getSummary: async (userId: string) => {
    try {
      // Here we would normally fetch from Supabase
      // For now, return mock data
      return {
        data: {
          personal: 12500,
          override: 3500,
          total: 16000,
          pending: 3200,
          paid: 12800
        }
      };
    } catch (error) {
      console.error('Error fetching commission summary:', error);
      throw error;
    }
  },

  // Get commission history
  getHistory: async (userId: string, limit = 10) => {
    try {
      // Mock data
      return {
        data: [] as CommissionHistory[]
      };
    } catch (error) {
      console.error('Error fetching commission history:', error);
      throw error;
    }
  },

  // Get commission tiers
  getTiers: async () => {
    try {
      // Mock data for commission tiers
      const tiers: CommissionTier[] = [
        {
          id: 'bronze',
          name: 'Bronze',
          tier: 'Bronze',
          rate: 20,
          minTransactions: 0,
          color: 'orange',
          rank: 'Associate',
          percentage: 70,
          commissionRate: 70,
          requirements: []
        },
        {
          id: 'silver',
          name: 'Silver',
          tier: 'Silver',
          rate: 25,
          minTransactions: 10,
          color: 'blue',
          rank: 'Senior Associate',
          percentage: 75,
          commissionRate: 75,
          requirements: []
        }
      ];
      
      return tiers;
    } catch (error) {
      console.error('Error fetching commission tiers:', error);
      throw error;
    }
  },

  // Get agent hierarchy
  getAgentHierarchy: async (agentId?: string) => {
    try {
      // Mock hierarchy data
      const mockHierarchy: AgentWithHierarchy = {
        id: 'agent123',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-123-4567',
        rank: 'Team Leader',
        tier: 'Team Leader',
        joinDate: '2023-01-15',
        commission: 83,
        transactions: 42,
        salesVolume: 4500000,
        personalCommission: 112500,
        overrideCommission: 45000,
        totalCommission: 157500,
        downline: [{
          id: 'agent456',
          name: 'Robert Wilson',
          email: 'robert.wilson@example.com',
          phone: '+1-555-987-6543',
          rank: 'Sales Leader',
          tier: 'Sales Leader',
          joinDate: '2023-03-10',
          commission: 80,
          transactions: 28,
          salesVolume: 2800000,
          personalCommission: 70000,
          overrideCommission: 15000,
          totalCommission: 85000,
          downline: []
        }]
      };
      
      return { data: mockHierarchy };
    } catch (error) {
      console.error('Error fetching agent hierarchy:', error);
      throw error;
    }
  },

  // Get agent downline
  getAgentDownline: async (agentId: string) => {
    try {
      // Mock data
      return {
        data: [] as AgentWithHierarchy[]
      };
    } catch (error) {
      console.error('Error fetching agent downline:', error);
      throw error;
    }
  },

  // Create commission tier
  createCommissionTier: async (tier: Partial<CommissionTier>) => {
    try {
      // Mock implementation
      return { id: 'new-tier-id', ...tier };
    } catch (error) {
      console.error('Error creating commission tier:', error);
      throw error;
    }
  },

  // Update commission tier
  updateCommissionTier: async (id: string, updates: Partial<CommissionTier>) => {
    try {
      // Mock implementation
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating commission tier:', error);
      throw error;
    }
  },

  // Delete commission tier
  deleteCommissionTier: async (id: string) => {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting commission tier:', error);
      throw error;
    }
  },

  // Get payment schedules
  getPaymentSchedules: async () => {
    try {
      // Mock implementation
      return [] as PaymentSchedule[];
    } catch (error) {
      console.error('Error fetching payment schedules:', error);
      throw error;
    }
  },

  // Create payment schedule
  createPaymentSchedule: async (schedule: Partial<PaymentSchedule>) => {
    try {
      // Mock implementation
      return { id: 'new-schedule-id', ...schedule };
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      throw error;
    }
  },

  // Update payment schedule
  updatePaymentSchedule: async (id: string, updates: Partial<PaymentSchedule>) => {
    try {
      // Mock implementation
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating payment schedule:', error);
      throw error;
    }
  },

  // Delete payment schedule
  deletePaymentSchedule: async (id: string) => {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting payment schedule:', error);
      throw error;
    }
  },

  // Approve commission
  approveCommission: async (id: string) => {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error approving commission:', error);
      throw error;
    }
  },

  // Reject commission
  rejectCommission: async (id: string, reason: string) => {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error rejecting commission:', error);
      throw error;
    }
  },

  // Update agent rank
  updateAgentRank: async (agentId: string, newRank: string) => {
    try {
      // Mock implementation
      return { success: true, message: 'Agent rank updated successfully' };
    } catch (error) {
      console.error('Error updating agent rank:', error);
      throw error;
    }
  },

  // Add agent
  addAgent: async (agent: any) => {
    try {
      // Mock implementation
      return { success: true, agentId: 'new-agent-id' };
    } catch (error) {
      console.error('Error adding agent:', error);
      throw error;
    }
  }
};
