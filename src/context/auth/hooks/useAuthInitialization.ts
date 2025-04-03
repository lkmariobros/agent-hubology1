
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthState } from '../useAuthState';
import { useAuthTimeout } from './useAuthTimeout';
import { handleAuthStateChange } from './useAuthStateChange';
import { initializeFromSession } from './useSessionInitializer';

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

  // Set up auth state change listener
  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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

    // Initialize session
    initializeFromSession(
      updateSessionState,
      setLoading,
      setError,
      resetState,
      setIsInitialized
    );
    
    return () => {
      console.log('[AuthProvider] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Only run on mount
  
  return {
    state,
    isInitialized,
    setLoading,
    setError,
    resetState,
    updateSessionState
  };
}
