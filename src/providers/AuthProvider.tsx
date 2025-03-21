
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Define user types and roles
export type UserRole = 'agent' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  roles: UserRole[];
  activeRole: UserRole;
}

// Expanded auth context type with role management
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // Helper to check if user has admin access
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  session: Session | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
  switchRole: () => {},
  session: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock admin emails for demo purposes
// In a real application, this would be determined from database roles
const ADMIN_EMAILS = ['admin@example.com', 'admin@propertypro.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Initialize auth state and set up listener for auth changes
  useEffect(() => {
    // First set up listener to react to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      
      setSession(newSession);
      
      if (newSession) {
        // User is logged in
        const email = newSession.user?.email || '';
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        
        // Create user profile with appropriate roles
        const roles: UserRole[] = ['agent'];
        if (isAdmin) roles.push('admin');
        
        const userProfile: UserProfile = {
          id: newSession.user.id,
          email: email,
          name: email.split('@')[0],
          roles,
          activeRole: 'agent', // Default to agent role on login
        };
        
        setUser(userProfile);
      } else {
        // User is logged out
        setUser(null);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        const email = initialSession.user?.email || '';
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        
        // Create user profile with appropriate roles
        const roles: UserRole[] = ['agent'];
        if (isAdmin) roles.push('admin');
        
        const userProfile: UserProfile = {
          id: initialSession.user.id,
          email: email,
          name: email.split('@')[0],
          roles,
          activeRole: 'agent', // Default to agent role on login
        };
        
        setUser(userProfile);
        setSession(initialSession);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login using Supabase Auth
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        throw error;
      }
      
      // Navigation happens automatically via onAuthStateChange
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout using Supabase Auth
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        throw error;
      }
      
      // Navigation and state reset handled by onAuthStateChange
      toast.info('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to switch between roles
  const switchRole = (role: UserRole) => {
    if (!user) return;
    
    // Check if user has the requested role
    if (!user.roles.includes(role)) {
      toast.error('You do not have access to this role');
      return;
    }
    
    // Update user with new active role
    const updatedUser = { ...user, activeRole: role };
    setUser(updatedUser);
    
    // Navigate to appropriate dashboard based on the new role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
    
    toast.success(`Switched to ${role} portal`);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.roles.includes('admin') || false,
    login,
    logout,
    switchRole,
    session,
  };
  
  // Show loading state or render children
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary">Loading authentication...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
