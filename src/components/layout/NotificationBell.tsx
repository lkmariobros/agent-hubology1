
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { useNotifications } from '@/context/NotificationContext';
import CommissionNotification from '../commission/CommissionNotification';

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications();

  // Helper function to determine commission notification type
  const getCommissionNotificationType = (notification: any) => {
    const { type, data } = notification;
    
    if (data?.notificationType) {
      return data.notificationType;
    }
    
    // Fallback mapping based on notification type
    switch (type) {
      case 'approval_status_change':
        return 'approval_approved';
      case 'tier_update':
        return 'tier_progress'; 
      case 'commission_milestone':
        return 'commission_milestone';
      default:
        return null; // Not a commission notification
    }
  };

  // Check if notification is a commission notification
  const isCommissionNotification = (notification: any) => {
    return ['approval_status_change', 'tier_update', 'commission_milestone'].includes(notification.type);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => {
            refreshNotifications();
          }}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 min-w-[18px] h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0" 
        align="end" 
        sideOffset={10}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-sm font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${notification.read ? '' : 'bg-muted/20'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {isCommissionNotification(notification) ? (
                    <CommissionNotification
                      type={getCommissionNotificationType(notification)}
                      title={notification.title}
                      message={notification.message}
                      commissionAmount={notification.data?.commissionAmount}
                      tierName={notification.data?.tierName}
                      progressPercentage={notification.data?.progressPercentage}
                      date={notification.data?.date || notification.createdAt}
                      compact={true}
                    />
                  ) : (
                    <div className="px-4 py-3">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
