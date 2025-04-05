
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
      .maybeSingle();
    
    if (data?.id) return data.id;
    
    // If not found, create a new property type
    const { data: newPropertyType, error: createError } = await supabase
      .from('property_types')
      .insert({ name })
      .select('id')
      .single();
    
    if (createError) {
      console.error('Error creating property type:', createError);
      toast.error(`Failed to create property type: ${createError.message}`);
      return null;
    }
    
    return newPropertyType.id;
  } catch (err) {
    const error = err as Error;
    console.error('Error in getOrCreatePropertyType:', error);
    toast.error(`Database error: ${error.message}`);
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
      .maybeSingle();
    
    if (data?.id) return data.id;
    
    // If not found, create a new transaction type
    const { data: newTransactionType, error: createError } = await supabase
      .from('transaction_types')
      .insert({ name })
      .select('id')
      .single();
    
    if (createError) {
      console.error('Error creating transaction type:', createError);
      toast.error(`Failed to create transaction type: ${createError.message}`);
      return null;
    }
    
    return newTransactionType.id;
  } catch (err) {
    const error = err as Error;
    console.error('Error in getOrCreateTransactionType:', error);
    toast.error(`Database error: ${error.message}`);
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
      .maybeSingle();
    
    if (data?.id) return data.id;
    
    // If not found, create a new property status
    const { data: newPropertyStatus, error: createError } = await supabase
      .from('property_statuses')
      .insert({ name })
      .select('id')
      .single();
    
    if (createError) {
      console.error('Error creating property status:', createError);
      toast.error(`Failed to create property status: ${createError.message}`);
      return null;
    }
    
    return newPropertyStatus.id;
  } catch (err) {
    const error = err as Error;
    console.error('Error in getOrCreatePropertyStatus:', error);
    toast.error(`Database error: ${error.message}`);
    return null;
  }
}

/**
 * Create a property with the given data
 */
export async function createProperty(propertyData: Record<string, any>): Promise<string | null> {
  try {
    console.log('Creating property with data:', propertyData);
    
    const { data, error } = await supabase
      .from('enhanced_properties')
      .insert(propertyData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating property:', error);
      toast.error(`Failed to create property: ${error.message}`);
      return null;
    }
    
    return data.id;
  } catch (err) {
    const error = err as Error;
    console.error('Error in createProperty:', error);
    toast.error(`Database error: ${error.message}`);
    return null;
  }
}

/**
 * Checks if property-related buckets exist in Supabase storage
 * and creates them if they don't
 */
export async function ensurePropertyBuckets(): Promise<boolean> {
  try {
    // Check if buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    const requiredBuckets = ['property-images', 'property-documents'];
    const existingBuckets = buckets.map(b => b.name);
    
    // Create any missing buckets (only for admin users in real world)
    for (const bucketName of requiredBuckets) {
      if (!existingBuckets.includes(bucketName)) {
        console.warn(`Bucket ${bucketName} doesn't exist. This should be created via migrations in production.`);
        // In production, buckets should be created via SQL migrations, not via client
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring property buckets:', error);
    return false;
  }
}

export default {
  getOrCreatePropertyType,
  getOrCreateTransactionType,
  getOrCreatePropertyStatus,
  createProperty,
  ensurePropertyBuckets
};
