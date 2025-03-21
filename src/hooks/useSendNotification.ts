
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type NotificationType = 'approval' | 'payment' | 'system' | 'message';

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
        const { data, error } = await supabase.functions.invoke<{ success: boolean }>(
          'create_notification',
          {
            body: params
          }
        );
        
        if (error) throw error;
        if (!data?.success) throw new Error('Failed to send notification');
        
        return data;
      } catch (error: any) {
        console.error('Error sending notification:', error);
        throw error;
      }
    },
    onError: (error) => {
      toast.error(`Failed to send notification: ${error.message}`);
    }
  });
};
