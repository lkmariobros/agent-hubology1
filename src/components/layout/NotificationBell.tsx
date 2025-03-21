
import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  CheckCheck,
  Clock,
  AlertTriangle,
  Ban,
  CircleCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { useNotifications, Notification } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    refreshNotifications 
  } = useNotifications();

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const getNotificationIcon = (type: string, data?: Record<string, any>) => {
    if (type === 'approval') {
      const status = data?.status || '';
      switch (status) {
        case 'Approved':
          return <CircleCheck className="h-4 w-4 text-green-500" />;
        case 'Under Review':
          return <Clock className="h-4 w-4 text-blue-500" />;
        case 'Rejected':
          return <Ban className="h-4 w-4 text-red-500" />;
        case 'Ready for Payment':
          return <CircleCheck className="h-4 w-4 text-purple-500" />;
        case 'Paid':
          return <Check className="h-4 w-4 text-gray-500" />;
        default:
          return <Bell className="h-4 w-4 text-muted-foreground" />;
      }
    }
    
    if (type === 'system') {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    
    return <Bell className="h-4 w-4 text-muted-foreground" />;
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
              <CheckCheck className="h-4 w-4 mr-1" />
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
              {notifications.map((notification: Notification) => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${notification.read ? '' : 'bg-muted/20'}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type, notification.data)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                          {notification.title}
                        </p>
                        <div className="flex space-x-1">
                          <button onClick={(e) => handleDelete(notification.id, e)} className="text-muted-foreground hover:text-foreground">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
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
