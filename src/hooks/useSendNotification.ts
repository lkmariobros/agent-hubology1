
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NotificationType } from '@/types/notification';

interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

interface NotificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: SendNotificationParams): Promise<NotificationResponse> => {
      try {
        console.log('Sending notification with params:', params);
        
        const { data: response, error } = await supabase.functions.invoke<NotificationResponse>(
          'create_notification',
          {
            body: params
          }
        );
        
        if (error) {
          console.error('Edge function error:', error);
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        if (!response) {
          console.error('No response from edge function');
          throw new Error('No response from edge function');
        }
        
        if (!response.success) {
          console.error('Failed to send notification:', response.error || 'Unknown error');
          throw new Error(response.error || 'Failed to send notification');
        }
        
        console.log('Notification sent successfully:', response);
        
        return response;
      } catch (error: any) {
        console.error('Error sending notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate specific queries after a successful notification
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: Error) => {
      console.error('Notification mutation error:', error);
      toast.error(`Failed to send notification: ${error.message}`);
    }
  });
};
