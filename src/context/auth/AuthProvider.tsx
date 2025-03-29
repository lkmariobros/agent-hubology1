
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './AuthContext';
import { UserRole, UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { fetchProfileAndRoles } from './authUtils';

// AuthProvider Props from types
import { AuthProviderProps, AuthState } from './types';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Effect to initialize auth session and subscribe to auth changes
  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');
    
    // First, set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthProvider] Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            if (session) {
              console.log('[AuthProvider] Processing sign-in event');
              
              const { profile, userProfile, roles, activeRole } = 
                await fetchProfileAndRoles(session.user.id, session.user.email);
              
              setState({
                user: userProfile,
                profile,
                session,
                loading: false,
                error: null,
                roles,
                activeRole,
              });
              
              console.log('[AuthProvider] Auth state updated after sign-in');
            }
          } catch (error) {
            console.error('[AuthProvider] Error processing auth state change:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error instanceof Error ? error : new Error('Unknown error occurred'),
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider] User signed out');
          setState({
            ...initialState,
            loading: false,
          });
        }
      }
    );
    
    // Then check for existing session
    const initializeAuth = async () => {
      try {
        console.log('[AuthProvider] Checking for existing session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('[AuthProvider] Existing session found', session.user.id);
          
          try {
            const { profile, userProfile, roles, activeRole } = 
              await fetchProfileAndRoles(session.user.id, session.user.email);
            
            setState({
              user: userProfile,
              profile,
              session,
              loading: false,
              error: null,
              roles,
              activeRole,
            });
            
            console.log('[AuthProvider] Session initialized with roles', roles);
          } catch (profileError) {
            console.error('[AuthProvider] Error fetching profile:', profileError);
            setState({
              ...initialState,
              loading: false,
              error: profileError instanceof Error ? profileError : new Error('Failed to load profile'),
            });
          }
        } else {
          console.log('[AuthProvider] No existing session found');
          setState({
            ...initialState,
            loading: false,
          });
        }
      } catch (error) {
        console.error('[AuthProvider] Error during auth initialization:', error);
        setState({
          ...initialState,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to initialize auth'),
        });
      }
    };
    
    // Initialize auth
    initializeAuth();
    
    // Cleanup subscription on unmount
    return () => {
      console.log('[AuthProvider] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);
  
  // Authentication methods
  const signIn = async (email: string, password: string) => {
    console.log(`[AuthProvider] Attempting to sign in user: ${email}`);
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('[AuthProvider] Sign in error:', error.message);
        toast.error(`Sign in failed: ${error.message}`);
        setState(prev => ({
          ...prev,
          error,
          loading: false,
        }));
        throw error;
      }
      
      console.log('[AuthProvider] Sign in successful, auth state change listener will update state');
      // The auth state change listener will update the state
    } catch (error) {
      console.error('[AuthProvider] Sign in execution error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign in failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error('[AuthProvider] Sign up error:', error.message);
        toast.error(`Sign up failed: ${error.message}`);
        setState(prev => ({
          ...prev,
          error,
          loading: false,
        }));
        throw error;
      }
      
      toast.success('Sign up successful! Please verify your email.');
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('[AuthProvider] Sign up execution error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign up failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[AuthProvider] Sign out error:', error.message);
        toast.error(`Sign out failed: ${error.message}`);
        setState(prev => ({
          ...prev,
          error,
          loading: false,
        }));
        throw error;
      }
      
      console.log('[AuthProvider] Sign out successful');
      // The auth state change listener will reset the state
    } catch (error) {
      console.error('[AuthProvider] Sign out execution error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign out failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        console.error('[AuthProvider] Reset password error:', error.message);
        toast.error(`Password reset failed: ${error.message}`);
        setState(prev => ({
          ...prev,
          error,
          loading: false,
        }));
        throw error;
      }
      
      toast.success('Password reset instructions sent to your email');
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('[AuthProvider] Reset password execution error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Password reset failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const switchRole = (role: UserRole) => {
    if (state.roles.includes(role)) {
      setState(prev => ({
        ...prev,
        activeRole: role,
        user: prev.user ? { ...prev.user, activeRole: role } : null,
      }));
    } else {
      toast.error(`You do not have the ${role} role`);
    }
  };
  
  const hasRole = (role: UserRole) => {
    return state.roles.includes(role);
  };
  
  // Prepare the auth context value
  const authContextValue = {
    user: state.user,
    profile: state.profile,
    session: state.session,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.session,
    isAdmin: state.roles.includes('admin'),
    roles: state.roles,
    activeRole: state.activeRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    switchRole,
    hasRole,
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
