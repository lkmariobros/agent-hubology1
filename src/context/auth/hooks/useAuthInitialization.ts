
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthState } from '../useAuthState';
import { useAuthTimeout } from './useAuthTimeout';
import { handleAuthStateChange } from './useAuthStateChange';
import { initializeFromSession } from './useSessionInitializer';

/**
 * Hook to handle authentication initialization and state change subscription
 */
export function useAuthInitialization() {
  const {
    state,
    setLoading,
    setError,
    resetState,
    updateSessionState,
  } = useAuthState();
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Setup timeout handling
  const timeoutRef = useAuthTimeout(
    isInitialized,
    setError,
    setLoading,
    setIsInitialized
  );

  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');
    
    // Set up auth state change listener first to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleAuthStateChange(
          event,
          session,
          updateSessionState,
          setLoading,
          setError,
          resetState,
          setIsInitialized,
          timeoutRef
        );
      }
    );
    
    // Then get the current session to initialize the auth state
    initializeFromSession(
      updateSessionState,
      setLoading,
      setError,
      resetState,
      setIsInitialized
    );
    
    // Cleanup subscription on unmount
    return () => {
      console.log('[AuthProvider] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);
  
  return {
    state,
    isInitialized,
    setLoading,
    setError,
    resetState,
    updateSessionState
  };
}
