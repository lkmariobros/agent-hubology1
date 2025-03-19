
import { useState, useEffect, createContext, useContext } from 'react';
import { authApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, LoginCredentials, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  
  // Query for fetching the user profile
  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    retry: false,
    enabled: !!localStorage.getItem('token'), // Only run if token exists
    onSuccess: (response) => {
      if (response.success) {
        setUser(response.data);
      } else {
        // Handle case where API returns success: false
        localStorage.removeItem('token');
        setUser(null);
      }
    },
    onError: () => {
      localStorage.removeItem('token');
      setUser(null);
    }
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      authApi.login(credentials.email, credentials.password),
    onSuccess: (response) => {
      if (response.success) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
        toast.success('Welcome back!');
      } else {
        toast.error(response.message || 'Login failed');
      }
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    }
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear(); // Clear all queries on logout
      toast.success('Logged out successfully');
    }
  });
  
  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
