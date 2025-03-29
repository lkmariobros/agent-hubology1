
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
  
  // Fetch user profile and roles - moved outside useEffect to avoid closures
  const fetchProfileAndRoles = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Continue anyway - profile is optional
      } else {
        console.log('Profile fetched successfully');
        setProfile(profileData);
      }
      
      // Get full user profile with roles
      const userProfile = await createUserProfile({ id: userId, email: session?.user?.email } as User);
      console.log('User profile created:', userProfile);
      
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
      
      return userProfile;
    } catch (err) {
      console.error('Error fetching user profile or roles', { userId, error: err });
      // Still return a basic profile even if there's an error
      const defaultRoles: UserRole[] = ['agent'];
      return {
        id: userId,
        email: session?.user?.email || '',
        name: session?.user?.email?.split('@')[0] || '',
        roles: defaultRoles,
        activeRole: defaultRoles[0],
      };
    }
  };
  
  // Initialize auth state and set up listener for auth changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    let isMounted = true;
    
    // First check for existing session
    const checkExistingSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        console.log('Initial session check:', initialSession ? 'Session exists' : 'No session');
        
        if (initialSession?.user) {
          setSession(initialSession);
          // Create minimal user while we fetch the full profile
          const defaultRoles: UserRole[] = ['agent'];
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            name: initialSession.user.email?.split('@')[0] || '',
            roles: defaultRoles,
            activeRole: defaultRoles[0],
          });
          
          // Fetch complete profile in the background
          fetchProfileAndRoles(initialSession.user.id)
            .then(() => {
              if (isMounted) {
                // Check current location and redirect if needed
                if (location.pathname === '/') {
                  console.log('User is authenticated and on landing page, redirecting to dashboard');
                  navigate('/dashboard');
                }
                setLoading(false);
              }
            })
            .catch(err => {
              console.error('Error setting up user profile:', err);
              if (isMounted) setLoading(false);
            });
        } else {
          if (isMounted) {
            setLoading(false);
            // If no session and not on login page, redirect to login
            if (location.pathname !== '/' && location.pathname !== '/reset-password') {
              navigate('/');
            }
          }
        }
      } catch (err) {
        console.error('Error checking initial session:', err);
        if (isMounted) setLoading(false);
      }
    };
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted) return;
        
        setSession(newSession);
        
        if (newSession?.user) {
          // Create minimal user while we fetch the full profile
          const defaultRoles: UserRole[] = ['agent'];
          const basicUser: UserProfile = {
            id: newSession.user.id,
            email: newSession.user.email || '',
            name: newSession.user.email?.split('@')[0] || '',
            roles: defaultRoles,
            activeRole: defaultRoles[0],
          };
          
          setUser(basicUser);
          
          // Fetch complete profile in the background
          fetchProfileAndRoles(newSession.user.id)
            .then(() => {
              if (!isMounted) return;
              
              // Handle specific auth events
              if (event === 'SIGNED_IN') {
                console.log('User signed in, navigating to dashboard');
                toast.success('Signed in successfully');
                navigate('/dashboard');
              }
            })
            .catch(err => {
              console.error('Error updating user profile after auth change:', err);
            });
        } else {
          // Clear user when session is null
          setUser(null);
          setProfile(null);
          setRoles(['agent']);
          setActiveRole('agent');
          
          // Handle sign out
          if (event === 'SIGNED_OUT') {
            console.log('User signed out, navigating to login page');
            toast.info('Signed out successfully');
            navigate('/');
          }
        }
      }
    );

    // Then check for existing session
    checkExistingSession();

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscriptions');
      isMounted = false;
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
      
      console.log('Attempting to sign in with email:', email);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      console.log('Sign in successful - auth state change will handle redirection');
      // Navigation and state changes are handled by onAuthStateChange
      
    } catch (err: any) {
      console.error('Sign in error:', err.message);
      setError(err);
      toast.error(`Error signing in: ${err.message}`);
      throw err;
    } finally {
      // Don't set loading to false here - let the auth state change handle it
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to sign up with email:', email);
      
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      toast.success('Sign up successful! Please check your email for confirmation.');
      console.log('Sign up successful');
      
    } catch (err: any) {
      console.error('Sign up error:', err.message);
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
      
      console.log('Attempting to sign out');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      localStorage.removeItem('user-role');
      console.log('Sign out successful');
      
    } catch (err: any) {
      console.error('Sign out error:', err.message);
      setError(err);
      toast.error(`Error signing out: ${err.message}`);
      throw err;
    } finally {
      // Don't set loading to false here - let the auth state change handle it
    }
  };

  /**
   * Send a password reset email
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to send password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email!');
      console.log('Password reset email sent successfully');
      
    } catch (err: any) {
      console.error('Password reset error:', err.message);
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
    
    console.log('Switching to role:', role);
    
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
    isAuthenticated: !!user,
    isAdmin: !!user && user.roles.includes('admin'),
    roles,
    activeRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    switchRole,
    hasRole
  };

  // Show loading state or render children
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-purple-600 border-purple-300/30 animate-spin"></div>
          <div className="text-white text-lg font-medium">Loading authentication...</div>
        </div>
      </div>
    );
  }

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
 * Primary hook for accessing auth functionality
 */
export const useAuth = useAuthContext;
