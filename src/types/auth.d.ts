
export type UserRole = 'admin' | 'agent' | 'team_leader' | 'viewer' | 'finance' | 'manager';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
  
  // Clerk-specific properties
  primaryEmailAddress?: { emailAddress: string };
  publicMetadata?: { 
    roles?: string[];
    isAdmin?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId?: string | null;
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  hasRole: (role: string) => boolean;
  has?: (params: { role: string }) => boolean;
  activeRole?: UserRole;
  isLoaded?: boolean;
  isSignedIn?: boolean;
  roles?: UserRole[];
  switchRole?: (role: UserRole) => void;
  session?: any;
}
