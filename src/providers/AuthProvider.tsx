
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, AuthContextType } from '@/types/auth';

// Define UserRole type for export
export type UserRole = 'admin' | 'agent' | 'manager';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for existing user session
    // For demo purposes, we'll just simulate a loading delay
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, create a mock user - in a real app this would come from your auth system
        const mockUser: User = {
          id: '123',
          email: 'demo@example.com',
          name: 'Demo User',
          avatar: 'https://ui-avatars.com/api/?name=Demo+User',
          role: 'agent',
          agentTier: 'Silver'
        };
        
        setUser(mockUser);
        setError(null);
      } catch (err) {
        setError('Failed to authenticate');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, create a mock user - in a real app this would be the response from your auth API
      const mockUser: User = {
        id: '123',
        email,
        name: 'Demo User',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User',
        role: 'agent',
        agentTier: 'Silver'
      };
      
      setUser(mockUser);
      setError(null);
    } catch (err) {
      setError('Invalid email or password');
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, create a mock user - in a real app this would be the response from your auth API
      const mockUser: User = {
        id: '123',
        email,
        name: 'Demo User',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User',
        role: 'agent',
        agentTier: 'Silver'
      };
      
      setUser(mockUser);
      setError(null);
    } catch (err) {
      setError('Failed to create account');
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setError(null);
    } catch (err) {
      setError('Failed to sign out');
      throw new Error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
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
        signUp,
        signOut,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
