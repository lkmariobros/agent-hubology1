
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface UploadOptions {
  bucket: string;
  path?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

export interface UploadResult {
  path: string;
  url: string;
  id?: string;
}

export const useStorageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Upload a single file to Supabase Storage
   */
  const uploadFile = async (
    file: File, 
    options: UploadOptions
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === options.bucket);
      
      if (!bucketExists) {
        throw new Error(`Bucket ${options.bucket} does not exist`);
      }
      
      // Validate file size
      if (options.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds maximum allowed size of ${options.maxSizeMB}MB`);
      }
      
      // Validate file type
      if (options.acceptedFileTypes && !options.acceptedFileTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not supported. Supported types: ${options.acceptedFileTypes.join(', ')}`);
      }
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${options.path || ''}${options.path ? '/' : ''}${uuidv4()}.${fileExt}`;
      
      // Upload the file
      const { data, error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);
      
      setProgress(100);
      return { 
        path: filePath,
        url: publicUrl,
        id: data?.id
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload file';
      setError(err);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Upload multiple files to Supabase Storage
   */
  const uploadFiles = async (
    files: File[], 
    options: UploadOptions
  ): Promise<UploadResult[]> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const results: UploadResult[] = [];
      let completed = 0;
      
      for (const file of files) {
        try {
          const result = await uploadFile(file, options);
          results.push(result);
        } catch (err) {
          console.error('Error uploading file:', err);
          // Continue with next file
        }
        
        completed++;
        setProgress(Math.round((completed / files.length) * 100));
      }
      
      return results;
    } catch (err: any) {
      setError(err);
      toast.error('Some files failed to upload');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Delete a file from Supabase Storage
   */
  const deleteFile = async (bucket: string, path: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
        
      if (error) {
        throw error;
      }
    } catch (err: any) {
      toast.error(`Failed to delete file: ${err.message}`);
      throw err;
    }
  };
  
  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    isUploading,
    progress,
    error
  };
};
