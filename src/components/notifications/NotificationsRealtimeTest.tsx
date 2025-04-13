import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  clerk_id: string;
  user_id?: string;
}

const NotificationsRealtimeTest: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [realtimeStatus, setRealtimeStatus] = useState('Initializing...');
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken, userId } = useAuth();

  // Get and store JWT token for debugging
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        setJwtToken(token);
        console.log("JWT Token obtained:", token ? "Success" : "Failed");
      } catch (err) {
        console.error("Error getting token:", err);
        setError("Failed to get JWT token");
      }
    };
    
    fetchToken();
  }, [getToken]);

  // Function to load notifications
  const loadNotifications = async () => {
    setError(null);
    try {
      const token = await getToken({ template: 'supabase' });
      
      if (token) {
        // Set the JWT token for this request
        supabase.auth.setSession({ access_token: token, refresh_token: '' });
      } else {
        setError("No JWT token available");
        return;
      }

      console.log("Loading notifications safely...");
      
      // Try the safer approach
      const { data, error: supaError } = await supabase.rpc('safe_view_user_notifications', {
        clerk_id_param: userId
      });

      if (supaError) {
        console.error("Error loading notifications:", supaError);
        throw supaError;
      }
      
      console.log('Loaded notifications:', data);
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(`Failed to load notifications: ${error.message || error}`);
      toast.error('Failed to load notifications');
    }
  };

  // Create a test notification
  const createTestNotification = async () => {
    setError(null);
    try {
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        setError("No JWT token available for creating notification");
        toast.error("Authentication token unavailable");
        return;
      }
      
      // Set the JWT token for this request
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      
      console.log("Calling test_notifications_setup function...");
      const { data, error: supaError } = await supabase.rpc('test_notifications_setup');
      
      if (supaError) {
        console.error("Supabase RPC error:", supaError);
        throw supaError;
      }
      
      console.log('Test notification created:', data);
      toast.success('Test notification created successfully');
      
      // Reload notifications to show the new one
      loadNotifications();
    } catch (error) {
      console.error('Error creating test notification:', error);
      setError(`Failed to create test notification: ${error.message || error}`);
      toast.error(`Failed to create test notification: ${error.message || error}`);
    }
  };

  // Create a notification via safe function
  const createDirectNotification = async () => {
    setError(null);
    try {
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        setError("No JWT token available for creating notification");
        toast.error("Authentication token unavailable");
        return;
      }
      
      // Set the JWT token for this request
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      
      console.log("Using safe function to insert notification...");
      const { data, error: supaError } = await supabase.rpc('safe_insert_notification', {
        clerk_id_param: userId,
        title_param: 'Safe Test Notification',
        message_param: 'This is a notification created with a safe insert function',
        type_param: 'test'
      });
      
      if (supaError) {
        console.error("Supabase RPC error:", supaError);
        throw supaError;
      }
      
      console.log('Notification inserted safely:', data);
      toast.success('Notification created successfully');
      
      // Reload notifications to show the new one
      loadNotifications();
    } catch (error) {
      console.error('Error with safe notification:', error);
      setError(`Failed to create notification: ${error.message || error}`);
      toast.error(`Failed to create notification: ${error.message || error}`);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    setError(null);
    try {
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        setError("No JWT token available for marking as read");
        return;
      }
      
      // Set the JWT token for this request
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
      
      const { data, error: supaError } = await supabase.rpc('mark_notification_read', {
        notification_id_param: id
      });
      
      if (supaError) throw supaError;
      
      console.log('Marked as read:', data);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError(`Failed to mark as read: ${error.message || error}`);
      toast.error('Failed to mark notification as read');
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    loadNotifications();

    // Set up realtime subscription
    const subscription = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          setRealtimeStatus(`Update received at ${new Date().toLocaleTimeString()}`);
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            
            toast(newNotification.title, {
              description: newNotification.message,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as Notification;
            setNotifications(prev => 
              prev.map(notification => 
                notification.id === updatedNotification.id ? updatedNotification : notification
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setNotifications(prev => 
              prev.filter(notification => notification.id !== deletedId)
            );
          }
        }
      )
      .subscribe((status, err) => {
        console.log('Subscription status:', status, err);
        setRealtimeStatus(`Subscription status: ${status}`);
        
        if (status === 'SUBSCRIBED') {
          toast.success('Connected to real-time notifications');
        } else if (status === 'CHANNEL_ERROR') {
          toast.error('Error connecting to real-time notifications');
          setError(`Realtime connection error: ${err?.message || status}`);
        }
      });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notifications Realtime Test</CardTitle>
        <div className="text-sm text-gray-500">{realtimeStatus}</div>
        <div className="text-sm text-blue-500">User ID: {userId}</div>
        {jwtToken && <div className="text-xs text-green-500">JWT Token Available</div>}
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button onClick={createTestNotification}>
            Create Test Notification
          </Button>
          <Button onClick={createDirectNotification} variant="secondary">
            Direct Insert
          </Button>
          <Button onClick={loadNotifications} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      ID: {notification.id.substring(0, 8)}...
                    </div>
                    <div className="text-xs text-green-400">
                      Clerk ID: {notification.clerk_id?.substring(0, 8)}...
                    </div>
                  </div>
                  <Button
                    onClick={() => markAsRead(notification.id)}
                    variant={notification.read ? "ghost" : "secondary"}
                    disabled={notification.read}
                    size="sm"
                  >
                    {notification.read ? 'Read' : 'Mark as Read'}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No notifications yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsRealtimeTest;