
import { supabase } from '@/lib/supabase';
import { captureException } from '@/lib/sentry';

/**
 * Safely execute a query with error handling
 */
export async function safeQueryExecution<T>(
  queryName: string, 
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error(`Error executing ${queryName}:`, error);
      captureException(error, { context: { query: queryName } });
      throw new Error(`Query failed (${queryName}): ${error.message}`);
    }
    
    if (data === null) {
      console.warn(`No data returned for ${queryName}`);
      return [] as unknown as T;
    }
    
    return data;
  } catch (error) {
    console.error(`Exception in ${queryName}:`, error);
    captureException(error, { context: { query: queryName } });
    throw error;
  }
}

/**
 * Safely execute a mutation with error handling
 */
export async function safeMutationExecution<T>(
  mutationName: string,
  mutationFn: () => Promise<{ data: T | null; error: any }>
): Promise<T | null> {
  try {
    const { data, error } = await mutationFn();
    
    if (error) {
      console.error(`Error executing ${mutationName}:`, error);
      captureException(error, { context: { mutation: mutationName } });
      throw new Error(`Mutation failed (${mutationName}): ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Exception in ${mutationName}:`, error);
    captureException(error, { context: { mutation: mutationName } });
    throw error;
  }
}

/**
 * Execute a database function with proper error handling
 */
export async function executeRPC<T>(
  functionName: string,
  params?: Record<string, any>
): Promise<T> {
  return safeQueryExecution<T>(
    `RPC:${functionName}`,
    () => {
      // Make sure we complete the query chain with an explicit promise
      const query = params ? supabase.rpc(functionName, params) : supabase.rpc(functionName);
      // Return the promise with data and error properties
      return query;
    }
  );
}
