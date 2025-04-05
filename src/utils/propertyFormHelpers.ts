
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
    console.log('Ensuring property buckets exist...');
    
    // Check if buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    const requiredBuckets = [
      { name: 'property-images', public: true },
      { name: 'property-documents', public: false }
    ];
    
    const existingBuckets = buckets?.map(b => b.name) || [];
    console.log('Existing buckets:', existingBuckets);
    
    // Create any missing buckets (only for development, in production they should be created via migrations)
    for (const bucket of requiredBuckets) {
      if (!existingBuckets.includes(bucket.name)) {
        console.log(`Creating bucket ${bucket.name}...`);
        try {
          const { error: createError } = await supabase.storage.createBucket(
            bucket.name, 
            { 
              public: bucket.public,
              fileSizeLimit: bucket.name === 'property-images' ? 5242880 : 10485760 // 5MB for images, 10MB for docs
            }
          );
          
          if (createError) {
            console.warn(`Could not create bucket ${bucket.name}:`, createError);
            toast.warning(`Storage initialization warning: ${createError.message}`);
          } else {
            console.log(`Bucket ${bucket.name} created successfully`);
          }
        } catch (createErr) {
          console.warn(`Exception creating bucket ${bucket.name}:`, createErr);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring property buckets:', error);
    return false;
  }
}

/**
 * Gets a property by ID
 */
export async function getPropertyById(id: string): Promise<Record<string, any> | null> {
  try {
    const { data, error } = await supabase
      .from('enhanced_properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching property:', error);
      toast.error(`Failed to fetch property: ${error.message}`);
      return null;
    }
    
    return data;
  } catch (err) {
    const error = err as Error;
    console.error('Error in getPropertyById:', error);
    toast.error(`Database error: ${error.message}`);
    return null;
  }
}

export default {
  getOrCreatePropertyType,
  getOrCreateTransactionType,
  getOrCreatePropertyStatus,
  createProperty,
  ensurePropertyBuckets,
  getPropertyById
};
