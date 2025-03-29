
import { Session, User } from '@supabase/supabase-js';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth';

// Re-export the types from the main types file for convenience
export type { UserProfile, UserRole, AuthContextType };

// Additional types specific to auth context implementation
export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthState {
  user: UserProfile | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  roles: UserRole[];
  activeRole: UserRole;
}
