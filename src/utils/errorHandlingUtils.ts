
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

// Helper function for consistent error logging format
export const logError = (
  error: unknown, 
  source: string,
  additionalInfo: Record<string, any> = {}
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[${source}] Error:`, { 
    message: errorMessage, 
    stack: error instanceof Error ? error.stack : undefined,
    ...additionalInfo 
  });
};

// Helper function to extract Postgres error message in a user-friendly format
export const extractErrorMessage = (error: unknown): string => {
  if (isPostgrestError(error)) {
    // For database-specific errors, extract details
    return `Database error: ${error.message}`;
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Type guard for Supabase Postgrest errors
export const isPostgrestError = (error: unknown): error is PostgrestError => {
  return (
    typeof error === 'object' && 
    error !== null && 
    'code' in error && 
    'message' in error && 
    'details' in error
  );
};

// Helper function to show error toast with consistent format
export const handleApiError = (
  error: unknown, 
  source: string,
  userMessage: string = 'Failed to load data. Please try again.'
): void => {
  logError(error, source);
  toast.error(userMessage);
};

// Reusable async function wrapper with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  source: string,
  userMessage: string = 'An error occurred. Please try again.'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    handleApiError(error, source, userMessage);
    return null;
  }
}

// Create a retry wrapper for async operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  source: string
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      logError(error, `${source} (Attempt ${attempt + 1}/${retries})`);
      
      if (attempt < retries - 1) {
        // Wait before the next retry
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      }
    }
  }
  
  throw lastError;
}
