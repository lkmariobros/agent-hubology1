
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/notification';
import { logger } from '@/services/logging';

export const useNotificationSubscription = (
  userId: string | null,
  onNewNotification: (notification: Notification) => void
) => {
  useEffect(() => {
    if (!userId) return;

    // Create the channel
    let channel;
    try {
      channel = supabase
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
              logger.error('Error processing notification payload:', error);
            }
          }
        )
        .subscribe((status) => {
          // Fix: Cast or handle status as string instead of treating it as Record<string, any>
          const statusStr = status.toString();
          
          if (statusStr === 'SUBSCRIBED') {
            logger.info('Successfully subscribed to notifications');
          } else if (statusStr === 'CHANNEL_ERROR') {
            // Fix: Pass the status as an object property instead of a second parameter
            logger.error('Failed to subscribe to notifications', { status: statusStr });
            toast.error('Failed to connect to notification service');
          } else if (statusStr === 'CLOSED') {
            logger.error('Notification channel closed');
            // Attempt to reconnect after a delay
            setTimeout(() => {
              if (channel) {
                try {
                  channel.subscribe();
                  logger.info('Attempting to reconnect notification channel');
                } catch (err) {
                  logger.error('Failed to reconnect notification channel:', err);
                }
              }
            }, 5000);
          }
        });
    } catch (error) {
      logger.error('Error creating notification channel:', error);
    }

    // Clean up on unmount
    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel)
            .catch(err => logger.error('Error removing notification channel:', err));
        } catch (error) {
          logger.error('Error in notification subscription cleanup:', error);
        }
      }
    };
  }, [userId, onNewNotification]);
};
