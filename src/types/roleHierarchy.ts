import { Role, Permission } from './role';
import { UserRole } from './auth';

/**
 * Represents a role hierarchy relationship
 */
export interface RoleHierarchy {
  id: string;
  parent_role_id: string;
  child_role_id: string;
  created_at?: string;
  updated_at?: string;
  
  // Populated relations
  parent_role?: Role;
  child_role?: Role;
}

/**
 * Agent role level representing a specific tier in the agent progression
 */
export interface RoleLevel {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  min_sales_value: number;
  next_level_threshold: number | null;
  role_id: string | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
  
  // Populated relation
  role?: Role;
}

/**
 * Extended role information including hierarchy data
 */
export interface ExtendedRole extends Role {
  parent_roles?: Role[];
  child_roles?: Role[];
  inherited_permissions?: Permission[];
  level?: RoleLevel;
}

/**
 * Role level mapping for displaying agent progress
 */
export const AGENT_ROLE_LEVELS: Record<string, RoleLevel> = {
  'junior_agent': {
    id: 'junior_agent',
    name: 'junior_agent',
    display_name: 'Junior Agent',
    description: 'New agents with sales under $5M',
    min_sales_value: 0,
    next_level_threshold: 5000000,
    role_id: null,
    order_index: 1
  },
  'agent': {
    id: 'agent',
    name: 'agent',
    display_name: 'Agent',
    description: 'Regular agents with sales between $5M and $15M',
    min_sales_value: 5000000,
    next_level_threshold: 15000000,
    role_id: null,
    order_index: 2
  },
  'senior_agent': {
    id: 'senior_agent',
    name: 'senior_agent',
    display_name: 'Senior Agent',
    description: 'Experienced agents with sales between $15M and $45M',
    min_sales_value: 15000000,
    next_level_threshold: 45000000,
    role_id: null,
    order_index: 3
  },
  'associate_director': {
    id: 'associate_director',
    name: 'associate_director',
    display_name: 'Associate Director',
    description: 'High performing agents with sales between $45M and $100M',
    min_sales_value: 45000000,
    next_level_threshold: 100000000,
    role_id: null,
    order_index: 4
  },
  'director': {
    id: 'director',
    name: 'director',
    display_name: 'Director',
    description: 'Top performing agents with sales over $100M',
    min_sales_value: 100000000,
    next_level_threshold: null,
    role_id: null,
    order_index: 5
  }
};

/**
 * Mapping of agent levels to next level information
 */
export const AGENT_PROGRESSION: Record<string, { next: string | null, threshold: number }> = {
  'junior_agent': { next: 'agent', threshold: 5000000 },
  'agent': { next: 'senior_agent', threshold: 15000000 },
  'senior_agent': { next: 'associate_director', threshold: 45000000 },
  'associate_director': { next: 'director', threshold: 100000000 },
  'director': { next: null, threshold: 0 }
};

/**
 * Extended role mapping with hierarchical information
 */
export const DEFAULT_ROLE_HIERARCHY: Record<UserRole, { parents?: UserRole[], children?: UserRole[] }> = {
  'admin': {
    children: ['team_leader', 'manager', 'finance']
  },
  'team_leader': {
    parents: ['admin', 'manager'],
    children: ['agent']
  },
  'manager': {
    parents: ['admin'],
    children: ['team_leader', 'agent']
  },
  'finance': {
    parents: ['admin'],
    children: []
  },
  'agent': {
    parents: ['team_leader', 'manager'],
    children: ['viewer']
  },
  'viewer': {
    parents: ['agent'],
    children: []
  }
};