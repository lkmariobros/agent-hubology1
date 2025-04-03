
import React from 'react';
import { ClerkAuthProvider } from '../../providers/ClerkAuthProvider';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkAuthProvider>
      {children}
    </ClerkAuthProvider>
  );
};

export default AuthProvider;
