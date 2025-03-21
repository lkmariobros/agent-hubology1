
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

export const useNotificationSubscription = (
  userId: string | null,
  onNewNotification: (notification: Notification) => void
) => {
  useEffect(() => {
    if (!userId) return;

    let channel;

    try {
      channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            try {
              // Handle the new notification from the payload
              const newNotification = {
                id: payload.new.id,
                userId: payload.new.user_id,
                type: payload.new.type,
                title: payload.new.title,
                message: payload.new.message,
                data: payload.new.data,
                read: payload.new.read,
                createdAt: payload.new.created_at
              } as Notification;
              
              // Add to state via callback
              onNewNotification(newNotification);
              
              // Show toast notification
              toast(newNotification.title, {
                description: newNotification.message,
                action: {
                  label: 'View',
                  onClick: () => {
                    // If there's approval data, we can navigate to it
                    if (newNotification.type === 'approval' && newNotification.data?.approvalId) {
                      window.location.href = `/transactions/${newNotification.data.transactionId}`;
                    }
                  }
                }
              });
            } catch (error) {
              console.error('Error processing notification payload:', error);
            }
          }
        )
        .subscribe((status) => {
          console.log('Notification subscription status:', status);
        });
    } catch (error) {
      console.error('Error setting up notification subscription:', error);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing notification channel:', error);
        }
      }
    };
  }, [userId, onNewNotification]);
};
