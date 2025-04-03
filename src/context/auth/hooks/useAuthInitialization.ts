
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchProfileAndRoles } from '../authUtils';
import { useAuthState } from '../useAuthState';
import { toast } from 'sonner';
import { AUTH_CONFIG } from '../authConfig';
import { isSpecialAdminEmail, ensureAdminRoleForSpecialEmail, getPreferredActiveRole } from '../adminUtils';

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

  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');
    
    let authTimeout: number | undefined;
    
    // Set up auth state change listener first to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthProvider] Auth state changed:', event, !!session);
        
        // Handle the auth state change synchronously first
        if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider] User signed out');
          resetState();
          setIsInitialized(true);
          if (authTimeout) {
            clearTimeout(authTimeout);
            authTimeout = undefined;
          }
          setLoading(false);
          
          // Clear email cookie on signout
          document.cookie = `${AUTH_CONFIG.EMAIL_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          return;
        }
        
        // For other events that require async processing, use setTimeout to avoid deadlocks
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          // First update with just the session to show the user is logged in
          setLoading(true);
          
          // Set email in cookie for roleUtils to use
          if (session.user?.email) {
            document.cookie = `${AUTH_CONFIG.EMAIL_COOKIE_NAME}=${encodeURIComponent(session.user.email)}; path=/;`;
          }
          
          // Use setTimeout to avoid potential deadlocks with Supabase client
          setTimeout(async () => {
            try {
              console.log('[AuthProvider] Processing sign-in event');
              
              const { profile, userProfile, roles, activeRole } = 
                await fetchProfileAndRoles(session.user.id, session.user.email);
              
              // Ensure admin role for special admin email
              const finalRoles = ensureAdminRoleForSpecialEmail(roles, session.user.email);
              
              // Get preferred active role (admin takes precedence)
              const finalActiveRole = getPreferredActiveRole(finalRoles, activeRole);
              
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
              setIsInitialized(true);
              if (authTimeout) {
                clearTimeout(authTimeout);
                authTimeout = undefined;
              }
              setLoading(false);
            } catch (error) {
              console.error('[AuthProvider] Error processing auth state change:', error);
              setError(error instanceof Error ? error : new Error('Unknown error occurred'));
              setLoading(false);
              setIsInitialized(true);
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
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('[AuthProvider] Existing session found', session.user.id);
          
          // Set email in cookie for roleUtils to use
          if (session.user?.email) {
            document.cookie = `${AUTH_CONFIG.EMAIL_COOKIE_NAME}=${encodeURIComponent(session.user.email)}; path=/;`;
          }
          
          try {
            const { profile, userProfile, roles, activeRole } = 
              await fetchProfileAndRoles(session.user.id, session.user.email);
            
            // Ensure admin role for special admin email
            const finalRoles = ensureAdminRoleForSpecialEmail(roles, session.user.email);
            
            // Get preferred active role (admin takes precedence)
            const finalActiveRole = getPreferredActiveRole(finalRoles, activeRole);
            
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
            setIsInitialized(true);
            setLoading(false);
          } catch (profileError) {
            console.error('[AuthProvider] Error fetching profile:', profileError);
            setError(profileError instanceof Error ? profileError : new Error('Failed to load profile'));
            setLoading(false);
            setIsInitialized(true);
          }
        } else {
          console.log('[AuthProvider] No existing session found');
          resetState();
          setIsInitialized(true);
          setLoading(false);
          
          // Clear email cookie when no session
          document.cookie = `${AUTH_CONFIG.EMAIL_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      } catch (error) {
        console.error('[AuthProvider] Error during auth initialization:', error);
        setError(error instanceof Error ? error : new Error('Failed to initialize auth'));
        setLoading(false);
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
    
    // Set a timeout to avoid infinite loading
    authTimeout = window.setTimeout(() => {
      if (!isInitialized) {
        console.warn(`[AuthProvider] Auth initialization timed out after ${AUTH_CONFIG.INITIALIZATION_TIMEOUT/1000} seconds`);
        setError(new Error('Authentication verification timed out'));
        setLoading(false);
        setIsInitialized(true);
        toast.error('Authentication verification timed out. Please refresh the page.');
      }
    }, AUTH_CONFIG.INITIALIZATION_TIMEOUT);
    
    // Cleanup subscription and timeout on unmount
    return () => {
      console.log('[AuthProvider] Cleaning up auth subscription');
      subscription.unsubscribe();
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
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
