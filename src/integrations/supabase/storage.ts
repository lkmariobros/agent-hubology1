
import { supabase } from './client';

/**
 * Ensures that the required storage buckets exist
 * @returns Promise<boolean> indicating if the operation was successful
 */
export const ensureStorageBuckets = async (): Promise<boolean> => {
  try {
    // Get list of existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const existingBuckets = buckets?.map(bucket => bucket.name) || [];
    
    // Check and create property-images bucket if needed
    if (!existingBuckets.includes('property-images')) {
      const { error: imagesBucketError } = await supabase.storage.createBucket('property-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      
      if (imagesBucketError) {
        console.error('Error creating property-images bucket:', imagesBucketError);
        return false;
      }
      
      console.log('Created property-images bucket');
    }
    
    // Check and create property-documents bucket if needed
    if (!existingBuckets.includes('property-documents')) {
      const { error: docsBucketError } = await supabase.storage.createBucket('property-documents', {
        public: false,
        fileSizeLimit: 20971520, // 20MB
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png'
        ]
      });
      
      if (docsBucketError) {
        console.error('Error creating property-documents bucket:', docsBucketError);
        return false;
      }
      
      console.log('Created property-documents bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets exist:', error);
    return false;
  }
};

/**
 * Initialize storage when the app starts
 */
export const initializeStorage = async () => {
  console.log('Initializing storage...');
  const success = await ensureStorageBuckets();
  console.log('Storage initialization ' + (success ? 'successful' : 'failed'));
};
