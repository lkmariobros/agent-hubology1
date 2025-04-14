
import { useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '@/types/auth';
import { AuthState } from './types';

// Initial state for the auth context
const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  roles: [],
  activeRole: 'agent', // Default role
};

/**
 * Hook for managing authentication state
 */
export function useAuthState() {
  // Make sure we're in a React component environment
  if (typeof useState !== 'function') {
    throw new Error('useAuthState must be used within a React component or custom hook');
  }
  
  const [state, setState] = useState<AuthState>(initialState);
  
  const updateState = useCallback((newState: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);
  
  const setLoading = useCallback((isLoading: boolean) => {
    updateState({ loading: isLoading });
  }, [updateState]);
  
  const setError = useCallback((error: Error | null) => {
    updateState({ error });
    
    // Automatically set loading to false when an error occurs
    if (error) {
      updateState({ loading: false });
    }
  }, [updateState]);
  
  const setSession = useCallback((session: Session | null) => {
    updateState({ session });
  }, [updateState]);
  
  const setUser = useCallback((user: UserProfile | null) => {
    updateState({ user });
  }, [updateState]);
  
  const setProfile = useCallback((profile: any | null) => {
    updateState({ profile });
  }, [updateState]);
  
  const setRoles = useCallback((roles: UserRole[]) => {
    updateState({ roles });
  }, [updateState]);
  
  const setActiveRole = useCallback((activeRole: UserRole) => {
    updateState({ activeRole });
    
    // Also update the user's active role
    if (state.user) {
      setUser({ ...state.user, activeRole });
    }
  }, [state.user, updateState, setUser]);
  
  const resetState = useCallback(() => {
    setState({
      ...initialState,
      loading: false,
    });
  }, []);
  
  const updateSessionState = useCallback((
    session: Session | null, 
    user: UserProfile | null, 
    profile: any | null, 
    roles: UserRole[], 
    activeRole: UserRole
  ) => {
    setState({
      user,
      profile,
      session,
      loading: false,
      error: null,
      roles,
      activeRole,
    });
  }, []);
  
  return {
    state,
    setLoading,
    setError,
    setSession,
    setUser,
    setProfile,
    setRoles,
    setActiveRole,
    resetState,
    updateSessionState,
  };
}
