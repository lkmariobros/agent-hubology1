
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AUTH_CONFIG } from '../authConfig';

export function useAuthTimeout(
  isInitialized: boolean,
  setError: (error: Error | null) => void,
  setLoading: (isLoading: boolean) => void,
  setIsInitialized: (isInitialized: boolean) => void
) {
  const timeoutRef = useRef<number | undefined>();

  // Set up initial timeout
  useEffect(() => {
    // Create timeout only when not initialized
    if (!isInitialized && !timeoutRef.current) {
      console.log('[AuthProvider] Setting up auth timeout');
      timeoutRef.current = window.setTimeout(() => {
        console.warn(`[AuthProvider] Auth initialization timed out after ${AUTH_CONFIG.INITIALIZATION_TIMEOUT/1000} seconds`);
        setError(new Error('Authentication verification timed out'));
        setLoading(false);
        setIsInitialized(true);
        toast.error('Authentication verification timed out. Please refresh the page.');
      }, AUTH_CONFIG.INITIALIZATION_TIMEOUT);
    }

    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, [isInitialized, setError, setLoading, setIsInitialized]);

  // Separate effect to clear timeout when initialized
  useEffect(() => {
    if (isInitialized && timeoutRef.current) {
      console.log('[AuthProvider] Auth initialized, clearing timeout');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, [isInitialized]);

  return timeoutRef;
}
