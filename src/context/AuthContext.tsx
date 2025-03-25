
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth';

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin email patterns for development/testing
// In production, this would be replaced with proper role management from the database
const ADMIN_EMAIL_PATTERNS = ['admin', 'test', 'josephkwantum@gmail.com'];

/**
 * Determines if a user has admin privileges based on email patterns
 * This is a temporary solution for development - in production, roles would come from the database
 */
const determineIsAdmin = (email: string): boolean => {
  return ADMIN_EMAIL_PATTERNS.some(pattern => 
    email.toLowerCase().includes(pattern.toLowerCase()) || 
    email.toLowerCase() === pattern.toLowerCase()
  );
};

/**
 * Creates a user profile from Supabase user data
 */
const createUserProfile = (user: User): UserProfile => {
  const email = user.email || '';
  const isAdmin = determineIsAdmin(email);
  
  // Build the roles array based on permissions
  const roles: UserRole[] = ['agent'];
  if (isAdmin) roles.push('admin');
  
  // Default to agent role for initial display
  const activeRole: UserRole = 'agent';
  
  return {
    id: user.id,
    email,
    name: email.split('@')[0],
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
          // Create user profile from session user
          const userProfile = createUserProfile(newSession.user);
          setUser(userProfile);
        } else {
          // Clear user when session is null
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        // Create user profile from session user
        const userProfile = createUserProfile(initialSession.user);
        setUser(userProfile);
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
