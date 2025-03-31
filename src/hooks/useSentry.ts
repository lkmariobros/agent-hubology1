
import { useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { logger } from '@/services/logging';

export const useSentry = () => {
  const logError = useCallback((error: unknown, context?: Record<string, any>) => {
    // Log locally first
    logger.error(
      error instanceof Error ? error.message : String(error), 
      {
        stack: error instanceof Error ? error.stack : undefined,
        ...context
      }
    );
    
    // Send to Sentry in production
    if (import.meta.env.PROD) {
      Sentry.captureException(error, {
        contexts: { custom: context || {} }
      });
    }
  }, []);

  const setUser = useCallback((userId: string | null, email?: string | null) => {
    if (userId) {
      Sentry.setUser({ id: userId, email: email || undefined });
    } else {
      Sentry.setUser(null); // Clear user on logout
    }
  }, []);

  const addBreadcrumb = useCallback((message: string, category?: string, data?: Record<string, any>) => {
    Sentry.addBreadcrumb({
      message,
      category: category || 'app',
      data,
      level: 'info'
    });
  }, []);

  return {
    logError,
    setUser,
    addBreadcrumb
  };
};
