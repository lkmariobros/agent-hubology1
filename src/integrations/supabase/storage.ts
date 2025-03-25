
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
    console.log('Existing buckets:', existingBuckets);
    
    // Check if buckets exist, but don't try to create them if they do
    // This avoids the duplicate key errors we saw
    
    // property-images bucket
    if (!existingBuckets.includes('property-images')) {
      console.log('Need to create property-images bucket');
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
    } else {
      console.log('property-images bucket already exists');
    }
    
    // property-documents bucket
    if (!existingBuckets.includes('property-documents')) {
      console.log('Need to create property-documents bucket');
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
    } else {
      console.log('property-documents bucket already exists');
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

/**
 * Get public URL for an image
 */
export const getPublicImageUrl = (path: string): string => {
  if (!path) return '';
  
  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(path);
    
  return data.publicUrl;
};

/**
 * Get a signed URL for a private document
 */
export const getSignedDocumentUrl = async (path: string): Promise<string> => {
  if (!path) return '';
  
  const { data, error } = await supabase.storage
    .from('property-documents')
    .createSignedUrl(path, 60 * 60); // 1 hour expiry
    
  if (error) {
    console.error('Error creating signed URL:', error);
    return '';
  }
  
  return data.signedUrl;
};

/**
 * Delete a file from storage
 */
export const deleteStorageFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      console.error(`Error deleting file from ${bucket}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting file from ${bucket}:`, error);
    return false;
  }
};
