
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  userId: string;
  data?: Record<string, any>;
  relatedId?: string;
}

// Context interface
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'userId'>) => Promise<void>;
}

// Create context with default values
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      if (data) {
        // Transform to match our Notification interface
        const transformedNotifications: Notification[] = data.map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.type,
          createdAt: item.created_at,
          read: item.read || false,
          userId: item.user_id,
          data: item.data,
          relatedId: item.related_id
        }));

        setNotifications(transformedNotifications);
        setUnreadCount(transformedNotifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Error in fetchNotifications:', err);
    }
  }, [user?.id]);

  // Subscribe to notifications channel
  useEffect(() => {
    if (!user?.id) return;

    // Initial fetch
    fetchNotifications();

    // Set up real-time subscription
    const subscription = supabase
      .channel('notification_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        payload => {
          // Add the new notification to the list
          const newNotification: Notification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: payload.new.type,
            createdAt: payload.new.created_at,
            read: payload.new.read || false,
            userId: payload.new.user_id,
            data: payload.new.data,
            relatedId: payload.new.related_id
          };

          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Show toast for new notification
          toast(newNotification.title, {
            description: newNotification.message,
            position: 'top-right',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        payload => {
          // Update the notification in the list
          setNotifications(prev =>
            prev.map(notification =>
              notification.id === payload.new.id
                ? {
                    ...notification,
                    read: payload.new.read,
                    title: payload.new.title,
                    message: payload.new.message,
                    type: payload.new.type,
                    data: payload.new.data
                  }
                : notification
            )
          );

          // Update unread count
          setUnreadCount(prev => {
            const wasUnread = !payload.old.read;
            const isNowRead = payload.new.read;
            if (wasUnread && isNowRead) {
              return prev - 1;
            }
            if (!wasUnread && !isNowRead) {
              return prev + 1;
            }
            return prev;
          });
        }
      )
      .subscribe();

    // Clean up on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchNotifications, user?.id]);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error in markAsRead:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id || notifications.length === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error in markAllAsRead:', err);
    }
  }, [notifications.length, user?.id]);

  // Add a new notification
  const addNotification = useCallback(
    async (
      notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'userId'>
    ) => {
      if (!user?.id) return;

      try {
        const { error } = await supabase.from('notifications').insert({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          related_id: notification.relatedId,
          user_id: user.id,
          read: false
        });

        if (error) {
          console.error('Error adding notification:', error);
        }
      } catch (err) {
        console.error('Error in addNotification:', err);
      }
    },
    [user?.id]
  );

  // Context value
  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook for using the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Additional hooks for specific notification operations
export const useNotificationActions = () => {
  const { markAsRead, markAllAsRead, addNotification } = useNotifications();
  return { markAsRead, markAllAsRead, addNotification };
};

export const useNotificationSubscription = () => {
  const { notifications, unreadCount, refreshNotifications } = useNotifications();
  return { notifications, unreadCount, refreshNotifications };
};

export const useSendNotification = () => {
  const { addNotification } = useNotifications();
  
  const sendNotification = useCallback(
    async ({
      title,
      message,
      type,
      data,
      relatedId
    }: {
      title: string;
      message: string;
      type: string;
      data?: Record<string, any>;
      relatedId?: string;
    }) => {
      await addNotification({
        title,
        message,
        type,
        data,
        relatedId
      });
    },
    [addNotification]
  );

  return sendNotification;
};
