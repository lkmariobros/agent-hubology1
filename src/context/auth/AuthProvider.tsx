
import React from 'react';
import { AuthContext } from './AuthContext';
import { useAuthInitialization } from './hooks/useAuthInitialization';
import { useAuthMethods } from './hooks/useAuthMethods';
import { useContextValue } from './hooks/useContextValue';
import { AuthProviderProps } from './types';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize auth state and subscription
  const {
    state,
    setLoading,
    setError,
    updateSessionState
  } = useAuthInitialization();
  
  // Set up authentication methods
  const authMethods = useAuthMethods(
    state,
    setLoading,
    setError,
    updateSessionState
  );
  
  // Create context value
  const contextValue = useContextValue(state, authMethods);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
