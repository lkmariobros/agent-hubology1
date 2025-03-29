
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'agent' | 'team_leader' | 'finance' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
}

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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
}
