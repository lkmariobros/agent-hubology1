import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/notification';
import CommissionNotification from './CommissionNotification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell } from 'lucide-react';

interface CommissionNotificationFeedProps {
  userId?: string;
  limit?: number;
}

// Define the type for the data returned from the database
interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  related_id?: string;
  created_at: string;
  data?: string | Record<string, any>;
}

const CommissionNotificationFeed: React.FC<CommissionNotificationFeedProps> = ({ 
  userId,
  limit = 3
}) => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', 'commission', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id' as any, userId as any)
        .in('type' as any, [
          'approval_status_change',
          'tier_update',
          'commission_milestone'
        ] as any[])
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching commission notifications:', error);
        return [];
      }
      
      console.log('Raw notification data:', data);
      
      // Map the database rows to our Notification type with safe type assertions
      return (data || []).map((item: any) => {
        // Parse the data JSON field if it exists, otherwise create an empty object
        let notificationData: Record<string, any> = {};
        
        try {
          // Check if the data field exists as a string and try to parse it
          if (typeof item.data === 'string' && item.data) {
            notificationData = JSON.parse(item.data);
          } 
          // If it's already an object, use it directly
          else if (typeof item.data === 'object' && item.data !== null) {
            notificationData = item.data;
          }
        } catch (e) {
          console.error('Error parsing notification data:', e);
        }
        
        // If there's a related_id, add it to the data object too
        if (item.related_id) {
          notificationData.relatedId = item.related_id;
        }
        
        return {
          id: item.id,
          userId: item.user_id,
          type: item.type as Notification['type'],
          title: item.title,
          message: item.message,
          read: item.read || false,
          data: notificationData,
          createdAt: item.created_at
        } as Notification;
      });
    },
    enabled: !!userId,
  });

  const mapNotificationToProps = (notification: Notification) => {
    const data = notification.data || {};
    
    // Default to notification type from the data if available, otherwise use a fallback mapping
    const notificationType = data.notificationType || mapTypeToNotificationType(notification.type);
    
    return {
      type: notificationType,
      title: notification.title,
      message: notification.message,
      commissionAmount: data.commissionAmount,
      tierName: data.tierName,
      progressPercentage: data.progressPercentage,
      date: data.date || notification.createdAt
    };
  };
  
  // Map notification type to CommissionNotificationType
  const mapTypeToNotificationType = (type: string): any => {
    switch (type) {
      case 'approval_status_change':
        return 'approval_approved';
      case 'tier_update':
        return 'tier_progress';
      case 'commission_milestone':
        return 'commission_milestone';
      default:
        return 'approval_pending';
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" /> Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(limit).fill(0).map((_, i) => (
            <Skeleton key={i} className="w-full h-20" />
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (!notifications || notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" /> Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No recent commission notifications</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" /> Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <CommissionNotification
            key={notification.id}
            {...mapNotificationToProps(notification)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default CommissionNotificationFeed;
