
import { useState } from 'react';
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
  const [state, setState] = useState<AuthState>(initialState);
  
  const updateState = (newState: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };
  
  const setLoading = (isLoading: boolean) => {
    updateState({ loading: isLoading });
  };
  
  const setError = (error: Error | null) => {
    updateState({ error });
  };
  
  const setSession = (session: Session | null) => {
    updateState({ session });
  };
  
  const setUser = (user: UserProfile | null) => {
    updateState({ user });
  };
  
  const setProfile = (profile: any | null) => {
    updateState({ profile });
  };
  
  const setRoles = (roles: UserRole[]) => {
    updateState({ roles });
  };
  
  const setActiveRole = (activeRole: UserRole) => {
    updateState({ activeRole });
    
    // Also update the user's active role
    if (state.user) {
      setUser({ ...state.user, activeRole });
    }
  };
  
  const resetState = () => {
    setState({
      ...initialState,
      loading: false,
    });
  };
  
  const updateSessionState = (
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
  };
  
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
