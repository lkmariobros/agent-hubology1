import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Notification } from '@/types/notification';
import { useNotificationActions } from '@/hooks/useNotificationActions';
import { useNotificationSubscription } from '@/hooks/useNotificationSubscription';
import { toast } from 'sonner';
import { logger } from '@/services/logging';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const userId = user?.id || null;
  
  const { 
    markAsRead: markNotificationAsRead, 
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: deleteUserNotification,
    refreshNotifications: fetchUserNotifications
  } = useNotificationActions();

  // Function to add a new notification to the state
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      // Check if notification already exists to prevent duplicates
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      return [notification, ...prev];
    });
    
    // Show toast for new notifications that aren't already in the list
    if (!notification.read) {
      toast(notification.title, {
        description: notification.message,
      });
    }
  }, []);

  // Use subscription hook for real-time notifications
  useNotificationSubscription(userId, addNotification);

  // Initialize notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (!userId) {
        setNotifications([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await fetchUserNotifications(userId);
        setNotifications(data);
      } catch (error) {
        logger.error('Error loading notifications', { error });
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotifications();
  }, [userId, fetchUserNotifications]);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      setIsLoading(true);
      const success = await markNotificationAsRead(id);
      
      if (success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      logger.error('Error marking notification as read', { id, error });
      toast.error('Failed to mark notification as read');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const success = await markAllNotificationsAsRead(userId);
      
      if (success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
    } catch (error) {
      logger.error('Error marking all notifications as read', { error });
      toast.error('Failed to mark all notifications as read');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    try {
      setIsLoading(true);
      const success = await deleteUserNotification(id);
      
      if (success) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== id)
        );
      }
    } catch (error) {
      logger.error('Error deleting notification', { id, error });
      toast.error('Failed to delete notification');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const data = await fetchUserNotifications(userId);
      setNotifications(data);
    } catch (error) {
      logger.error('Error refreshing notifications', { error });
      toast.error('Failed to refresh notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications,
        isLoading
      }}
    >
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
