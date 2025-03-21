
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  switchRole: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock admin emails for demo purposes
// In a real application, this would be determined from backend roles
const ADMIN_EMAILS = ['admin@example.com', 'admin@propertypro.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }, []);
  
  // For now, we're implementing a simple auth system
  // In a real app, this would connect to your backend
  const login = async (email: string, password: string) => {
    try {
      // Determine roles based on email 
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      
      // Create user profile with appropriate roles
      const roles: UserRole[] = ['agent'];
      if (isAdmin) roles.push('admin');
      
      const userProfile: UserProfile = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        roles,
        activeRole: 'agent', // Default to agent role on login
      };
      
      // Store user in state and localStorage
      setUser(userProfile);
      localStorage.setItem('auth_user', JSON.stringify(userProfile));
      
      toast.success('Logged in successfully');
      
      // Navigate to appropriate dashboard based on the active role
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    navigate('/');
    toast.info('Logged out successfully');
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
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
