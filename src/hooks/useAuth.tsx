
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { UserRole, UserProfile } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserProfile | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roles: UserRole[];
  activeRole: UserRole;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Role management
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state
const initialState = {
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  roles: [],
  activeRole: 'agent' as UserRole,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Effect to initialize auth session and subscribe to auth changes
  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            try {
              // Fetch user profile
              const { data: profile } = await supabase
                .from('agent_profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              // Determine roles based on tier
              let roles: UserRole[] = ['agent', 'viewer'];
              
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
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error : new Error('Error fetching user profile'),
              }));
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setState({
            ...initialState,
            loading: false,
          });
        }
      }
    );
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          // Determine roles based on tier
          let roles: UserRole[] = ['agent', 'viewer'];
          
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
        } else {
          setState({
            ...initialState,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          ...initialState,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error occurred'),
        });
      }
    };
    
    initializeAuth();
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Authentication methods
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Auth state change listener will update state
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign in failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Sign up successful! Please verify your email.');
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign up failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Auth state change listener will handle the reset
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Sign out failed'),
        loading: false,
      }));
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Reset password error:', error);
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

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
