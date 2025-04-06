
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useSentry } from '@/hooks/useSentry';

// Create context with default values (undefined for type safety)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use the auth context with Sentry integration
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  // Add Sentry integration
  const { logError, setUser } = useSentry();
  
  // If there's an error in the auth context, log it to Sentry
  if (context.error && !context.loading) {
    logError(context.error, { 
      source: 'AuthContext', 
      isAuthenticated: context.isAuthenticated 
    });
  }
  
  // Set Sentry user context when authenticated
  if (context.user?.id && !context.loading) {
    setUser(context.user.id, context.user.email, context.user.name);
  }
  
  return context;
};

// Export the AuthContext
export { AuthContext };
