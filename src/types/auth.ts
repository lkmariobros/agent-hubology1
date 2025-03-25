
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Defines the available user roles in the application
 * - agent: Standard property agent role
 * - admin: Administrator with elevated permissions
 */
export type UserRole = 'agent' | 'admin';

/**
 * Extended user profile with application-specific fields
 * beyond the basic Supabase user information
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  roles: UserRole[];
  activeRole: UserRole;
  tier?: string;
  joinDate?: string;
}

/**
 * Authentication context interface defining all
 * available auth-related state and methods
 */
export interface AuthContextType {
  // Session State
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  
  // Role Management
  isAdmin: boolean;
  activeRole: UserRole;
  roles: UserRole[];
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  
  // Auth Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

/**
 * Type guard to check if a user has a specific role
 */
export function hasRole(user: UserProfile | null, role: UserRole): boolean {
  return !!user && user.roles.includes(role);
}

/**
 * Type for protected route component props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}
