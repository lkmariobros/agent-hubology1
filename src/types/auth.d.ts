
export type UserRole = 'admin' | 'agent' | 'team_leader' | 'viewer' | 'finance' | 'manager';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
  [key: string]: any;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId: string | null;
  user: any | null;
  loading: boolean;
  error: Error | null;
  hasRole: (role: string) => boolean;
  has?: (params: { role: string }) => boolean;
  activeRole?: UserRole;
}
