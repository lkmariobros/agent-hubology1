
import { supabase } from '@/lib/supabase';
import { safeQueryExecution } from './dbHelpers';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Helper functions for property form operations

/**
 * Get or create a property type by name
 */
export async function getOrCreatePropertyType(name: string): Promise<string | null> {
  try {
    // First, try to find existing property type
    const { data, error } = await supabase
      .from('property_types')
      .select('id')
      .eq('name', name)
      .single();
    
    if (data) return data.id;
    
    // If not found, create a new property type
    const { data: newPropertyType, error: createError } = await supabase
      .from('property_types')
      .insert({ name })
      .select('id')
      .single();
    
    if (createError) {
      console.error('Error creating property type:', createError);
      return null;
    }
    
    return newPropertyType.id;
  } catch (err) {
    console.error('Error in getOrCreatePropertyType:', err);
    return null;
  }
}

/**
 * Get or create a transaction type by name
 */
export async function getOrCreateTransactionType(name: string): Promise<string | null> {
  try {
    // First, try to find existing transaction type
    const { data, error } = await supabase
      .from('transaction_types')
      .select('id')
      .eq('name', name)
      .single();
    
    if (data) return data.id;
    
    // If not found, create a new transaction type
    const { data: newTransactionType, error: createError } = await supabase
      .from('transaction_types')
      .insert({ name })
      .select('id')
      .single();
    
    if (createError) {
      console.error('Error creating transaction type:', createError);
      return null;
    }
    
    return newTransactionType.id;
  } catch (err) {
    console.error('Error in getOrCreateTransactionType:', err);
    return null;
  }
}

/**
 * Get or create a property status by name
 */
export async function getOrCreatePropertyStatus(name: string): Promise<string | null> {
  try {
    // First, try to find existing property status
    const { data, error } = await supabase
      .from('property_statuses')
      .select('id')
      .eq('name', name)
      .single();
    
    if (data) return data.id;
    
    // If not found, create a new property status
    const { data: newPropertyStatus, error: createError } = await supabase
      .from('property_statuses')
      .insert({ name })
      .select('id')
      .single();
    
    if (createError) {
      console.error('Error creating property status:', createError);
      return null;
    }
    
    return newPropertyStatus.id;
  } catch (err) {
    console.error('Error in getOrCreatePropertyStatus:', err);
    return null;
  }
}

/**
 * Create a property with the given data
 */
export async function createProperty(propertyData: Record<string, any>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('enhanced_properties')
      .insert(propertyData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating property:', error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Error in createProperty:', err);
    return null;
  }
}

export default {
  getOrCreatePropertyType,
  getOrCreateTransactionType,
  getOrCreatePropertyStatus,
  createProperty
};
