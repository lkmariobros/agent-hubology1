
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Safe database operations that handle type compatibility issues
 */

export const dbHelpers = {
  /**
   * Safely perform a query with a filter by value
   */
  safeSelect: async <T>(
    tableName: string,
    columns: string,
    filterColumn?: string,
    filterValue?: any
  ): Promise<T[] | null> => {
    try {
      let query = supabase.from(tableName).select(columns);
      
      if (filterColumn && filterValue !== undefined) {
        // Use type assertion to resolve type issues
        query = query.eq(filterColumn as any, filterValue as any);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error in safeSelect for ${tableName}:`, error);
        return null;
      }
      
      return data as T[];
    } catch (err) {
      console.error(`Exception in safeSelect for ${tableName}:`, err);
      return null;
    }
  },
  
  /**
   * Safely insert a record into a table
   */
  safeInsert: async <T>(
    tableName: string,
    values: Record<string, any>
  ): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(values as any)
        .select()
        .single();
      
      if (error) {
        console.error(`Error in safeInsert for ${tableName}:`, error);
        return null;
      }
      
      return data as T;
    } catch (err) {
      console.error(`Exception in safeInsert for ${tableName}:`, err);
      return null;
    }
  },
  
  /**
   * Safely update a record in a table
   */
  safeUpdate: async <T>(
    tableName: string,
    values: Record<string, any>,
    filterColumn: string,
    filterValue: any
  ): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(values as any)
        .eq(filterColumn as any, filterValue as any)
        .select()
        .single();
      
      if (error) {
        console.error(`Error in safeUpdate for ${tableName}:`, error);
        return null;
      }
      
      return data as T;
    } catch (err) {
      console.error(`Exception in safeUpdate for ${tableName}:`, err);
      return null;
    }
  },
  
  /**
   * Safely delete a record from a table
   */
  safeDelete: async (
    tableName: string,
    filterColumn: string,
    filterValue: any
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(filterColumn as any, filterValue as any);
      
      if (error) {
        console.error(`Error in safeDelete for ${tableName}:`, error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error(`Exception in safeDelete for ${tableName}:`, err);
      return false;
    }
  },
  
  /**
   * Process query result safely with a fallback
   */
  processQueryResult: <T>(
    response: PostgrestSingleResponse<T>,
    defaultValue: T | null = null
  ): T | null => {
    if (response.error) {
      console.error('Query error:', response.error);
      return defaultValue;
    }
    
    return response.data || defaultValue;
  }
};

// Wrapper for the formSubmission.ts file
export const propertyFormHelpers = {
  /**
   * Get or create a property type
   */
  getOrCreatePropertyType: async (propertyType: string): Promise<string | null> => {
    try {
      // First try to find existing property type
      const { data: existingType } = await supabase
        .from('property_types')
        .select('id')
        .eq('name' as any, propertyType as any)
        .maybeSingle();
      
      if (existingType && 'id' in existingType) {
        return existingType.id;
      }
      
      // Create new property type
      const { data: newType, error } = await supabase
        .from('property_types')
        .insert({ name: propertyType } as any)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating property type:', error);
        return null;
      }
      
      return newType.id;
    } catch (err) {
      console.error('Exception in getOrCreatePropertyType:', err);
      return null;
    }
  },
  
  /**
   * Get or create a transaction type
   */
  getOrCreateTransactionType: async (transactionType: string): Promise<string | null> => {
    try {
      // First try to find existing transaction type
      const { data: existingType } = await supabase
        .from('transaction_types')
        .select('id')
        .eq('name' as any, transactionType as any)
        .maybeSingle();
      
      if (existingType && 'id' in existingType) {
        return existingType.id;
      }
      
      // Create new transaction type
      const { data: newType, error } = await supabase
        .from('transaction_types')
        .insert({ name: transactionType } as any)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating transaction type:', error);
        return null;
      }
      
      return newType.id;
    } catch (err) {
      console.error('Exception in getOrCreateTransactionType:', err);
      return null;
    }
  },
  
  /**
   * Get or create a property status
   */
  getOrCreatePropertyStatus: async (status: string): Promise<string | null> => {
    try {
      // First try to find existing status
      const { data: existingStatus } = await supabase
        .from('property_statuses')
        .select('id')
        .eq('name' as any, status as any)
        .maybeSingle();
      
      if (existingStatus && 'id' in existingStatus) {
        return existingStatus.id;
      }
      
      // Create new status
      const { data: newStatus, error } = await supabase
        .from('property_statuses')
        .insert({ name: status } as any)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating property status:', error);
        return null;
      }
      
      return newStatus.id;
    } catch (err) {
      console.error('Exception in getOrCreatePropertyStatus:', err);
      return null;
    }
  },
  
  /**
   * Create a property
   */
  createProperty: async (propertyData: Record<string, any>): Promise<string | null> => {
    try {
      const { data: property, error } = await supabase
        .from('enhanced_properties')
        .insert(propertyData as any)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating property:', error);
        return null;
      }
      
      return property.id;
    } catch (err) {
      console.error('Exception in createProperty:', err);
      return null;
    }
  }
};
