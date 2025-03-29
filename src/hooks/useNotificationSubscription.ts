
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/notification';

/**
 * Hook to subscribe to real-time notifications
 */
export const useNotificationSubscription = (
  userId: string | null,
  onNewNotification: (notification: Notification) => void
) => {
  const [subscribed, setSubscribed] = useState(false);
  
  useEffect(() => {
    if (!userId) return;

    let channel;
    let reconnectTimer: number | null = null;
    
    const setupSubscription = () => {
      try {
        // Clear any existing reconnect timers
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        
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
                
                // Show toast notification
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
            // Handle subscription status
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to notifications');
              setSubscribed(true);
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Failed to subscribe to notifications', { status });
              setSubscribed(false);
              toast.error('Failed to connect to notification service');
              
              // Attempt to reconnect after a delay
              reconnectTimer = window.setTimeout(() => {
                console.log('Attempting to reconnect notification channel');
                setupSubscription();
              }, 5000);
            } else if (status === 'CLOSED') {
              console.warn('Notification channel closed');
              setSubscribed(false);
              
              // Attempt to reconnect after a delay
              reconnectTimer = window.setTimeout(() => {
                console.log('Attempting to reconnect notification channel after close');
                setupSubscription();
              }, 5000);
            }
          });
      } catch (error) {
        console.error('Error creating notification channel:', error);
        setSubscribed(false);
        
        // Attempt to reconnect after a delay
        reconnectTimer = window.setTimeout(() => {
          console.log('Attempting to reconnect notification channel after error');
          setupSubscription();
        }, 5000);
      }
    };
    
    // Initial setup
    setupSubscription();

    // Clean up on unmount
    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing notification channel:', error);
        }
      }
      
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [userId, onNewNotification]);
  
  return { subscribed };
};

export default useNotificationSubscription;
