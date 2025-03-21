
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';
import { useNotificationActions } from '@/hooks/useNotificationActions';
import { useNotificationSubscription } from '@/hooks/useNotificationSubscription';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const notificationActions = useNotificationActions();

  // Get the current user
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user.id);
      }
    };

    getUserId();
  }, []);

  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user]);

  // Subscribe to real-time notifications
  useNotificationSubscription(user, (newNotification) => {
    setNotifications((current) => [newNotification, ...current]);
  });

  const refreshNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await notificationActions.refreshNotifications(user);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    const success = await notificationActions.markAsRead(id);
    if (success) {
      setNotifications(notifications.map((n) => 
        n.id === id ? { ...n, read: true } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const success = await notificationActions.markAllAsRead(user);
    if (success) {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  const deleteNotification = async (id: string) => {
    const success = await notificationActions.deleteNotification(id);
    if (success) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
