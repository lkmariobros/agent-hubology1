
import React, { createContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types/auth';

// Create the auth context
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Here you would normally check with your auth service
        // For now, we'll just set a mock user after a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock a logged in user for development
        setUser({
          id: '1',
          email: 'user@example.com',
          name: 'Demo User',
          role: 'agent',
          agentTier: 'Team Leader',
          teams: ['Sales A']
        });
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError('Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Here you would normally authenticate with your auth service
      console.log('Signing in with:', email, password);
      
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock user
      setUser({
        id: '1',
        email,
        name: 'Demo User',
        role: 'agent',
        agentTier: 'Team Leader',
        teams: ['Sales A']
      });
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Invalid email or password');
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Here you would normally sign out from your auth service
      console.log('Signing out');
      
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
      throw new Error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch role function (for development/testing)
  const switchRole = (role: 'admin' | 'agent' | 'manager') => {
    if (user) {
      setUser({
        ...user,
        role
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        error,
        signIn,
        signUp: signIn, // For now, just use signIn for signUp as well
        signOut,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
