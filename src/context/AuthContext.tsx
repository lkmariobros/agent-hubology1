
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseUtils } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth';
import { logger } from '@/services/logging';

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Creates a user profile from Supabase user data and roles
 */
const createUserProfile = async (user: User): Promise<UserProfile> => {
  // Get roles from agent_profiles tier-based fallback method
  const roles: UserRole[] = await supabaseUtils.getRoles();
  
  // Default to agent role if no roles returned
  if (!roles || !roles.length) {
    const defaultRoles: UserRole[] = ['agent'];
    return {
      id: user.id,
      email: user.email || '',
      name: user.email?.split('@')[0] || '',
      roles: defaultRoles,
      activeRole: defaultRoles[0],
    };
  }
  
  // Set active role (prefer admin if available, otherwise first role)
  const activeRole = roles.includes('admin') ? 'admin' : roles[0];
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.email?.split('@')[0] || '',
    roles,
    activeRole,
  };
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // Core auth state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<UserRole[]>(['agent']);
  const [activeRole, setActiveRole] = useState<UserRole>('agent');
  
  // Fetch user profile and roles
  const fetchProfileAndRoles = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      setProfile(profileData);
      
      // Get full user profile with roles
      const userProfile = await createUserProfile({ id: userId } as User);
      setUser(userProfile);
      setRoles(userProfile.roles);
      setActiveRole(userProfile.activeRole);
      
      // Set active role based on URL or saved preference
      if (location.pathname.startsWith('/admin')) {
        if (userProfile.roles.includes('admin')) {
          setActiveRole('admin');
        }
      } else {
        const savedRole = localStorage.getItem('user-role') as UserRole;
        if (savedRole && userProfile.roles.includes(savedRole)) {
          setActiveRole(savedRole);
        }
      }
    } catch (err) {
      logger.error('Error fetching user profile or roles', { userId, error: err });
      setError(err instanceof Error ? err : new Error('Failed to fetch profile or roles'));
    }
  };
  
  // Initialize auth state and set up listener for auth changes
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        
        if (newSession?.user) {
          try {
            // Create user profile from session user with roles
            await fetchProfileAndRoles(newSession.user.id);
          } catch (err) {
            console.error('Error creating user profile:', err);
            // Still set basic user info even if role fetch fails
            setUser({
              id: newSession.user.id,
              email: newSession.user.email || '',
              name: newSession.user.email?.split('@')[0] || '',
              roles: ['agent'],
              activeRole: 'agent',
            });
          }
        } else {
          // Clear user when session is null
          setUser(null);
          setProfile(null);
          setRoles(['agent']);
          setActiveRole('agent');
        }
        
        setLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully');
          
          // Navigate to dashboard if on landing page
          if (location.pathname === '/') {
            navigate('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out successfully');
          navigate('/');
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        try {
          // Create user profile from session user with roles
          await fetchProfileAndRoles(initialSession.user.id);
        } catch (err) {
          console.error('Error creating user profile:', err);
          // Still set basic user info even if role fetch fails
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            name: initialSession.user.email?.split('@')[0] || '',
            roles: ['agent'],
            activeRole: 'agent',
          });
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err);
      toast.error(`Error signing in: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      toast.success('Sign up successful! Please check your email for confirmation.');
    } catch (err: any) {
      setError(err);
      toast.error(`Error signing up: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      localStorage.removeItem('user-role');
    } catch (err: any) {
      setError(err);
      toast.error(`Error signing out: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send a password reset email
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email!');
    } catch (err: any) {
      setError(err);
      toast.error(`Error resetting password: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Switch between available user roles
   */
  const switchRole = (role: UserRole): void => {
    if (!user) return;
    
    // Verify user has the requested role
    if (!user.roles.includes(role)) {
      toast.error(`You do not have access to the ${role} role`);
      return;
    }
    
    // Update user with new active role
    setActiveRole(role);
    localStorage.setItem('user-role', role);
    
    // Update user state
    setUser({
      ...user,
      activeRole: role
    });
    
    // Navigate based on role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
    
    toast.success(`Switched to ${role} portal`);
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return !!user && user.roles.includes(role);
  };

  // Derived properties
  const isAuthenticated = !!user;
  const isAdmin = !!user && user.roles.includes('admin');

  // Context value
  const contextValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    roles,
    activeRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    switchRole,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Alias for useAuthContext for backward compatibility
 */
export const useAuth = useAuthContext;
