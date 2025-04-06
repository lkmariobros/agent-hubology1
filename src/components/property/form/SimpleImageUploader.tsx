import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, X, Star, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { PropertyImage } from '@/types/property-form';
import { v4 as uuidv4 } from 'uuid';

const SimpleImageUploader: React.FC = () => {
  const { state, addImage, removeImage, setCoverImage, updateImageStatus } = usePropertyForm();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleFileSelection = async (files: File[]) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    if (state.images.length + imageFiles.length > 20) {
      toast.error('You can only upload a maximum of 20 images');
      return;
    }

    // Check if bucket exists before processing files
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error("Error checking buckets:", bucketsError);
        setError(`Storage error: ${bucketsError.message}`);
        toast.error("Unable to access storage buckets. Image uploads may fail.");
      } else {
        const bucketExists = buckets?.some(b => b.name === 'property-images');
        if (!bucketExists) {
          console.error("Property-images bucket does not exist");
          setError("The required storage bucket 'property-images' does not exist. Please create it in the Supabase dashboard.");
          toast.error("Storage configuration issue detected. Images cannot be uploaded.");
          return;
        }
      }
    } catch (err: any) {
      console.error("Error checking buckets:", err);
      setError(`Storage configuration error: ${err.message}`);
      toast.error("Error verifying storage configuration. Image uploads may fail.");
    }

    for (const file of imageFiles) {
      // Size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 5MB size limit`);
        continue;
      }

      // Create unique ID for tracking
      const imageId = uuidv4();
      
      // Create a blob URL for preview
      const previewUrl = URL.createObjectURL(file);
      
      // Add to state with uploading status
      const newImage: PropertyImage = {
        id: imageId,
        file,
        url: previewUrl,
        previewUrl,
        displayOrder: state.images.length,
        isCover: state.images.length === 0,
        uploadStatus: 'uploading'
      };
      
      addImage(newImage);
      
      // Set initial progress
      setUploadProgress(prev => ({...prev, [imageId]: 0}));
      
      // Perform upload
      uploadImageDirectly(file, imageId);
    }
  };

  const uploadImageDirectly = async (file: File, imageId: string) => {
    try {
      setError(null);
      
      // Find the index of this image in the state
      const imageIndex = state.images.findIndex(img => img.id === imageId);
      if (imageIndex === -1) return;
      
      // Simple path generation
      const fileExt = file.name.split('.').pop();
      const filePath = `property-images/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Create FormData for a more reliable upload approach
      const formData = new FormData();
      formData.append('file', file);
      
      // Use the fetch API for direct upload - this bypasses Supabase SDK
      // which might be having issues with the current setup
      const res = await fetch(`https://synabhmsxsvsxkyzhfss.supabase.co/storage/v1/object/property-images/${filePath}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token)}`,
          'x-upsert': 'false',
        },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      
      // Simulate progress updates during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[imageId] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return {...prev, [imageId]: currentProgress + 10};
        });
      }, 300);
      
      // Get the public URL after successful upload
      const publicUrl = `https://synabhmsxsvsxkyzhfss.supabase.co/storage/v1/object/public/property-images/${filePath}`;
      
      // Final progress update
      setUploadProgress(prev => ({...prev, [imageId]: 100}));
      
      // Update state with success status and final URL
      updateImageStatus(imageIndex, 'success', publicUrl);
      
      toast.success(`Image uploaded successfully`);
      clearInterval(progressInterval);
    } catch (err) {
      console.error('Error uploading image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Upload error: ${errorMessage}`);
      
      // Find index and update status to error
      const imageIndex = state.images.findIndex(img => img.id === imageId);
      if (imageIndex !== -1) {
        updateImageStatus(imageIndex, 'error');
      }
      
      toast.error('Failed to upload image. Please try again.');
    }
  };

  // Alternative direct upload method using XMLHttpRequest for progress monitoring
  const uploadWithProgress = (file: File, imageId: string) => {
    try {
      // Find the index of this image in the state
      const imageIndex = state.images.findIndex(img => img.id === imageId);
      if (imageIndex === -1) return;
      
      // Simple path generation
      const fileExt = file.name.split('.').pop();
      const filePath = `property-images/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Create XHR for progress monitoring
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => ({...prev, [imageId]: percentComplete}));
        }
      };
      
      // Handle completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Get the public URL after successful upload
          const publicUrl = `https://synabhmsxsvsxkyzhfss.supabase.co/storage/v1/object/public/property-images/${filePath}`;
          
          // Update state with success status and final URL
          updateImageStatus(imageIndex, 'success', publicUrl);
          
          toast.success(`Image uploaded successfully`);
        } else {
          console.error('XHR upload failed:', xhr.statusText);
          updateImageStatus(imageIndex, 'error');
          toast.error(`Upload failed: ${xhr.statusText}`);
        }
      };
      
      // Handle errors
      xhr.onerror = () => {
        console.error('XHR upload error');
        updateImageStatus(imageIndex, 'error');
        toast.error('Upload failed due to a network error');
      };
      
      // Open connection and set headers
      xhr.open('POST', `https://synabhmsxsvsxkyzhfss.supabase.co/storage/v1/object/property-images/${filePath}`);
      xhr.setRequestHeader('Authorization', 'Bearer ' + supabase.auth.getSession().then(({ data }) => data.session?.access_token));
      xhr.setRequestHeader('x-upsert', 'false');
      
      // Create and send FormData
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    } catch (err) {
      console.error('Error in uploadWithProgress:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Upload error: ${errorMessage}`);
      
      // Find index and update status to error
      const imageIndex = state.images.findIndex(img => img.id === imageId);
      if (imageIndex !== -1) {
        updateImageStatus(imageIndex, 'error');
      }
      
      toast.error('Failed to upload image. Please try again.');
    }
  };

  // Handle file drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFileSelection(files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFileSelection(files);
      
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Handle select files button click
  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    // Release object URL to prevent memory leaks
    if (state.images[index]?.previewUrl) {
      URL.revokeObjectURL(state.images[index].previewUrl!);
    }
    
    // Also clear progress tracking if it exists
    if (state.images[index]?.id) {
      setUploadProgress(prev => {
        const newProgress = {...prev};
        delete newProgress[state.images[index].id!];
        return newProgress;
      });
    }
    
    removeImage(index);
    toast.info('Image removed');
  };

  // Set an image as cover
  const handleSetCover = (index: number) => {
    setCoverImage(index);
    toast.success('Cover image updated');
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Upload area */}
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          "cursor-pointer"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={handleSelectClick}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag & drop property images</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse (max 5MB per image)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
          <Button 
            type="button" 
            variant="secondary" 
            className="mt-2"
          >
            Select Files
          </Button>
        </div>
      </div>

      {/* Image upload warning banner */}
      {state.images.some(img => img.uploadStatus === 'uploading') && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-400">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          <AlertDescription className="text-yellow-800 font-medium">
            Please wait for image uploads to complete before proceeding
          </AlertDescription>
        </Alert>
      )}

      {/* Preview area */}
      {state.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {state.images.map((image, index) => (
            <div key={index} className="relative overflow-hidden group border rounded-md">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.previewUrl || image.url} 
                  alt={`Property preview ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', image.url);
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
              </div>
              
              {/* Upload status indicator */}
              {image.uploadStatus === 'uploading' && (
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                  {image.id && uploadProgress[image.id] > 0 && (
                    <div className="text-white text-sm">
                      {uploadProgress[image.id]}%
                    </div>
                  )}
                </div>
              )}
              
              {image.uploadStatus === 'error' && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                  Upload Failed
                </div>
              )}
              
              {image.uploadStatus === 'success' && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                  Uploaded
                </div>
              )}
              
              {/* Cover badge */}
              {image.isCover && (
                <div className="absolute bottom-2 left-2 text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-md">
                  Cover
                </div>
              )}
              
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!image.isCover && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetCover(index);
                    }}
                    title="Set as cover image"
                    disabled={image.uploadStatus === 'uploading'}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  title="Remove image"
                  disabled={image.uploadStatus === 'uploading'}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleImageUploader;
