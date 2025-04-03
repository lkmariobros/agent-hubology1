
import { useContext } from 'react';
import { useAuth as useClerkAuth } from '@/providers/ClerkAuthProvider';

export const useAuth = () => {
  return useClerkAuth();
};

export default useAuth;
