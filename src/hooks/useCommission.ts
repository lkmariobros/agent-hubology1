
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionApi } from '@/services/commissionService';
import { CommissionTier, PaymentSchedule, AgentWithHierarchy } from '@/types';
import { toast } from 'sonner';
import { captureException } from '@/lib/sentry';

export function useCommission() {
  const queryClient = useQueryClient();
  
  // Commission Summary
  const getCommissionSummary = (userId: string) => {
    return useQuery({
      queryKey: ['commissionSummary', userId],
      queryFn: () => commissionApi.getSummary(userId),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
      meta: {
        errorMessage: 'Failed to load commission summary'
      }
    });
  };
  
  // Commission History
  const getCommissionHistory = (userId: string, limit = 10) => {
    return useQuery({
      queryKey: ['commissionHistory', userId, limit],
      queryFn: () => commissionApi.getHistory(userId, limit),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
      meta: {
        errorMessage: 'Failed to load commission history'
      }
    });
  };
  
  // Commission Tiers
  const getCommissionTiers = () => {
    return useQuery({
      queryKey: ['commissionTiers'],
      queryFn: commissionApi.getTiers,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
      meta: {
        errorMessage: 'Failed to load commission tiers'
      }
    });
  };
  
  // Agent Hierarchy
  const getAgentHierarchy = (agentId?: string) => {
    const { data, isLoading, error, refetch } = useQuery({
      queryKey: ['agentHierarchy', agentId],
      queryFn: async () => {
        // Fetch agent hierarchy data
        const response = await commissionApi.getAgentHierarchy(agentId);
        return response;
      },
      enabled: !!agentId,
    });
    
    return { data: data?.data || null, isLoading, error, refetch };
  };
  
  // Agent Downline
  const getAgentDownline = (agentId: string) => {
    return useQuery({
      queryKey: ['agentDownline', agentId],
      queryFn: () => commissionApi.getAgentDownline(agentId),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
      meta: {
        errorMessage: 'Failed to load agent downline'
      }
    });
  };
  
  // Create Commission Tier
  const createCommissionTier = useMutation({
    mutationFn: commissionApi.createCommissionTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionTiers'] });
      toast.success("Commission tier created successfully");
    },
    onError: (error: any) => {
      console.error('Error creating commission tier:', error);
      captureException(error, { source: 'useCommission.createCommissionTier' });
      toast.error(`Failed to create commission tier: ${error.message || "Unknown error"}`);
    }
  });
  
  // Update Commission Tier
  const updateCommissionTier = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CommissionTier> }) =>
      commissionApi.updateCommissionTier(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionTiers'] });
      toast.success("Commission tier updated successfully");
    },
    onError: (error: any) => {
      console.error('Error updating commission tier:', error);
      captureException(error, { source: 'useCommission.updateCommissionTier' });
      toast.error(`Failed to update commission tier: ${error.message || "Unknown error"}`);
    }
  });
  
  // Delete Commission Tier
  const deleteCommissionTier = useMutation({
    mutationFn: commissionApi.deleteCommissionTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionTiers'] });
      toast.success("Commission tier deleted successfully");
    },
    onError: (error: any) => {
      console.error('Error deleting commission tier:', error);
      captureException(error, { source: 'useCommission.deleteCommissionTier' });
      toast.error(`Failed to delete commission tier: ${error.message || "Unknown error"}`);
    }
  });
  
  // Payment Schedules
  const getPaymentSchedules = () => {
    return useQuery({
      queryKey: ['paymentSchedules'],
      queryFn: commissionApi.getPaymentSchedules,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
      meta: {
        errorMessage: 'Failed to load payment schedules'
      }
    });
  };
  
  // Create Payment Schedule
  const createPaymentSchedule = useMutation({
    mutationFn: commissionApi.createPaymentSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      toast.success("Payment schedule created successfully");
    },
    onError: (error: any) => {
      console.error('Error creating payment schedule:', error);
      captureException(error, { source: 'useCommission.createPaymentSchedule' });
      toast.error(`Failed to create payment schedule: ${error.message || "Unknown error"}`);
    }
  });
  
  // Update Payment Schedule
  const updatePaymentSchedule = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PaymentSchedule> }) =>
      commissionApi.updatePaymentSchedule(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      toast.success("Payment schedule updated successfully");
    },
    onError: (error: any) => {
      console.error('Error updating payment schedule:', error);
      captureException(error, { source: 'useCommission.updatePaymentSchedule' });
      toast.error(`Failed to update payment schedule: ${error.message || "Unknown error"}`);
    }
  });
  
  // Delete Payment Schedule
  const deletePaymentSchedule = useMutation({
    mutationFn: commissionApi.deletePaymentSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSchedules'] });
      toast.success("Payment schedule deleted successfully");
    },
    onError: (error: any) => {
      console.error('Error deleting payment schedule:', error);
      captureException(error, { source: 'useCommission.deletePaymentSchedule' });
      toast.error(`Failed to delete payment schedule: ${error.message || "Unknown error"}`);
    }
  });
  
  // Approve Commission
  const approveCommission = useMutation({
    mutationFn: commissionApi.approveCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast.success("Commission approved successfully");
    },
    onError: (error: any) => {
      console.error('Error approving commission:', error);
      captureException(error, { source: 'useCommission.approveCommission' });
      toast.error(`Failed to approve commission: ${error.message || "Unknown error"}`);
    }
  });
  
  // Reject Commission
  const rejectCommission = useMutation({
    mutationFn: commissionApi.rejectCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast.success("Commission rejected successfully");
    },
    onError: (error: any) => {
      console.error('Error rejecting commission:', error);
      captureException(error, { source: 'useCommission.rejectCommission' });
      toast.error(`Failed to reject commission: ${error.message || "Unknown error"}`);
    }
  });
  
  // Update Agent Rank
  const updateAgentRank = useMutation<
    { success: boolean; message: string }, // return type
    Error, // error type
    { agentId: string; newRank: string }, // variables type
    void // context type
  >({
    mutationFn: async ({ agentId, newRank }) => {
      return await commissionApi.updateAgentRank(agentId, newRank);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success("Agent rank updated successfully");
    },
    onError: (error) => {
      console.error('Error updating agent rank:', error);
      captureException(error, { source: 'useCommission.updateAgentRank' });
      toast.error(`Failed to update agent rank: ${error.message || "Unknown error"}`);
    },
  });
  
  // Add Agent
  const addAgent = useMutation({
    mutationFn: commissionApi.addAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success("New agent added successfully");
    },
    onError: (error: any) => {
      console.error('Error adding agent:', error);
      captureException(error, { source: 'useCommission.addAgent' });
      toast.error(`Failed to add agent: ${error.message || "Unknown error"}`);
    }
  });
  
  return {
    getCommissionSummary,
    getCommissionHistory,
    getCommissionTiers,
    getAgentHierarchy,
    getAgentDownline,
    createCommissionTier,
    updateCommissionTier,
    deleteCommissionTier,
    getPaymentSchedules,
    createPaymentSchedule,
    updatePaymentSchedule,
    deletePaymentSchedule,
    approveCommission,
    rejectCommission,
    updateAgentRank,
    addAgent
  };
}

// For backward compatibility with existing code
export const useCommissionTiers = () => {
  const { getCommissionTiers } = useCommission();
  return getCommissionTiers();
};

export const useAgentHierarchy = (agentId?: string) => {
  const { getAgentHierarchy } = useCommission();
  return getAgentHierarchy(agentId);
};
