
import { UserRole } from '@/providers/AuthProvider';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  agentTier?: string;
  team?: string;
  joinDate?: string | Date;
  tier?: string;
  phone?: string;
  properties?: any[];
  sales?: number;
  transactions?: number;
  points?: number;
  badges?: string[];
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
  switchRole: (role: UserRole) => void;
}
