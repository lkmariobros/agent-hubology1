
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NotificationType } from '@/types/notification';

interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: 'high' | 'normal' | 'low';
}

interface NotificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

// Local storage key for tracking edge function usage
const EDGE_FUNCTION_USAGE_KEY = 'edge_function_usage_count';

// Get current usage count from localStorage
const getEdgeFunctionUsageCount = (): number => {
  const count = localStorage.getItem(EDGE_FUNCTION_USAGE_KEY);
  return count ? parseInt(count, 10) : 0;
};

// Increment usage count in localStorage
const incrementEdgeFunctionUsage = (): void => {
  const currentCount = getEdgeFunctionUsageCount();
  localStorage.setItem(EDGE_FUNCTION_USAGE_KEY, (currentCount + 1).toString());
};

// Check if we should use edge function based on priority
const shouldUseEdgeFunction = (priority: 'high' | 'normal' | 'low'): boolean => {
  // Always use edge function for high priority notifications
  if (priority === 'high') return true;
  
  // For normal priority, check if we're close to the limit
  if (priority === 'normal') {
    const usageCount = getEdgeFunctionUsageCount();
    // Allow edge function if we've used less than 400 invocations in this session
    return usageCount < 400;
  }
  
  // For low priority, use local fallback to save edge function invocations
  return false;
};

// Local fallback for non-critical notifications
const createLocalNotification = async (params: SendNotificationParams): Promise<NotificationResponse> => {
  try {
    console.log('Using local notification fallback instead of edge function');
    
    // Insert directly to the database to avoid edge function call
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        data: params.data || null,
        read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Local notification error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return {
      success: true,
      message: 'Notification created locally',
      data
    };
  } catch (error: any) {
    console.error('Error creating local notification:', error);
    throw error;
  }
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: SendNotificationParams): Promise<NotificationResponse> => {
      try {
        // Determine priority (default to normal)
        const priority = params.priority || 'normal';
        
        // Check if we should use edge function based on priority
        const useEdgeFunction = shouldUseEdgeFunction(priority);
        
        // If we're not using edge function, use local fallback
        if (!useEdgeFunction) {
          return await createLocalNotification(params);
        }
        
        console.log('Sending notification with params:', params);
        
        // Ensure data is a clean, serializable object by removing any circular references
        let cleanParams;
        try {
          // Create a deep clone by serializing and deserializing
          const clone = JSON.parse(JSON.stringify(params));
          
          // Clean up any undefined values which can cause issues
          cleanParams = Object.fromEntries(
            Object.entries(clone).filter(([_, v]) => v !== undefined)
          );
          
          console.log('Cleaned params for notification:', cleanParams);
        } catch (error) {
          console.error('Error serializing notification data:', error);
          throw new Error('Notification data contains circular references or non-serializable values');
        }
        
        // Track edge function usage
        incrementEdgeFunctionUsage();
        
        // Call the edge function with the cleaned parameters
        const { data: response, error } = await supabase.functions.invoke<NotificationResponse>(
          'create_notification',
          {
            body: cleanParams
          }
        );
        
        if (error) {
          console.error('Edge function error:', error);
          
          // If edge function fails, try local fallback
          console.log('Edge function failed, trying local fallback');
          return await createLocalNotification(params);
        }
        
        if (!response) {
          console.error('No response from edge function');
          throw new Error('No response from edge function');
        }
        
        if (!response.success) {
          console.error('Failed to send notification:', response.error || 'Unknown error');
          throw new Error(response.error || 'Failed to send notification');
        }
        
        console.log('Notification sent successfully:', response);
        
        return response;
      } catch (error: any) {
        console.error('Error sending notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate specific queries after a successful notification
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: Error) => {
      console.error('Notification mutation error:', error);
      toast.error(`Failed to send notification: ${error.message}`);
    }
  });
};
