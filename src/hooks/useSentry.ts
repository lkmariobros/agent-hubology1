
import { captureException, captureMessage } from '@/lib/sentry';

/**
 * Hook for Sentry integration to track errors and user information
 */
export function useSentry() {
  /**
   * Log an error to Sentry
   */
  const logError = (error: Error, context?: Record<string, any>) => {
    captureException(error, context);
  };
  
  /**
   * Log a message to Sentry
   */
  const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    captureMessage(message, level);
  };
  
  /**
   * Set user information in Sentry
   */
  const setUser = (
    id: string, 
    email?: string | null, 
    username?: string | null, 
    extras?: Record<string, any>
  ) => {
    // In a real implementation, this would set the user context in Sentry
    console.log('Setting Sentry user context:', { id, email, username, ...extras });
  };
  
  /**
   * Clear user information from Sentry
   */
  const clearUser = () => {
    // In a real implementation, this would clear the user context in Sentry
    console.log('Clearing Sentry user context');
  };
  
  return {
    logError,
    logMessage,
    setUser,
    clearUser
  };
}
