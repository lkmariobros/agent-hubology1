
import { useSendNotification } from './useSendNotification';
import { toast } from 'sonner';

export const useCommissionNotifications = () => {
  const { mutate: sendNotification } = useSendNotification();

  const createApprovalStatusNotification = (
    userId: string,
    status: string,
    amount: number,
    transactionId: string, 
    approvalId: string
  ) => {
    const formattedAmount = new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    let title = '';
    let message = '';

    switch (status.toLowerCase()) {
      case 'pending':
        title = 'New Commission Pending Approval';
        message = `Your commission of ${formattedAmount} is pending approval.`;
        break;
      case 'under review':
        title = 'Commission Under Review';
        message = `Your commission of ${formattedAmount} is now under review.`;
        break;
      case 'approved':
        title = 'Commission Approved';
        message = `Your commission of ${formattedAmount} has been approved!`;
        break;
      case 'ready for payment':
        title = 'Commission Ready for Payment';
        message = `Your commission of ${formattedAmount} is ready for payment.`;
        break;
      case 'paid':
        title = 'Commission Paid';
        message = `Your commission of ${formattedAmount} has been paid.`;
        break;
      case 'rejected':
        title = 'Commission Rejected';
        message = `Your commission of ${formattedAmount} was rejected. Please contact admin.`;
        break;
      default:
        title = 'Commission Status Update';
        message = `Your commission of ${formattedAmount} has been updated to ${status}.`;
    }

    sendNotification({
      userId,
      type: 'approval_status',
      title,
      message,
      data: {
        status,
        amount,
        transactionId,
        approvalId
      }
    },
    {
      onSuccess: () => {
        toast.success('Approval notification sent successfully');
      },
      onError: (error) => {
        console.error('Failed to send approval notification:', error);
        toast.error('Failed to send approval notification');
      }
    });
  };

  const createTierProgressNotification = (
    userId: string,
    progress: number
  ) => {
    sendNotification({
      userId,
      type: 'tier_progress',
      title: 'Tier Progress Update',
      message: `You are ${progress}% of the way to the next tier level!`,
      data: {
        progress
      }
    },
    {
      onSuccess: () => {
        toast.success('Tier progress notification sent');
      },
      onError: (error) => {
        console.error('Failed to send tier progress notification:', error);
        toast.error('Failed to send tier progress notification');
      }
    });
  };

  const createTierAchievedNotification = (
    userId: string,
    tier: string
  ) => {
    sendNotification({
      userId,
      type: 'tier_achieved',
      title: 'New Tier Achieved!',
      message: `Congratulations! You have reached the ${tier} tier!`,
      data: {
        tier
      }
    },
    {
      onSuccess: () => {
        toast.success('Tier achievement notification sent');
      },
      onError: (error) => {
        console.error('Failed to send tier achievement notification:', error);
        toast.error('Failed to send tier achievement notification');
      }
    });
  };

  const createCommissionMilestoneNotification = (
    userId: string,
    amount: number
  ) => {
    const formattedAmount = new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    sendNotification({
      userId,
      type: 'commission_milestone',
      title: 'Commission Milestone Reached!',
      message: `Congratulations! You've earned ${formattedAmount} in commissions this year!`,
      data: {
        amount
      }
    },
    {
      onSuccess: () => {
        toast.success('Commission milestone notification sent');
      },
      onError: (error) => {
        console.error('Failed to send commission milestone notification:', error);
        toast.error('Failed to send commission milestone notification');
      }
    });
  };

  const createTransactionStatusNotification = (
    userId: string,
    status: string,
    propertyName: string,
    amount: number,
    transactionId: string
  ) => {
    const formattedAmount = new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    let title = 'Transaction Status Update';
    let message = `Transaction for ${propertyName} (${formattedAmount}) is now ${status}.`;

    sendNotification({
      userId,
      type: 'transaction_status',
      title,
      message,
      data: {
        status,
        propertyName,
        amount,
        transactionId
      }
    },
    {
      onSuccess: () => {
        toast.success('Transaction status notification sent');
      },
      onError: (error) => {
        console.error('Failed to send transaction status notification:', error);
        toast.error('Failed to send transaction status notification');
      }
    });
  };

  return {
    createApprovalStatusNotification,
    createTierProgressNotification,
    createTierAchievedNotification,
    createCommissionMilestoneNotification,
    createTransactionStatusNotification
  };
};
