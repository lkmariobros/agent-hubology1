
import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './AuthContext';
import { UserRole } from '@/types/auth';
import { fetchProfileAndRoles } from './authUtils';
import { authService } from './authService';
import { useAuthState } from './useAuthState';
import { roleUtils } from './roleUtils';
import { toast } from 'sonner';
import { isSpecialAdmin, ensureAdminRole } from '@/utils/adminAccess';

// AuthProvider Props
import { AuthProviderProps } from './types';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use custom hook for auth state management
  const {
    state,
    setLoading,
    setError,
    resetState,
    updateSessionState,
  } = useAuthState();

  // Effect to initialize auth session and subscribe to auth changes
  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');
    
    let authTimeout: number | undefined;
    let isInitialized = false;
    
    // Set up auth state change listener first to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthProvider] Auth state changed:', event, !!session);
        
        // Handle the auth state change synchronously first
        if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider] User signed out');
          resetState();
          isInitialized = true;
          if (authTimeout) {
            clearTimeout(authTimeout);
            authTimeout = undefined;
          }
          setLoading(false);
          
          // Clear email cookie on signout
          document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          return;
        }
        
        // For other events that require async processing, use setTimeout to avoid deadlocks
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          // First update with just the session to show the user is logged in
          setLoading(true);
          
          // Set email in cookie for roleUtils to use
          if (session.user?.email) {
            document.cookie = `userEmail=${encodeURIComponent(session.user.email)}; path=/;`;
          }
          
          // Use setTimeout to avoid potential deadlocks with Supabase client
          setTimeout(async () => {
            try {
              console.log('[AuthProvider] Processing sign-in event');
              
              const { profile, userProfile, roles, activeRole } = 
                await fetchProfileAndRoles(session.user.id, session.user.email);
              
              // Handle special admin access with the utility function
              let finalRoles = [...roles] as UserRole[];
              let finalActiveRole = activeRole as UserRole;
              
              if (isSpecialAdmin(session.user.email)) {
                console.log('[AuthProvider] Admin email detected, forcing admin role');
                finalRoles = ensureAdminRole(finalRoles as string[], session.user.email) as UserRole[];
                if (finalRoles.includes('admin' as UserRole)) {
                  finalActiveRole = 'admin' as UserRole;
                }
              }
              
              updateSessionState(
                session,
                {
                  ...userProfile,
                  roles: finalRoles,
                  activeRole: finalActiveRole
                },
                profile,
                finalRoles,
                finalActiveRole
              );
              
              console.log('[AuthProvider] Auth state updated after sign-in');
              isInitialized = true;
              if (authTimeout) {
                clearTimeout(authTimeout);
                authTimeout = undefined;
              }
              setLoading(false);
            } catch (error) {
              console.error('[AuthProvider] Error processing auth state change:', error);
              setError(error instanceof Error ? error : new Error('Unknown error occurred'));
              setLoading(false);
              isInitialized = true;
              if (authTimeout) {
                clearTimeout(authTimeout);
                authTimeout = undefined;
              }
            }
          }, 0);
        }
      }
    );
    
    // Then get the current session to initialize the auth state
    const initializeAuth = async () => {
      try {
        console.log('[AuthProvider] Checking for existing session');
        setLoading(true);
        
        const { data: { session } } = await authService.getSession();
        
        if (session) {
          console.log('[AuthProvider] Existing session found', session.user.id);
          
          // Set email in cookie for roleUtils to use
          if (session.user?.email) {
            document.cookie = `userEmail=${encodeURIComponent(session.user.email)}; path=/;`;
          }
          
          try {
            const { profile, userProfile, roles, activeRole } = 
              await fetchProfileAndRoles(session.user.id, session.user.email);
            
            // Handle special admin access using the centralized utility
            let finalRoles = [...roles] as UserRole[];
            let finalActiveRole = activeRole as UserRole;
            
            if (isSpecialAdmin(session.user.email)) {
              console.log('[AuthProvider] Admin email detected, forcing admin role');
              finalRoles = ensureAdminRole(finalRoles as string[], session.user.email) as UserRole[];
              if (finalRoles.includes('admin' as UserRole)) {
                finalActiveRole = 'admin' as UserRole;
              }
            }
            
            updateSessionState(
              session,
              {
                ...userProfile,
                roles: finalRoles,
                activeRole: finalActiveRole
              },
              profile,
              finalRoles,
              finalActiveRole
            );
            
            console.log('[AuthProvider] Session initialized with roles', finalRoles);
            isInitialized = true;
            setLoading(false);
          } catch (profileError) {
            console.error('[AuthProvider] Error fetching profile:', profileError);
            setError(profileError instanceof Error ? profileError : new Error('Failed to load profile'));
            setLoading(false);
            isInitialized = true;
          }
        } else {
          console.log('[AuthProvider] No existing session found');
          resetState();
          isInitialized = true;
          setLoading(false);
          
          // Clear email cookie when no session
          document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      } catch (error) {
        console.error('[AuthProvider] Error during auth initialization:', error);
        setError(error instanceof Error ? error : new Error('Failed to initialize auth'));
        setLoading(false);
        isInitialized = true;
      }
    };
    
    initializeAuth();
    
    // Set a timeout to avoid infinite loading - increased to 30s
    authTimeout = window.setTimeout(() => {
      if (!isInitialized) {
        console.warn('[AuthProvider] Auth initialization timed out after 30 seconds');
        setError(new Error('Authentication verification timed out'));
        setLoading(false);
        toast.error('Authentication verification timed out. Please refresh the page.');
      }
    }, 30000); 
    
    // Cleanup subscription and timeout on unmount
    return () => {
      console.log('[AuthProvider] Cleaning up auth subscription');
      subscription.unsubscribe();
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
    };
  }, []);
  
  // Authentication methods
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signIn(email, password);
      // The auth state change listener will update the state
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Sign in failed'));
      setLoading(false);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signUp(email, password);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Sign up failed'));
      setLoading(false);
      throw error;
    }
  };
  
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
      // The auth state change listener will reset the state
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Sign out failed'));
      setLoading(false);
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.resetPassword(email);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Password reset failed'));
      setLoading(false);
      throw error;
    }
  };
  
  // Role management methods
  const switchRole = (role: UserRole) => {
    roleUtils.switchRole(state.roles as UserRole[], role, (newRole) => {
      // Update state with new role
      const newState = {
        ...state,
        activeRole: newRole,
        user: state.user ? { ...state.user, activeRole: newRole } : null,
      };
      
      updateSessionState(
        newState.session,
        newState.user,
        newState.profile,
        newState.roles as UserRole[],
        newState.activeRole as UserRole
      );
    });
  };
  
  const hasRole = (role: UserRole) => {
    // Special case for admin email
    if (role === 'admin' && state.user?.email === 'josephkwantum@gmail.com') {
      return true;
    }
    return roleUtils.hasRole(state.roles as UserRole[], role);
  };

  // Create a proper context value
  const createContextValue = () => {
    if (state.loading) {
      return {
        user: null,
        profile: null,
        session: null,
        loading: true,
        error: state.error,
        isAuthenticated: false,
        isAdmin: false,
        roles: [],
        activeRole: 'agent' as UserRole,
        signIn: async () => {
          toast.error('Authentication system is still initializing. Please try again.');
          throw new Error('Auth system initializing');
        },
        signUp: async () => {
          toast.error('Authentication system is still initializing. Please try again.');
          throw new Error('Auth system initializing');
        },
        signOut: async () => {
          toast.error('Authentication system is still initializing. Please try again.');
          throw new Error('Auth system initializing');
        },
        resetPassword: async () => {
          toast.error('Authentication system is still initializing. Please try again.');
          throw new Error('Auth system initializing');
        },
        switchRole: () => {
          toast.error('Authentication system is still initializing. Please try again.');
        },
        hasRole: () => false,
      };
    }
    
    return {
      user: state.user,
      profile: state.profile,
      session: state.session,
      loading: state.loading,
      error: state.error,
      isAuthenticated: !!state.session,
      isAdmin: state.roles.includes('admin' as UserRole),
      roles: state.roles as UserRole[],
      activeRole: state.activeRole as UserRole,
      signIn,
      signUp,
      signOut,
      resetPassword,
      switchRole,
      hasRole,
    };
  };
  
  return (
    <AuthContext.Provider value={createContextValue()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
