
import { useContext } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { AuthContext } from '@/providers/AuthProvider';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
