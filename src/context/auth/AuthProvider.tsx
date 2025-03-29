
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './AuthContext';
import { UserRole, UserProfile } from '@/types/auth';
import { toast } from 'sonner';

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
    console.log('AuthProvider: Setting up auth listener');
    
    // Function to get and set the initial session
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If there's a session, get the user's profile and roles
        if (session) {
          // Fetch user profile from the agent_profiles table
          const { data: profile } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          // Determine roles based on tier (temporary mapping)
          let roles: UserRole[] = ['agent', 'viewer']; // Everyone has basic roles
          
          if (profile) {
            const tier = profile.tier || 1;
            
            // Map tiers to roles
            if (tier >= 5) roles.push('admin');
            if (tier >= 4) roles.push('team_leader');
            if (tier >= 3) roles.push('manager');
            if (tier >= 2) roles.push('finance');
          }
          
          // Set the default active role (prefer admin if available)
          const activeRole = roles.includes('admin') ? 'admin' : roles[0] || 'agent';
          
          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
            roles: roles,
            activeRole: activeRole,
          };
          
          setState({
            user: userProfile,
            profile,
            session,
            loading: false,
            error: null,
            roles,
            activeRole,
          });
          
          console.log('AuthProvider: Auth session initialized with roles', roles);
        } else {
          // No session, reset state
          setState({
            ...initialState,
            loading: false,
          });
          console.log('AuthProvider: No auth session found');
        }
      } catch (error) {
        console.error('AuthProvider: Error initializing auth', error);
        setState({
          ...initialState,
          error: error instanceof Error ? error : new Error('Unknown error occurred'),
          loading: false,
        });
      }
    };
    
    // Initialize auth immediately
    initializeAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            if (session) {
              // Fetch user profile from the agent_profiles table
              const { data: profile } = await supabase
                .from('agent_profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              // Determine roles based on tier
              let roles: UserRole[] = ['agent', 'viewer']; // Everyone has basic roles
              
              if (profile) {
                const tier = profile.tier || 1;
                
                // Map tiers to roles
                if (tier >= 5) roles.push('admin');
                if (tier >= 4) roles.push('team_leader');
                if (tier >= 3) roles.push('manager');
                if (tier >= 2) roles.push('finance');
              }
              
              const activeRole = roles.includes('admin') ? 'admin' : roles[0] || 'agent';
              
              const userProfile: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
                roles: roles,
                activeRole: activeRole,
              };
              
              setState({
                user: userProfile,
                profile,
                session,
                loading: false,
                error: null,
                roles,
                activeRole,
              });
            }
          } catch (error) {
            console.error('AuthProvider: Error updating auth state', error);
            toast.error('Error updating authentication state');
          }
        } else if (event === 'SIGNED_OUT') {
          setState({
            ...initialState,
            loading: false,
          });
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Authentication methods
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('AuthProvider: Sign in error', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign in failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Sign up successful! Please verify your email.');
    } catch (error) {
      console.error('AuthProvider: Sign up error', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign up failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('AuthProvider: Sign out error', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign out failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('AuthProvider: Reset password error', error);
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
