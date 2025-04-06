
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type UploadOptions = {
  bucket: string;
  path?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
};

export function useStorageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, options: UploadOptions): Promise<string> => {
    const { bucket, path = '', maxSizeMB = 10, acceptedFileTypes = [] } = options;
    
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
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
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
    } catch (err) {
      const error = err as Error;
      setError(error);
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
