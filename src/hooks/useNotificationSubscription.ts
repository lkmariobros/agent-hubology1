
import { useEffect, useRef } from 'react';

export const useNotificationSubscription = (userId: string | null, callback: Function) => {
  const callbackRef = useRef<Function>(callback);
  
  // Update callback ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  useEffect(() => {
    if (!userId) return;
    
    console.log(`Setting up notification subscription for user ${userId}`);
    
    // In a real implementation, this would set up a subscription to a real-time service
    // For demonstration, let's setup a mock notification every 30 seconds
    const mockNotificationInterval = setInterval(() => {
      const mockNotification = {
        id: `notification-${Date.now()}`,
        title: 'New Activity',
        message: 'You have a new notification.',
        read: false,
        createdAt: new Date(),
        userId: userId,
        type: 'info'
      };
      
      callbackRef.current(mockNotification);
    }, 30000); // Every 30 seconds
    
    // Clean up subscription on unmount or when userId changes
    return () => {
      console.log(`Cleaning up notification subscription for user ${userId}`);
      clearInterval(mockNotificationInterval);
    };
  }, [userId]);
};
