
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuth as useClerkAuth } from '../../providers/ClerkAuthProvider';

// Create context with default values (undefined for type safety)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use the auth context
 */
export const useAuthContext = (): AuthContextType => {
  // We're now using the ClerkAuthProvider under the hood
  return useClerkAuth();
};

export { AuthContext };
