
export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  users_count?: number;
  permissions?: Permission[];
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  category?: string;
  selected?: boolean; // Used for UI selection state
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at?: string;
}

export interface PermissionCategory {
  name: string;
  permissions: Permission[];
}
