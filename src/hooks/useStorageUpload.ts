
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type UploadOptions = {
  bucket: string;
  path?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  upsert?: boolean;
};

export function useStorageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const checkInProgress = useRef(false);
  const bucketCache = useRef<Record<string, boolean>>({});

  // Function to verify storage buckets exist and are accessible
  const checkStorageBuckets = async (bucketNames: string[]): Promise<boolean> => {
    // Prevent concurrent checks
    if (checkInProgress.current) {
      console.log('Storage bucket check already in progress, skipping...');
      return storageStatus === 'available';
    }
    
    try {
      checkInProgress.current = true;
      setStorageStatus('checking');
      
      console.log('Checking storage buckets:', bucketNames);
      
      // Use cached results if available for all buckets
      const allCached = bucketNames.every(bucket => typeof bucketCache.current[bucket] !== 'undefined');
      if (allCached) {
        const allExist = bucketNames.every(bucket => bucketCache.current[bucket] === true);
        console.log('Using cached bucket status:', allExist ? 'available' : 'unavailable');
        setStorageStatus(allExist ? 'available' : 'unavailable');
        return allExist;
      }
      
      // Check if buckets exist
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        setStorageStatus('unavailable');
        return false;
      }
      
      const existingBuckets = buckets?.map(b => b.name) || [];
      console.log('Available buckets:', existingBuckets);
      
      // Check if all required buckets exist
      const allBucketsExist = bucketNames.every(bucket => existingBuckets.includes(bucket));
      
      // Cache the results
      bucketNames.forEach(bucket => {
        bucketCache.current[bucket] = existingBuckets.includes(bucket);
      });
      
      if (!allBucketsExist) {
        const missingBuckets = bucketNames.filter(b => !existingBuckets.includes(b));
        console.warn('Missing buckets:', missingBuckets);
        
        // Try to test bucket permissions even if it exists
        for (const bucket of bucketNames) {
          if (existingBuckets.includes(bucket)) {
            try {
              // Test if we can list files in the bucket
              const { error: listError } = await supabase.storage
                .from(bucket)
                .list('', { limit: 1 });
                
              if (listError) {
                console.error(`Permission error for bucket ${bucket}:`, listError);
                bucketCache.current[bucket] = false;
              }
            } catch (err) {
              console.error(`Error testing bucket ${bucket}:`, err);
              bucketCache.current[bucket] = false;
            }
          }
        }
      }
      
      setStorageStatus(allBucketsExist ? 'available' : 'unavailable');
      return allBucketsExist;
    } catch (err) {
      console.error('Error verifying storage buckets:', err);
      setStorageStatus('unavailable');
      return false;
    } finally {
      checkInProgress.current = false;
    }
  };

  // Clear the bucket cache and force a fresh check
  const forceCheckStorageBuckets = async (bucketNames: string[]): Promise<boolean> => {
    // Reset the cache for these buckets
    bucketNames.forEach(bucket => {
      delete bucketCache.current[bucket];
    });
    
    // Force the check
    return await checkStorageBuckets(bucketNames);
  };

  const uploadFile = async (file: File, options: UploadOptions): Promise<string> => {
    const { bucket, path = '', maxSizeMB = 10, acceptedFileTypes = [], upsert = false } = options;
    
    // Reset state
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      console.log('Starting upload process for file:', file.name);
      
      // Check bucket accessibility first
      const bucketExists = await checkStorageBuckets([bucket]);
      if (!bucketExists) {
        throw new Error(`Storage bucket '${bucket}' is not accessible. Please check your storage configuration.`);
      }
      
      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeMB) {
        throw new Error(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      }
      
      // Validate file type if specified
      if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
        throw new Error(`File type not supported. Accepted types: ${acceptedFileTypes.join(', ')}`);
      }
      
      // Generate a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;
      
      console.log('Uploading to path:', filePath);
      
      // Simulate progress (in real implementation, this would use upload events)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const nextProgress = Math.min(prev + 10, 90);
          return nextProgress;
        });
      }, 300);
      
      // Upload the file to Supabase Storage
      console.log('Executing upload to Supabase bucket:', bucket);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: upsert,
        });
      
      clearInterval(progressInterval);
      
      if (error) {
        console.error('Supabase upload error:', error);
        
        // Check for specific error types and provide user-friendly messages
        if (error.message.includes('storage/object-too-large')) {
          throw new Error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        } else if (error.message.includes('permission denied')) {
          throw new Error('You do not have permission to upload files to this storage bucket.');
        } else {
          throw error;
        }
      }
      
      console.log('Upload successful, data:', data);
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data?.path || filePath);
      
      console.log('Generated public URL:', publicUrl);
      
      setProgress(100);
      return publicUrl;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('File upload error:', error.message);
      
      // Return a more specific error
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const deleteFile = async (bucket: string, path: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      
      toast.success('File deleted successfully');
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('File deletion error:', error.message);
      toast.error(`Deletion failed: ${error.message}`);
      throw error;
    }
  };
  
  return {
    uploadFile,
    deleteFile,
    checkStorageBuckets,
    forceCheckStorageBuckets,
    isUploading,
    progress,
    error,
    storageStatus
  };
}
