
import { toast } from 'sonner';
import { useSendNotification } from "@/hooks/useSendNotification";
import { formatCurrency } from "@/utils/propertyUtils";
import { NotificationType } from "@/types/notification";

export function useCommissionNotifications() {
  const { mutateAsync: sendNotification } = useSendNotification();
  
  /**
   * Create a notification for commission approval status changes
   */
  const createApprovalStatusNotification = async (
    userId: string, 
    status: string, 
    amount: number,
    transactionId: string,
    approvalId: string
  ) => {
    try {
      let title = '';
      let message = '';
      
      // Format status messages based on status
      switch(status.toLowerCase()) {
        case 'pending':
          title = 'Commission Approval Submitted';
          message = `Your commission of ${formatCurrency(amount)} has been submitted for approval.`;
          break;
        case 'under review':
          title = 'Commission Under Review';
          message = `Your commission of ${formatCurrency(amount)} is now under review.`;
          break;
        case 'approved':
          title = 'Commission Approved';
          message = `Your commission of ${formatCurrency(amount)} has been approved!`;
          break;
        case 'ready for payment':
          title = 'Commission Ready for Payment';
          message = `Your commission of ${formatCurrency(amount)} is ready for payment.`;
          break;
        case 'paid':
          title = 'Commission Paid';
          message = `Your commission of ${formatCurrency(amount)} has been paid.`;
          break;
        case 'rejected':
          title = 'Commission Rejected';
          message = `Your commission of ${formatCurrency(amount)} has been rejected. Please contact admin.`;
          break;
        default:
          title = 'Commission Status Update';
          message = `Your commission status has been updated to: ${status}`;
      }
      
      await sendNotification({
        userId,
        type: 'approval_status_change' as NotificationType,
        title,
        message,
        data: {
          amount,
          status,
          transactionId,
          approvalId
        }
      });
      
      // Show a local toast using Sonner
      // Use a conditional to customize the toast based on status instead of using variant
      if (status.toLowerCase() === 'rejected') {
        toast.error(title, {
          description: message
        });
      } else {
        toast(title, {
          description: message
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create approval status notification:', error);
      toast.error('Notification Failed', {
        description: 'Could not send approval status notification'
      });
      return false;
    }
  };
  
  /**
   * Create a notification for tier progress updates
   */
  const createTierProgressNotification = async (userId: string, progress: number) => {
    try {
      await sendNotification({
        userId,
        type: 'tier_update' as NotificationType,
        title: 'Tier Progress Update',
        message: `You are ${progress}% towards your next commission tier.`,
        data: {
          progress
        }
      });
      
      toast('Tier Progress Update', {
        description: `You are ${progress}% towards your next commission tier.`
      });
      
      return true;
    } catch (error) {
      console.error('Failed to create tier progress notification:', error);
      toast.error('Notification Failed', {
        description: 'Could not send tier progress notification'
      });
      return false;
    }
  };
  
  /**
   * Create a notification for tier achievement
   */
  const createTierAchievedNotification = async (userId: string, tier: string) => {
    try {
      await sendNotification({
        userId,
        type: 'tier_update' as NotificationType,
        title: 'New Tier Achieved!',
        message: `Congratulations! You've reached the ${tier} tier.`,
        data: {
          tier
        }
      });
      
      toast.success('New Tier Achieved!', {
        description: `Congratulations! You've reached the ${tier} tier.`
      });
      
      return true;
    } catch (error) {
      console.error('Failed to create tier achieved notification:', error);
      toast.error('Notification Failed', {
        description: 'Could not send tier achievement notification'
      });
      return false;
    }
  };
  
  /**
   * Create a notification for commission milestones
   */
  const createCommissionMilestoneNotification = async (userId: string, milestone: number) => {
    try {
      await sendNotification({
        userId,
        type: 'commission_milestone' as NotificationType,
        title: 'Commission Milestone Reached!',
        message: `You've reached ${formatCurrency(milestone)} in commissions this year!`,
        data: {
          milestone
        }
      });
      
      toast.success('Commission Milestone Reached!', {
        description: `You've reached ${formatCurrency(milestone)} in commissions this year!`
      });
      
      return true;
    } catch (error) {
      console.error('Failed to create commission milestone notification:', error);
      toast.error('Notification Failed', {
        description: 'Could not send commission milestone notification'
      });
      return false;
    }
  };
  
  /**
   * Create a notification for transaction status changes that affect commission
   */
  const createTransactionStatusNotification = async (
    userId: string,
    status: string,
    propertyTitle: string,
    commissionAmount: number,
    transactionId: string
  ) => {
    try {
      let title = '';
      let message = '';
      
      switch(status.toLowerCase()) {
        case 'pending':
          title = 'Transaction Pending';
          message = `Your transaction for ${propertyTitle} with potential commission of ${formatCurrency(commissionAmount)} is pending.`;
          break;
        case 'in progress':
          title = 'Transaction In Progress';
          message = `Your transaction for ${propertyTitle} is in progress. Expected commission: ${formatCurrency(commissionAmount)}.`;
          break;
        case 'completed':
          title = 'Transaction Completed';
          message = `Congratulations! Your transaction for ${propertyTitle} has been completed. Commission: ${formatCurrency(commissionAmount)}.`;
          break;
        case 'cancelled':
          title = 'Transaction Cancelled';
          message = `Your transaction for ${propertyTitle} has been cancelled.`;
          break;
        default:
          title = 'Transaction Update';
          message = `Your transaction for ${propertyTitle} has been updated to: ${status}.`;
      }
      
      await sendNotification({
        userId,
        type: 'approval_status_change' as NotificationType,
        title,
        message,
        data: {
          status,
          propertyTitle,
          commissionAmount,
          transactionId
        }
      });
      
      // Use Sonner's built-in toast types instead of variant
      if (status.toLowerCase() === 'cancelled') {
        toast.error(title, {
          description: message
        });
      } else if (status.toLowerCase() === 'completed') {
        toast.success(title, {
          description: message
        });
      } else {
        toast(title, {
          description: message
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create transaction status notification:', error);
      toast.error('Notification Failed', {
        description: 'Could not send transaction status notification'
      });
      return false;
    }
  };
  
  return {
    createApprovalStatusNotification,
    createTierProgressNotification,
    createTierAchievedNotification,
    createCommissionMilestoneNotification,
    createTransactionStatusNotification
  };
}
