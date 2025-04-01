
import { useCallback } from 'react';
import * as Sentry from '@sentry/react';

export const useSentry = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && !!window.document;
  
  const logError = useCallback((error: unknown, context?: Record<string, any>) => {
    // Only log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged to Sentry:', error instanceof Error ? error.message : String(error));
    }
    
    // Only attempt to use Sentry if we're in a browser
    if (isBrowser) {
      try {
        Sentry.captureException(error, {
          contexts: { 
            custom: context || {},
            environment: {
              mode: import.meta.env.MODE,
              timestamp: new Date().toISOString()
            }
          }
        });
        
        if (import.meta.env.DEV) {
          console.log('Error sent to Sentry');
        }
      } catch (sentryError) {
        console.error('Failed to send error to Sentry:', sentryError);
      }
    }
  }, [isBrowser]);

  const setUser = useCallback((userId: string | null, email?: string | null, username?: string | null) => {
    if (!isBrowser) return;
    
    try {
      if (userId) {
        Sentry.setUser({ 
          id: userId, 
          email: email || undefined,
          username: username || undefined
        });
        
        if (import.meta.env.DEV) {
          console.log('Sentry user context set:', userId);
        }
      } else {
        Sentry.setUser(null);
        
        if (import.meta.env.DEV) {
          console.log('Sentry user context cleared');
        }
      }
    } catch (error) {
      console.error('Error setting Sentry user:', error);
    }
  }, [isBrowser]);

  const addBreadcrumb = useCallback((message: string, category?: string, data?: Record<string, any>) => {
    if (!isBrowser) return;
    
    try {
      Sentry.addBreadcrumb({
        message,
        category: category || 'app',
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        level: 'info'
      });
      
      if (import.meta.env.DEV) {
        console.log('Sentry breadcrumb added:', message);
      }
    } catch (error) {
      console.error('Error adding Sentry breadcrumb:', error);
    }
  }, [isBrowser]);

  return {
    logError,
    setUser,
    addBreadcrumb,
    Sentry: isBrowser ? Sentry : null
  };
};

export default useSentry;
