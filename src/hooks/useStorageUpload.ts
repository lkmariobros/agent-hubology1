
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
  const initialCheckDone = useRef(false);
  const progressTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const bucketCache = useRef<Set<string>>(new Set());

  // Clear all timers on unmount
  useEffect(() => {
    return () => {
      // Clear all running progress timers
      Object.values(progressTimers.current).forEach(timer => {
        clearInterval(timer);
      });
    };
  }, []);

  // Check if storage buckets exist and are accessible
  const checkStorageBuckets = async (bucketNames: string[]): Promise<boolean> => {
    if (checkInProgress.current) {
      return storageStatus === 'available';
    }

    try {
      checkInProgress.current = true;
      setStorageStatus('checking');
      
      console.log('Checking storage buckets:', bucketNames);

      // Try to list buckets to check access
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error accessing storage:', error);
        setStorageStatus('unavailable');
        checkInProgress.current = false;
        return false;
      }
      
      // Check if all required buckets exist
      const existingBuckets = new Set(buckets.map(bucket => bucket.name));
      const existingBucketIds = new Set(buckets.map(bucket => bucket.id));
      
      console.log('Available buckets:', buckets);
      
      // Try both name and id for matching (in case there's inconsistency in how buckets are referenced)
      const allBucketsExist = bucketNames.every(name => 
        existingBuckets.has(name) || existingBucketIds.has(name)
      );
      
      // Cache successfully found buckets
      bucketNames.forEach(name => {
        if (existingBuckets.has(name) || existingBucketIds.has(name)) {
          bucketCache.current.add(name);
        }
      });
      
      initialCheckDone.current = true;
      setStorageStatus(allBucketsExist ? 'available' : 'unavailable');
      checkInProgress.current = false;
      
      if (!allBucketsExist) {
        console.warn(`Some buckets not found. Looking for: ${bucketNames.join(', ')}`);
      }
      
      return allBucketsExist;
    } catch (err) {
      console.error('Error checking storage buckets:', err);
      setStorageStatus('unavailable');
      checkInProgress.current = false;
      return false;
    }
  };

  // Force a fresh check of storage buckets (bypass cache)
  const forceCheckStorageBuckets = async (bucketNames: string[]): Promise<boolean> => {
    console.log('Force checking storage buckets:', bucketNames);
    bucketCache.current.clear();
    initialCheckDone.current = false;
    checkInProgress.current = false;
    return checkStorageBuckets(bucketNames);
  };

  // Test direct bucket access - some implementations might need direct bucket access test
  const testBucketAccess = async (bucketName: string): Promise<boolean> => {
    try {
      console.log(`Testing direct access to bucket: ${bucketName}`);
      // Try to list files in the bucket (just the first one)
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1 });
      
      if (error) {
        console.error(`Error accessing ${bucketName} bucket:`, error);
        return false;
      }
      
      console.log(`Successfully accessed ${bucketName} bucket`);
      return true;
    } catch (err) {
      console.error(`Error testing ${bucketName} bucket access:`, err);
      return false;
    }
  };

  const uploadFile = async (file: File, options: UploadOptions): Promise<string> => {
    const { bucket, path = '', maxSizeMB = 10, acceptedFileTypes = [], upsert = false } = options;
    
    // Reset state
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      console.log(`Starting upload process for file: ${file.name}`);
      
      // Test bucket access directly before trying upload
      const canAccessBucket = await testBucketAccess(bucket);
      if (!canAccessBucket) {
        throw new Error(`Cannot access the ${bucket} bucket. Please check your permissions.`);
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
      
      // Create a unique filename to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${path ? `${path}/` : ''}${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Simulate upload progress
      const progressKey = `upload-${Date.now()}`;
      progressTimers.current[progressKey] = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 5, 95);
          return newProgress;
        });
      }, 100);
      
      // Upload the file to Supabase Storage
      console.log(`Uploading to bucket: ${bucket}, path: ${fileName}`);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: upsert
        });
      
      // Clear the progress timer
      clearInterval(progressTimers.current[progressKey]);
      delete progressTimers.current[progressKey];
      
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      // Set progress to 100% on success
      setProgress(100);
      
      // Reset the uploading state after a short delay to allow UI to show 100%
      setTimeout(() => {
        setIsUploading(false);
      }, 300);
      
      console.log('File uploaded successfully:', publicUrl);
      toast.success('File uploaded successfully');
      
      return publicUrl;
    } catch (err) {
      // Clear any remaining progress timers
      Object.keys(progressTimers.current).forEach(key => {
        clearInterval(progressTimers.current[key]);
        delete progressTimers.current[key];
      });
      
      const error = err as Error;
      setError(error);
      console.error('File upload error:', error.message);
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
      throw error;
    }
  };
  
  const deleteFile = async (bucket: string, path: string): Promise<void> => {
    try {
      console.log(`Deleting file at ${path} from ${bucket}`);
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) {
        throw error;
      }
      
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
    testBucketAccess,
    isUploading,
    progress,
    error,
    storageStatus
  };
}
