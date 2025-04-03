
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
  
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Setup timeout handling - must be called consistently
  const timeoutRef = useAuthTimeout(
    isInitialized,
    setError,
    setLoading,
    setIsInitialized
  );

  // Set up auth state change listener
  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');
    
    // Important: Set up auth listener first before checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Don't use async callback directly - handle with setTimeout
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

    // Then initialize from current session
    setTimeout(() => {
      initializeFromSession(
        updateSessionState,
        setLoading,
        setError,
        resetState,
        setIsInitialized
      );
    }, 0);
    
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
