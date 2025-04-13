import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  
  return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(value);
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  };
  
  return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(value / 100);
}

/**
 * Truncate a string to a specified maximum length
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

/**
 * Parse a potentially invalid number from a string
 */
export function parseNumber(value: string): number {
  return isNaN(Number(value)) ? 0 : Number(value);
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  permissions: string[] = [], 
  requiredPermission: string
): boolean {
  return permissions.includes(requiredPermission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  permissions: string[] = [], 
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some(perm => permissions.includes(perm));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  permissions: string[] = [], 
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(perm => permissions.includes(perm));
}

/**
 * Create a permission check function for a specific set of user permissions
 */
export function createPermissionChecker(userPermissions: string[] = []) {
  return {
    has: (permission: string) => hasPermission(userPermissions, permission),
    hasAny: (permissions: string[]) => hasAnyPermission(userPermissions, permissions),
    hasAll: (permissions: string[]) => hasAllPermissions(userPermissions, permissions)
  };
}