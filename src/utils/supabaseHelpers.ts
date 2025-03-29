
import { PostgrestError } from '@supabase/supabase-js';

/**
 * TypeScript utility to safely access properties from Supabase query results,
 * which can be either data or error objects
 */

// Type guard to check if the result is a Postgres error
export const isPostgrestError = (data: any): data is PostgrestError => {
  return data && typeof data === 'object' && 'code' in data && 'message' in data && 'details' in data;
};

// Type guard to check if a result has a particular property
export const hasProperty = <T extends object, K extends string>(obj: T, prop: K): obj is T & Record<K, unknown> => {
  return obj !== null && typeof obj === 'object' && prop in obj;
};

// Safely extract a property from query result
export function safelyExtractProperty<T>(data: any, propertyName: string, defaultValue: T): T {
  if (!data) return defaultValue;
  if (isPostgrestError(data)) return defaultValue;
  if (!hasProperty(data, propertyName)) return defaultValue;
  return data[propertyName] as T;
}

// Safely cast the database parameter to any type to avoid TypeScript errors
export function castParam(param: any): any {
  return param;
}

// Helper to handle Supabase responses
export function handleSupabaseResponse<T>(data: T | null, error: PostgrestError | null): { data: T | null, success: boolean, error: string | null } {
  if (error) {
    console.error('Supabase operation error:', error);
    return { data: null, success: false, error: error.message };
  }
  return { data, success: true, error: null };
}

// Safely handle errors in async Supabase operations
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  errorMessage: string = 'Operation failed'
): Promise<T | null> {
  try {
    const { data, error } = await operation();
    if (error) {
      console.error(`${errorMessage}:`, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`${errorMessage}:`, err);
    return null;
  }
}

// Safe type assertion
export function safeAs<T>(data: any): T {
  return data as T;
}
