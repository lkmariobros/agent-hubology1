
import { useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

export const useNotificationActions = () => {
  // Use useMemo to ensure the functions don't change on every render
  return useMemo(() => ({
    markAsRead: async (id: string) => {
      try {
        const { error } = await supabase.functions.invoke('mark_notification_read', {
          body: { notification_id: id }
        });

        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
    },

    markAllAsRead: async (userId: string) => {
      try {
        const { error } = await supabase.functions.invoke('mark_all_notifications_read', {
          body: { user_id: userId }
        });

        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }
    },

    deleteNotification: async (id: string) => {
      try {
        const { error } = await supabase.functions.invoke('delete_notification', {
          body: { notification_id: id }
        });

        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
      }
    },

    refreshNotifications: async (userId: string) => {
      if (!userId) return [];
      
      try {
        const { data, error } = await supabase.functions.invoke<Notification[]>('get_user_notifications', {
          body: { user_id: userId }
        });

        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    }
  }), []);
};
