
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Properly export types
export type { CommissionApprovalHistory, CommissionApprovalComment };

export interface CommissionApprovalHistory {
  id: string;
  approval_id: string;
  previous_status: string;
  new_status: string;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface CommissionApprovalComment {
  id: string;
  approval_id: string;
  content: string;
  created_by: string;
  created_at: string;
  user?: {
    name: string;
  };
}

export interface CommissionApprovalStats {
  pending: number;
  underReview: number;
  approved: number;
  readyForPayment: number;
  paid: number;
  pendingValue: number;
  approvedValue: number;
  paidValue: number;
}

// The old implementation
export const useCommissionApprovals = (
  status?: string,
  isAdmin?: boolean,
  userId?: string,
  page?: number,
  pageSize?: number
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock function to get approval history
  const getApprovalHistory = async (approvalId: string): Promise<CommissionApprovalHistory[]> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Mock data
      const mockHistory: CommissionApprovalHistory[] = [
        {
          id: '1',
          approval_id: approvalId,
          previous_status: 'Pending',
          new_status: 'Under Review',
          changed_by: 'system',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          approval_id: approvalId,
          previous_status: 'Under Review',
          new_status: 'Approved',
          changed_by: 'admin-user',
          notes: 'Looks good! Approved for payment.',
          created_at: new Date().toISOString()
        }
      ];
      
      return mockHistory;
    } catch (err) {
      setError('Failed to fetch approval history');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to get approval comments
  const getApprovalComments = async (approvalId: string): Promise<CommissionApprovalComment[]> => {
    setIsLoading(true);
    try {
      // Mock data
      const mockComments: CommissionApprovalComment[] = [
        {
          id: '1',
          approval_id: approvalId,
          content: 'Please provide additional documents for verification.',
          created_by: 'admin-user',
          created_at: new Date().toISOString(),
          user: { name: 'Admin User' }
        },
        {
          id: '2',
          approval_id: approvalId,
          content: 'Documents uploaded as requested.',
          created_by: 'agent-user',
          created_at: new Date().toISOString(),
          user: { name: 'Agent User' }
        }
      ];
      
      return mockComments;
    } catch (err) {
      setError('Failed to fetch approval comments');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to change approval status
  const updateApprovalStatus = async (
    approvalId: string, 
    newStatus: string, 
    notes?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      console.log(`Updating approval ${approvalId} to status: ${newStatus}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (err) {
      setError('Failed to update approval status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to add a comment
  const addComment = async (
    approvalId: string, 
    content: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      console.log(`Adding comment to approval ${approvalId}: ${content}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (err) {
      setError('Failed to add comment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add mock data for approvals
  const mockApprovals = [
    {
      id: '1',
      transaction_id: 'tx1',
      status: 'Pending',
      submitted_by: userId || 'agent-1',
      threshold_exceeded: false,
      created_at: new Date().toISOString(),
      property_transactions: {
        transaction_value: 500000,
        commission_amount: 15000,
        transaction_date: new Date().toISOString(),
        property_id: 'prop-1',
        commission_rate: 3,
        agent_id: userId || 'agent-1',
        property: {
          id: 'prop-1',
          title: 'Luxury Condo'
        }
      },
      agent: {
        id: userId || 'agent-1',
        name: 'John Agent'
      }
    },
    {
      id: '2',
      transaction_id: 'tx2',
      status: 'Under Review',
      submitted_by: userId || 'agent-1',
      threshold_exceeded: true,
      created_at: new Date().toISOString(),
      property_transactions: {
        transaction_value: 1500000,
        commission_amount: 45000,
        transaction_date: new Date().toISOString(),
        property_id: 'prop-2',
        commission_rate: 3,
        agent_id: userId || 'agent-1',
        property: {
          id: 'prop-2',
          title: 'Beach House'
        }
      },
      agent: {
        id: userId || 'agent-1',
        name: 'John Agent'
      }
    }
  ];

  // Return data structure that matches how it's used in components
  return {
    data: {
      approvals: status ? mockApprovals.filter(a => a.status === status) : mockApprovals
    },
    isLoading,
    error,
    refetch: () => Promise.resolve(),
    getApprovalHistory,
    getApprovalComments,
    updateApprovalStatus,
    addComment
  };
};

// New hooks needed for the components
export const useCommissionApprovalDetail = (id: string, includeHistory: boolean = false) => {
  return useQuery({
    queryKey: ['commission-approval', id],
    queryFn: async () => {
      // Mock implementation
      return {
        approval: {
          id,
          status: 'Pending',
          created_at: new Date().toISOString(),
          notes: 'Initial submission',
          threshold_exceeded: false,
          property_transactions: {
            transaction_value: 500000,
            commission_amount: 15000,
            transaction_date: new Date().toISOString(),
            commission_rate: 3
          }
        },
        history: [
          {
            id: '1',
            approval_id: id,
            previous_status: 'Draft',
            new_status: 'Pending',
            created_at: new Date().toISOString()
          }
        ],
        comments: []
      };
    }
  });
};

export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ approvalId, status, notes }: { approvalId: string, status: string, notes?: string }) => {
      // Mock implementation
      console.log(`Updating approval ${approvalId} to ${status}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['commission-approval'] });
    }
  });
};

export const usePendingCommissionApprovals = () => {
  return useQuery({
    queryKey: ['pending-commission-approvals'],
    queryFn: async () => {
      // Mock implementation
      return {
        approvals: [
          {
            id: '1',
            status: 'Pending',
            threshold_exceeded: false,
            property_transactions: {
              commission_amount: 15000,
              property: { title: 'Luxury Condo' }
            },
            agent: { name: 'John Agent' }
          }
        ]
      };
    }
  });
};

export const useBulkApproveCommissions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Mock implementation
      console.log(`Approving ${ids.length} commissions`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
    }
  });
};

export const useBulkRejectCommissions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Mock implementation
      console.log(`Rejecting ${ids.length} commissions`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-approvals'] });
    }
  });
};

export const useAddCommissionApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ approvalId, content }: { approvalId: string, content: string }) => {
      // Mock implementation
      console.log(`Adding comment to approval ${approvalId}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-approval'] });
    }
  });
};

export const useDeleteCommissionApprovalComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: string) => {
      // Mock implementation
      console.log(`Deleting comment ${commentId}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-approval'] });
    }
  });
};

export const useCommissionApprovalStats = () => {
  return useQuery({
    queryKey: ['commission-approval-stats'],
    queryFn: async () => {
      // Mock implementation
      return {
        stats: {
          pending: 5,
          underReview: 3,
          approved: 8,
          readyForPayment: 2,
          paid: 12,
          pendingValue: 150000,
          approvedValue: 240000,
          paidValue: 360000
        }
      };
    }
  });
};

export const useSystemConfiguration = (key: string) => {
  return useQuery({
    queryKey: ['system-configuration', key],
    queryFn: async () => {
      // Mock implementation
      if (key === 'commission_approval_threshold') {
        return '10000';
      }
      return null;
    }
  });
};
