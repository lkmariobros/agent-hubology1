
import { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create context with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
