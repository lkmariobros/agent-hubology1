
import React from 'react';
import { ClerkAuthProvider } from '../../providers/ClerkAuthProvider';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkAuthProvider>
      {children}
    </ClerkAuthProvider>
  );
};

export default AuthProvider;
