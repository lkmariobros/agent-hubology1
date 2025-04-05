
import { useState } from 'react';
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

  const uploadFile = async (file: File, options: UploadOptions): Promise<string> => {
    const { bucket, path = '', maxSizeMB = 10, acceptedFileTypes = [], upsert = false } = options;
    
    // Reset state
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
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
      
      // Check if bucket exists, if not create it (for local dev only)
      if (window.location.hostname === 'localhost') {
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(b => b.name === bucket)) {
          console.log(`Bucket ${bucket} does not exist, this would fail in production`);
        }
      }
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: upsert,
        });
      
      if (error) throw error;
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data?.path || filePath);
      
      setProgress(100);
      return publicUrl;
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
    isUploading,
    progress,
    error
  };
}
