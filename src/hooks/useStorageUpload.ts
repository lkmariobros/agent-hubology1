
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadOptions {
  bucketName: string;
  folderPath?: string;
  fileNamePrefix?: string;
  isPublic?: boolean;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  path: string;
  url: string;
  size: number;
  contentType: string;
}

/**
 * Hook for managing file uploads to Supabase Storage
 */
export function useStorageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Upload a single file to Supabase Storage
   */
  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> => {
    try {
      const { bucketName, folderPath = '', fileNamePrefix = '', isPublic = true } = options;
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const sanitizedFileName = file.name.replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      const fileName = `${fileNamePrefix}${sanitizedFileName}-${uniqueId}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL if needed
      let url = '';
      if (isPublic) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        
        url = publicUrlData.publicUrl;
      }

      return {
        path: filePath,
        url,
        size: file.size,
        contentType: file.type
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  /**
   * Upload multiple files to Supabase Storage with progress tracking
   */
  const uploadFiles = async (
    files: File[],
    options: UploadOptions
  ): Promise<UploadResult[]> => {
    const { onProgress } = options;
    
    if (!files.length) return [];
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      const results: UploadResult[] = [];
      let completed = 0;
      
      // Ensure the bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(b => b.name === options.bucketName)) {
          await supabase.storage.createBucket(options.bucketName, {
            public: options.isPublic || false
          });
        }
      } catch (error) {
        // Bucket might already exist or user doesn't have permission to list/create buckets
        console.log('Note: Could not verify bucket. Using existing bucket.', error);
      }
      
      // Upload each file
      for (const file of files) {
        const result = await uploadFile(file, options);
        results.push(result);
        
        // Update progress
        completed++;
        const currentProgress = Math.round((completed / files.length) * 100);
        setProgress(currentProgress);
        
        if (onProgress) {
          onProgress(currentProgress);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in uploadFiles:', error);
      toast.error('File upload failed');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete a file from Supabase Storage
   */
  const deleteFile = async (bucketName: string, filePath: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    isUploading,
    progress
  };
}
