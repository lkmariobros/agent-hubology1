
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/auth';
import { logger } from '@/services/logging';

// Define the auth context state interface
interface AuthContextState {
  user: any | null;
  profile: any | null;
  loading: boolean;
  error: Error | null;
  isAdmin: boolean;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextState | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('agent');
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if user is admin
  const isAdmin = profile?.tier >= 5;

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
      // Store tier level for RLS policies
      localStorage.setItem('user-tier', data.tier.toString());
      
      // Set active role based on URL or saved preference
      if (location.pathname.startsWith('/admin')) {
        setActiveRole('admin');
      } else {
        const savedRole = localStorage.getItem('user-role') as UserRole;
        setActiveRole(savedRole || 'agent');
      }
    } catch (err) {
      logger.error('Error fetching user profile', { userId, error: err });
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    }
  };

  // Auth change listener
  useEffect(() => {
    setLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out successfully');
          navigate('/');
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        }
      }
    );

    // Cleanup the subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      logger.error('Sign in error', { email, error: err });
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      toast.error('Sign in failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-tier');
    } catch (err) {
      logger.error('Sign out error', { error: err });
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      toast.error('Sign out failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (err) {
      logger.error('Password reset error', { email, error: err });
      setError(err instanceof Error ? err : new Error('Failed to reset password'));
      toast.error('Password reset failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Switch role function
  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('user-role', role);
    
    // Navigate based on the role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  // Context value
  const value = {
    user,
    profile,
    loading,
    error,
    isAdmin,
    activeRole,
    switchRole,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context for use in the AuthProvider component
export const useAuthContext = () => {
  return useContext(AuthContext);
};
