
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
 * Function to initialize auth from current session
 */
export async function initializeFromSession(
  updateSessionState: UpdateSessionStateFn,
  setLoading: (isLoading: boolean) => void,
  setError: (error: Error | null) => void,
  resetState: () => void,
  setIsInitialized: (isInitialized: boolean) => void
): Promise<void> {
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
        
        // Don't fatally fail - use the basic profile from the session
        // This is important to prevent a completely broken login experience
        const basicRoles = [AUTH_CONFIG.DEFAULT_ROLE];
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
        
        console.log('[AuthProvider] Session initialized with BASIC roles due to profile error');
        setIsInitialized(true);
        setLoading(false);
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
}
