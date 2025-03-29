
import { supabase } from '@/lib/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

/**
 * Helper functions for database operations with proper typing
 */

/**
 * Safe query execution with error handling
 * @param queryFn Function that executes the query
 * @returns Result with data and error
 */
export async function safeQueryExecution<T>(
  queryFn: () => Promise<PostgrestSingleResponse<T>>
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
  try {
    let query = supabase.from(table).select(columns);
    
    // Apply any conditions if provided
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: data as T[], error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Type-safe insert for Supabase
 */
export async function safeInsert<T>(
  table: string,
  data: Record<string, any>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: result as T, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Type-safe update for Supabase
 */
export async function safeUpdate<T>(
  table: string,
  data: Record<string, any>,
  conditions: Record<string, any>
): Promise<{ data: T | null; error: string | null }> {
  try {
    let query = supabase.from(table).update(data);
    
    // Apply any conditions
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data: result, error } = await query.select().single();
    
    if (error) {
      return { data: null, error: error.message };
    }
    
    return { data: result as T, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Type-safe delete for Supabase
 */
export async function safeDelete(
  table: string,
  conditions: Record<string, any>
): Promise<{ error: string | null }> {
  try {
    let query = supabase.from(table).delete();
    
    // Apply any conditions
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { error } = await query;
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' };
  }
}

export default {
  safeSelect,
  safeInsert,
  safeUpdate,
  safeDelete,
  safeQueryExecution
};
