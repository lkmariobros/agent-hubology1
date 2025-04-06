
import { supabase } from '@/lib/supabase';

/**
 * This utility function can be called to manually ensure storage buckets exist
 * It's useful for development and testing purposes
 */
export async function ensureStorageBuckets() {
  try {
    // List existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return { success: false, error };
    }
    
    const existingBuckets = buckets.map(b => b.name);
    const results = [];
    
    // Create property-images bucket if it doesn't exist
    if (!existingBuckets.includes('property-images')) {
      const { data, error } = await supabase.storage.createBucket('property-images', { 
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
      });
      
      results.push({
        bucket: 'property-images',
        success: !error,
        error
      });
    }
    
    // Create property-documents bucket if it doesn't exist
    if (!existingBuckets.includes('property-documents')) {
      const { data, error } = await supabase.storage.createBucket('property-documents', { 
        public: false,
        fileSizeLimit: 10485760, // 10MB in bytes
      });
      
      results.push({
        bucket: 'property-documents',
        success: !error,
        error
      });
    }
    
    return { success: true, results };
  } catch (error) {
    console.error('Error creating storage buckets:', error);
    return { success: false, error };
  }
}

/**
 * Call this function from the browser console to manually create buckets:
 * import { setupStorageBuckets } from '@/utils/setupStorage';
 * setupStorageBuckets();
 */
export async function setupStorageBuckets() {
  const result = await ensureStorageBuckets();
  console.log('Storage bucket setup result:', result);
  return result;
}
