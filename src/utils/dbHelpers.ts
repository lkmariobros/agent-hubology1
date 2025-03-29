
import { supabase } from '@/lib/supabase';

/**
 * Helper functions for database operations with proper typing
 */

/**
 * Safe query execution with error handling
 * @param queryFn Function that executes the query
 * @returns Result with data and error
 */
export async function safeQueryExecution<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Database query error:', error);
      return { data: null, error: error.message || 'An error occurred during the database operation' };
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected error during database query:', err);
    return { data: null, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Type-safe select query for Supabase
 */
export async function safeSelect<T>(
  table: string,
  columns: string = '*',
  conditions: Record<string, any> = {}
): Promise<{ data: T[] | null; error: string | null }> {
  return safeQueryExecution<T[]>(async () => {
    let query = supabase.from(table).select(columns);
    
    // Apply any conditions if provided
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key as any, value as any);
    });
    
    return await query;
  });
}

/**
 * Type-safe insert for Supabase
 */
export async function safeInsert<T>(
  table: string,
  data: Record<string, any>
): Promise<{ data: T | null; error: string | null }> {
  return safeQueryExecution<T>(async () => {
    return await supabase
      .from(table)
      .insert(data as any)
      .select()
      .single();
  });
}

/**
 * Type-safe update for Supabase
 */
export async function safeUpdate<T>(
  table: string,
  data: Record<string, any>,
  conditions: Record<string, any>
): Promise<{ data: T | null; error: string | null }> {
  return safeQueryExecution<T>(async () => {
    let query = supabase.from(table).update(data as any);
    
    // Apply any conditions
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key as any, value as any);
    });
    
    return await query.select().single();
  });
}

/**
 * Type-safe delete for Supabase
 */
export async function safeDelete(
  table: string,
  conditions: Record<string, any>
): Promise<{ error: string | null }> {
  return safeQueryExecution(async () => {
    let query = supabase.from(table).delete();
    
    // Apply any conditions
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key as any, value as any);
    });
    
    return await query;
  });
}

export default {
  safeSelect,
  safeInsert,
  safeUpdate,
  safeDelete,
  safeQueryExecution
};
