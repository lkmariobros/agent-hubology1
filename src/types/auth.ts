
import { Session, User } from '@supabase/supabase-js';

// User roles in the system
export type UserRole = 'admin' | 'team_leader' | 'manager' | 'finance' | 'agent' | 'viewer';

// User profile information
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
}

// Auth context data and methods
export interface AuthContextType {
  user: UserProfile | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roles: UserRole[];
  activeRole: UserRole;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Role management
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
}
