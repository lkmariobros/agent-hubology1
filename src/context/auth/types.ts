
import React from 'react';

// Props for AuthProvider component
export interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth context state
export interface AuthState {
  user: any | null;
  profile: any | null;
  session: any | null;
  loading: boolean;
  error: Error | null;
  roles: string[];
  activeRole: string;
}

// Auth service action types
export type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_SESSION'; payload: { session: any; user: any; profile: any; roles: string[]; activeRole: string; } }
  | { type: 'RESET' };
