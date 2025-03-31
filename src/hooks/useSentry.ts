
import { useCallback } from 'react';
import * as Sentry from '@sentry/react';

export const useSentry = () => {
  const logError = useCallback((error: unknown, context?: Record<string, any>) => {
    // Only log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged to Sentry:', error instanceof Error ? error.message : String(error));
    }
    
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
  }, []);

  const setUser = useCallback((userId: string | null, email?: string | null, username?: string | null) => {
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
  }, []);

  const addBreadcrumb = useCallback((message: string, category?: string, data?: Record<string, any>) => {
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
  }, []);

  return {
    logError,
    setUser,
    addBreadcrumb,
    Sentry
  };
};

export default useSentry;
