
import { useState } from 'react';
import { CommissionApproval, CommissionApprovalHistory, CommissionApprovalComment } from '@/types';

export { CommissionApprovalHistory, CommissionApprovalComment };

export const useCommissionApprovals = () => {
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

  return {
    getApprovalHistory,
    getApprovalComments,
    updateApprovalStatus,
    addComment,
    isLoading,
    error
  };
};
