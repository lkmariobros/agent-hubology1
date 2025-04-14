
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import { useNotificationActions } from '@/hooks/useNotificationActions';
import { useAuth } from '@/hooks/useAuth';

interface CommissionNotificationFeedProps {
  limit?: number;
  showMarkAllRead?: boolean;
  showFooter?: boolean;
}

const CommissionNotificationFeed: React.FC<CommissionNotificationFeedProps> = ({ 
  limit = 5,
  showMarkAllRead = true,
  showFooter = true
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { markAsRead, markAllAsRead, refreshNotifications } = useNotificationActions();
  
  // Filter for commission-related notifications
  const commissionTypes: string[] = [
    'approval_status_change',
    'tier_update',
    'commission_milestone',
    'transaction_status'
  ];
  
  const loadNotifications = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const allNotifications = await refreshNotifications(user.id);
      const commissionNotifications = allNotifications.filter(
        notification => commissionTypes.includes(notification.type)
      );
      setNotifications(commissionNotifications.slice(0, limit));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadNotifications();
  }, [user?.id]);
  
  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    await markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'approval_status_change':
        return 'bg-blue-100 text-blue-800';
      case 'tier_update':
        return 'bg-green-100 text-green-800';
      case 'commission_milestone':
        return 'bg-purple-100 text-purple-800';
      case 'transaction_status':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval_status_change':
        return <Badge className="bg-blue-100 text-blue-800">Approval</Badge>;
      case 'tier_update':
        return <Badge className="bg-green-100 text-green-800">Tier</Badge>;
      case 'commission_milestone':
        return <Badge className="bg-purple-100 text-purple-800">Milestone</Badge>;
      case 'transaction_status':
        return <Badge className="bg-amber-100 text-amber-800">Transaction</Badge>;
      default:
        return <Badge>System</Badge>;
    }
  };
  
  if (notifications.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Notifications</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-3" />
          <p className="text-muted-foreground">No commission notifications</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Commission Notifications</CardTitle>
            <CardDescription>Updates on your commissions and transactions</CardDescription>
          </div>
          {showMarkAllRead && notifications.some(n => !n.read) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark all read</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-md ${notification.read ? 'bg-muted/40' : 'bg-muted'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-center">
                    {getNotificationIcon(notification.type)}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <span className="sr-only">Mark as read</span>
                      <CheckCheck className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <h4 className="font-medium mt-1">{notification.title}</h4>
                <p className="text-sm">{notification.message}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      {showFooter && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="outline" size="sm" onClick={loadNotifications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="link" size="sm">
            View all notifications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommissionNotificationFeed;
