
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'admin' | 'agent' | 'manager';
  agentTier?: string;
  teams?: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: 'admin' | 'agent' | 'manager') => void;
}
