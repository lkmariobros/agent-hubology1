
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/notification';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

export const useNotificationSubscription = (
  userId: string | null,
  onNewNotification: (notification: Notification) => void
) => {
  useEffect(() => {
    if (!userId) return;

    // Create the channel
    const channel = supabase
      .channel(`user-notifications-${userId}`)
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
            // Convert payload to notification object
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
            
            // Update application state
            onNewNotification(newNotification);
            
            // Show toast notification with improved UI
            toast(newNotification.title, {
              description: newNotification.message,
              duration: 5000,
              action: {
                label: 'View',
                onClick: () => {
                  // Navigate based on notification type
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
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to notifications:', status);
          toast.error('Failed to connect to notification service');
        }
      });

    // Clean up on unmount
    return () => {
      supabase.removeChannel(channel)
        .catch(err => console.error('Error removing notification channel:', err));
    };
  }, [userId, onNewNotification]);
};
