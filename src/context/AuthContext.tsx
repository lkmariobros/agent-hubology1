
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseUtils } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth';

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Creates a user profile from Supabase user data and roles
 */
const createUserProfile = async (user: User): Promise<UserProfile> => {
  // Get roles from the user_roles table
  const roles: UserRole[] = await supabaseUtils.getRoles();
  
  // Default to agent role if no roles returned
  if (!roles || !roles.length) {
    roles.push('agent');
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
  // Core auth state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
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
            const userProfile = await createUserProfile(newSession.user);
            setUser(userProfile);
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
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        try {
          // Create user profile from session user with roles
          const userProfile = await createUserProfile(initialSession.user);
          setUser(userProfile);
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
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Signed in successfully!');
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
      
      toast.success('Signed out successfully!');
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
    setUser({
      ...user,
      activeRole: role
    });
    
    // Navigate based on role
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
  const roles = user?.roles || [];
  const activeRole = user?.activeRole || 'agent';

  // Context value
  const contextValue: AuthContextType = {
    user,
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
