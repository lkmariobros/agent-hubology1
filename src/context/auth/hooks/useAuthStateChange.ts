
import { supabase } from '@/lib/supabase';
import { fetchProfileAndRoles } from '../authUtils';
import { ensureAdminRoleForSpecialEmail, getPreferredActiveRole } from '../adminUtils';
import { AUTH_CONFIG } from '../authConfig';
import { Session } from '@supabase/supabase-js';

type UpdateSessionStateFn = (
  session: Session | null,
  user: any,
  profile: any,
  roles: any,
  activeRole: any
) => void;

/**
 * Function to handle auth state change events
 */
export async function handleAuthStateChange(
  event: string,
  session: Session | null,
  updateSessionState: UpdateSessionStateFn,
  setLoading: (isLoading: boolean) => void,
  setError: (error: Error | null) => void,
  resetState: () => void,
  setIsInitialized: (isInitialized: boolean) => void,
  timeoutRef: React.MutableRefObject<number | undefined>
): Promise<void> {
  console.log('[AuthProvider] Auth state changed:', event, !!session);
      
  // Handle the auth state change synchronously first
  if (event === 'SIGNED_OUT') {
    console.log('[AuthProvider] User signed out');
    resetState();
    setIsInitialized(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setLoading(false);
    
    // Clear email cookie on signout
    document.cookie = `${AUTH_CONFIG.EMAIL_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    return;
  }
  
  // For other events that require async processing, use setTimeout to avoid deadlocks
  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
    // First update with just the session to show the user is logged in
    setLoading(true);
    
    // Set email in cookie for roleUtils to use
    if (session.user?.email) {
      document.cookie = `${AUTH_CONFIG.EMAIL_COOKIE_NAME}=${encodeURIComponent(session.user.email)}; path=/;`;
    }
    
    // CRITICAL: Use setTimeout to avoid potential deadlocks with Supabase client
    const timeoutId = setTimeout(async () => {
      try {
        console.log('[AuthProvider] Processing sign-in event');
        
        const { profile, userProfile, roles, activeRole } = 
          await fetchProfileAndRoles(session.user.id, session.user.email);
        
        // Ensure admin role for special admin email
        const finalRoles = ensureAdminRoleForSpecialEmail(roles, session.user.email);
        
        // Get preferred active role (admin takes precedence)
        const finalActiveRole = getPreferredActiveRole(finalRoles, activeRole);
        
        // Update session state
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
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
        setLoading(false);
      } catch (error) {
        console.error('[AuthProvider] Error processing auth state change:', error);
        
        // Even on error, we need to provide a basic session state
        // This ensures the UI can still function even if profile fetching fails
        if (session) {
          const basicRoles = ['agent'];
          const finalRoles = ensureAdminRoleForSpecialEmail(basicRoles, session.user.email);
          const finalActiveRole = getPreferredActiveRole(finalRoles);
          
          updateSessionState(
            session,
            {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || '',
              roles: finalRoles,
              activeRole: finalActiveRole
            },
            null,
            finalRoles,
            finalActiveRole
          );
        }
        
        setError(error instanceof Error ? error : new Error('Unknown error occurred'));
        setLoading(false);
        setIsInitialized(true);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
      }
    }, 0);
    
    // Store the timeout ID in case we need to clear it
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = timeoutId;
  }
}
