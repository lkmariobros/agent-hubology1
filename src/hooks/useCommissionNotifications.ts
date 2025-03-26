
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CommissionNotificationType } from '@/components/commission/CommissionNotification';
import { useSendNotification } from '@/hooks/useSendNotification';
import { NotificationType } from '@/types/notification';

interface CommissionNotification {
  type: CommissionNotificationType;
  title: string;
  message: string;
  data?: {
    commissionAmount?: number;
    transactionId?: string;
    approvalId?: string;
    tierName?: string;
    progressPercentage?: number;
    date?: string;
  };
}

// Queue for batching notifications
let notificationQueue: Array<{params: any, callback?: () => void}> = [];
let isProcessingQueue = false;

// Process notification queue
const processNotificationQueue = async (sendNotification: any) => {
  if (isProcessingQueue || notificationQueue.length === 0) return;
  
  isProcessingQueue = true;
  console.log(`Processing ${notificationQueue.length} queued notifications`);
  
  // Take up to 5 notifications at a time to process
  const batchSize = Math.min(notificationQueue.length, 5);
  const batchToProcess = notificationQueue.splice(0, batchSize);
  
  try {
    // Process each notification in the batch
    for (const item of batchToProcess) {
      try {
        await sendNotification(item.params, {
          onSuccess: () => {
            if (item.callback) item.callback();
          }
        });
      } catch (error) {
        console.error('Error processing queued notification:', error);
      }
    }
  } finally {
    isProcessingQueue = false;
    
    // If there are more notifications, process them after a short delay
    if (notificationQueue.length > 0) {
      setTimeout(() => processNotificationQueue(sendNotification), 300);
    }
  }
};

// Add notification to queue
const queueNotification = (params: any, sendNotification: any, callback?: () => void) => {
  notificationQueue.push({ params, callback });
  
  // Start processing queue if not already processing
  if (!isProcessingQueue) {
    processNotificationQueue(sendNotification);
  }
};

export const useCommissionNotifications = (userId?: string) => {
  const { mutate: sendNotification } = useSendNotification();
  
  // Fetch commission notifications for the current user
  const getCommissionNotifications = () => {
    return useQuery({
      queryKey: ['notifications', 'commission', userId],
      queryFn: async () => {
        if (!userId) return [];
        
        // Fetch notifications related to commissions
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .in('type', [
            'approval_status_change', 
            'tier_update', 
            'commission_milestone'
          ] as NotificationType[])
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) {
          console.error('Error fetching commission notifications:', error);
          return [];
        }
        
        return data || [];
      },
      enabled: !!userId,
    });
  };
  
  // Create a notification for commission status change
  const createApprovalStatusNotification = (
    userId: string,
    status: string,
    commissionAmount: number,
    transactionId?: string,
    approvalId?: string
  ) => {
    // Map status to notification type
    let notificationType: CommissionNotificationType = 'approval_pending';
    
    switch (status.toLowerCase()) {
      case 'pending':
        notificationType = 'approval_pending';
        break;
      case 'under review':
        notificationType = 'approval_review';
        break;
      case 'approved':
        notificationType = 'approval_approved';
        break;
      case 'ready for payment':
        notificationType = 'approval_ready';
        break;
      case 'paid':
        notificationType = 'approval_paid';
        break;
      case 'rejected':
        notificationType = 'approval_rejected';
        break;
      default:
        notificationType = 'approval_pending';
    }
    
    // Determine title and message based on status
    let title = 'Commission Status Update';
    let message = `Your commission of $${commissionAmount.toLocaleString()} has been updated to ${status}.`;
    
    if (status.toLowerCase() === 'approved') {
      title = 'Commission Approved';
      message = `Great news! Your commission of $${commissionAmount.toLocaleString()} has been approved.`;
    } else if (status.toLowerCase() === 'rejected') {
      title = 'Commission Rejected';
      message = `Your commission of $${commissionAmount.toLocaleString()} has been rejected. Please contact your administrator.`;
    } else if (status.toLowerCase() === 'ready for payment') {
      title = 'Commission Ready for Payment';
      message = `Your commission of $${commissionAmount.toLocaleString()} is ready for payment.`;
    } else if (status.toLowerCase() === 'paid') {
      title = 'Commission Paid';
      message = `Your commission of $${commissionAmount.toLocaleString()} has been paid.`;
    }
    
    // Determine priority - approval is important
    const priority = ['approved', 'rejected', 'paid'].includes(status.toLowerCase()) 
      ? 'high' 
      : 'normal';
    
    // Prepare notification parameters
    const params = {
      userId,
      type: 'approval_status_change' as NotificationType,
      title,
      message,
      data: {
        notificationType,
        commissionAmount,
        transactionId,
        approvalId
      },
      priority
    };
    
    // Queue notification instead of sending immediately
    queueNotification(params, sendNotification, () => {
      toast(title, { description: message });
    });
  };
  
  // Create a notification for tier progress
  const createTierProgressNotification = (
    userId: string,
    progressPercentage: number
  ) => {
    const title = 'Tier Progress Update';
    const message = `You're ${progressPercentage}% of the way to the next tier. Keep up the great work!`;
    
    const params = {
      userId,
      type: 'tier_update' as NotificationType,
      title,
      message,
      data: {
        notificationType: 'tier_progress',
        progressPercentage
      },
      priority: 'low' as const  // This is low priority
    };
    
    queueNotification(params, sendNotification, () => {
      toast(title, { description: message });
    });
  };
  
  // Create a notification for tier achievement
  const createTierAchievedNotification = (
    userId: string,
    tierName: string
  ) => {
    const title = 'New Tier Achieved!';
    const message = `Congratulations! You've reached the ${tierName} tier. Your commission rate has been updated.`;
    
    const params = {
      userId,
      type: 'tier_update' as NotificationType,
      title,
      message,
      data: {
        notificationType: 'tier_achieved',
        tierName
      },
      priority: 'high' as const  // This is important
    };
    
    queueNotification(params, sendNotification, () => {
      toast(title, { description: message });
    });
  };
  
  // Create a notification for commission milestone
  const createCommissionMilestoneNotification = (
    userId: string,
    commissionAmount: number
  ) => {
    const title = 'Commission Milestone Reached';
    const message = `You've reached $${commissionAmount.toLocaleString()} in commissions! Keep up the excellent work.`;
    
    const params = {
      userId,
      type: 'commission_milestone' as NotificationType,
      title,
      message,
      data: {
        notificationType: 'commission_milestone',
        commissionAmount
      },
      priority: 'normal' as const
    };
    
    queueNotification(params, sendNotification, () => {
      toast.success(title, { description: message });
    });
  };
  
  return {
    getCommissionNotifications,
    createApprovalStatusNotification,
    createTierProgressNotification,
    createTierAchievedNotification,
    createCommissionMilestoneNotification
  };
};
