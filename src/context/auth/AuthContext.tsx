
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create context with default values (undefined for type safety)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export { AuthContext };
