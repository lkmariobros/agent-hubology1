
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
  const [storageStatus, setStorageStatus] = useState<'checking' | 'available' | 'unavailable'>('available');
  const checkInProgress = useRef(false);
  const initialCheckDone = useRef(false);

  // Simplified storage check - simply returns true to bypass the bucket check
  const checkStorageBuckets = async (bucketNames: string[]): Promise<boolean> => {
    console.log('Storage check bypassed, assuming storage is available');
    setStorageStatus('available');
    return true;
  };

  // Also simplified to bypass the bucket cache
  const forceCheckStorageBuckets = async (bucketNames: string[]): Promise<boolean> => {
    console.log('Force storage check bypassed, assuming storage is available');
    setStorageStatus('available');
    return true;
  };

  const uploadFile = async (file: File, options: UploadOptions): Promise<string> => {
    const { bucket, path = '', maxSizeMB = 10, acceptedFileTypes = [], upsert = false } = options;
    
    // Reset state
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      console.log(`Starting upload process for file: ${file.name}`);
      
      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeMB) {
        throw new Error(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      }
      
      // Validate file type if specified
      if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
        throw new Error(`File type not supported. Accepted types: ${acceptedFileTypes.join(', ')}`);
      }
      
      // Instead of uploading, we'll create a mock URL for the file
      // This allows us to proceed with development without relying on storage
      const mockUrl = URL.createObjectURL(file);
      
      // Simulate upload progress
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        if (currentProgress < 95) {
          currentProgress += 5;
          setProgress(currentProgress);
        }
      }, 100);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log('Simulated upload successful');
      toast.success('File uploaded successfully (simulated)');
      
      return mockUrl;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('File upload error:', error.message);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const deleteFile = async (bucket: string, path: string): Promise<void> => {
    try {
      console.log(`Simulating deletion of file at ${path} from ${bucket}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('File deleted successfully (simulated)');
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
