
import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create context with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for consuming the context
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}
