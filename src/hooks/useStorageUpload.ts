
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UploadOptions {
  bucket: string;
  path?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

export function useStorageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const checkStorageBuckets = useCallback(async (buckets: string[]): Promise<boolean> => {
    try {
      // List buckets to check if they exist
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        return false;
      }
      
      // Check if all required buckets exist
      const existingBuckets = data.map(bucket => bucket.name);
      return buckets.every(bucket => existingBuckets.includes(bucket));
    } catch (err) {
      console.error('Error checking buckets:', err);
      return false;
    }
  }, []);

  const forceCheckStorageBuckets = useCallback(async (buckets: string[]): Promise<boolean> => {
    try {
      // Forcefully check each bucket individually
      const results = await Promise.all(
        buckets.map(async (bucket) => {
          try {
            // Try to list files in the bucket to see if it exists and is accessible
            const { data, error } = await supabase.storage.from(bucket).list();
            return !error;
          } catch {
            return false;
          }
        })
      );
      
      return results.every(result => result);
    } catch (err) {
      console.error('Error force checking buckets:', err);
      return false;
    }
  }, []);

  const testBucketAccess = useCallback(async (bucket: string): Promise<boolean> => {
    try {
      // Try to list a single bucket to check access
      const { data, error } = await supabase.storage.from(bucket).list();
      return !error;
    } catch (err) {
      console.error('Error testing bucket access:', err);
      return false;
    }
  }, []);

  const uploadFile = useCallback(async (
    file: File, 
    options: UploadOptions
  ): Promise<string> => {
    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);
      
      // Validate file size
      if (options.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds the ${options.maxSizeMB}MB limit`);
      }
      
      // Validate file type
      if (options.acceptedFileTypes && !options.acceptedFileTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not supported`);
      }
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const basePath = options.path ? `${options.path}/` : '';
      const filePath = `${basePath}${timestamp}-${randomString}.${fileExt}`;
      
      // Use simulation for progress since Supabase doesn't provide progress
      const simulateProgress = () => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 100);
        
        return interval;
      };
      
      const progressInterval = simulateProgress();
      
      // Upload the file
      console.log(`Uploading to ${options.bucket}/${filePath}`);
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      // Clear the progress simulation
      clearInterval(progressInterval);
      
      if (error) {
        console.error('Upload error:', error);
        setProgress(0);
        throw error;
      }
      
      // Set to 100% when complete
      setProgress(100);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown upload error';
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadFile,
    checkStorageBuckets,
    forceCheckStorageBuckets,
    testBucketAccess,
    isUploading,
    progress,
    error
  };
}
