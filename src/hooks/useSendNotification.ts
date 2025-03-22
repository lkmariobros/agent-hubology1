
import { useMutation } from '@tanstack/react-query';
import { Notification, NotificationType } from '@/types/notification';
import { toast } from 'sonner';

interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export const useSendNotification = () => {
  // Create a mutation for sending notifications
  return useMutation({
    mutationFn: async ({
      userId,
      type,
      title,
      message,
      data
    }: SendNotificationParams): Promise<boolean> => {
      console.log('Sending notification to user', userId, ':', { type, title, message, data });
      
      // In a real app, this would make an API call to send the notification
      // For now, we'll just simulate success
      // You could use supabase functions to send actual notifications
      toast.success('Notification sent');
      return true;
    },
    onError: (error) => {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification');
    }
  });
};
