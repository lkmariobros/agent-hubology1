
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

  useEffect(() => {
    // Always create the timeout when the hook is mounted
    timeoutRef.current = window.setTimeout(() => {
      console.warn(`[AuthProvider] Auth initialization timed out after ${AUTH_CONFIG.INITIALIZATION_TIMEOUT/1000} seconds`);
      setError(new Error('Authentication verification timed out'));
      setLoading(false);
      setIsInitialized(true);
      toast.error('Authentication verification timed out. Please refresh the page.');
    }, AUTH_CONFIG.INITIALIZATION_TIMEOUT);

    // Clean up timeout on unmount or when initialized
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []); // Only run on mount

  // If initialized, clear the timeout
  useEffect(() => {
    if (isInitialized && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, [isInitialized]);

  return timeoutRef;
}
