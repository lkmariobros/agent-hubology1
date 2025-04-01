import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface SendTestNotificationProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const SendTestNotification: React.FC<SendTestNotificationProps> = ({ 
  variant = 'outline',
  size = 'sm'
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const sendNotification = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }
    
    setLoading(true);
    
    try {
      // Send a test notification using the edge function
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          userId: user.id,
          type: 'test',
          title: 'Test Notification',
          message: 'This is a test notification from the system.',
          data: {
            testId: 'test-123',
            timestamp: new Date().toISOString()
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Test notification sent successfully!');
      console.log('Notification response:', data);
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={sendNotification}
      disabled={loading}
    >
      {loading ? 'Sending...' : 'Send Test Notification'}
    </Button>
  );
};

export default SendTestNotification;
