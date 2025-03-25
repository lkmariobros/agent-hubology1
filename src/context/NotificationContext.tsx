
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { useNotificationSubscription } from '@/hooks/useNotificationSubscription';
import { useNotificationActions } from '@/hooks/useNotificationActions';
import { Notification } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { 
    markAsRead: markAsReadAction, 
    markAllAsRead: markAllAsReadAction,
    deleteNotification: deleteNotificationAction,
    refreshNotifications: refreshNotificationsAction,
    isLoading
  } = useNotificationActions();

  // Subscribe to real-time notifications
  useNotificationSubscription(user?.id || null, (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast for new notifications
    toast(notification.title, {
      description: notification.message,
      action: {
        label: "View",
        onClick: () => markAsRead(notification.id),
      },
    });
  });

  // Load initial notifications
  useEffect(() => {
    if (user?.id) {
      refreshNotifications();
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    const success = await markAsReadAction(id);
    
    if (success) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    const success = await markAllAsReadAction(user.id);
    
    if (success) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    const success = await deleteNotificationAction(id);
    
    if (success) {
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    if (!user?.id) return;
    
    const freshNotifications = await refreshNotificationsAction(user.id);
    setNotifications(freshNotifications);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refreshNotifications,
      loading: isLoading
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};
