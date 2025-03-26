
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

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: SendNotificationParams) => {
      try {
        console.log('Sending notification:', params);
        
        const { data, error } = await supabase.functions.invoke<{ success: boolean; data: any }>(
          'create_notification',
          {
            body: params
          }
        );
        
        if (error) {
          console.error('Error sending notification:', error);
          throw error;
        }
        
        if (!data?.success) {
          console.error('Failed to send notification:', data);
          throw new Error('Failed to send notification');
        }
        
        console.log('Notification sent successfully:', data);
        
        // Invalidate notifications query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        
        return data;
      } catch (error: any) {
        console.error('Error sending notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate specific queries after a successful notification
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to send notification: ${error.message}`);
    }
  });
};
