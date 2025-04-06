
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, X, Star, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { PropertyImage } from '@/types/property-form';
import { v4 as uuidv4 } from 'uuid';

const PropertyImageManager: React.FC = () => {
  const { state, addImage, removeImage, setCoverImage, updateImageStatus } = usePropertyForm();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileSelection = async (files: File[]) => {
    if (state.images.length + files.length > 20) {
      toast.error(`You can only upload a maximum of 20 images`);
      return;
    }

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    for (const file of imageFiles) {
      // Size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 5MB size limit`);
        continue;
      }

      // Generate unique ID for tracking this upload
      const uniqueId = uuidv4();
      const previewUrl = URL.createObjectURL(file);
      
      // Add image to state immediately with uploadStatus="uploading"
      const newImage: PropertyImage = {
        id: uniqueId,
        file,
        url: previewUrl, // Temporary URL for preview
        previewUrl,
        displayOrder: state.images.length,
        isCover: state.images.length === 0, // First image is cover by default
        uploadStatus: 'uploading'
      };
      
      addImage(newImage);
      
      // Start upload process
      await uploadImageToStorage(file, uniqueId);
    }
    
    if (imageFiles.length > 0) {
      toast.success(`Added ${imageFiles.length} image(s)`);
    }
  };

  // Handle file drop
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
      
      // Reset the input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Upload image to Supabase storage
  const uploadImageToStorage = async (file: File, imageId: string) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Find the index of this image in the state
      const imageIndex = state.images.findIndex(img => img.id === imageId);
      if (imageIndex === -1) return;
      
      // Create file path
      const fileExt = file.name.split('.').pop();
      const filePath = `properties/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      console.log(`Starting upload of ${file.name} to path: ${filePath}`);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        setUploadError(`Upload failed: ${error.message}`);
        updateImageStatus(imageIndex, 'error');
        toast.error(`Failed to upload ${file.name}`);
        return;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);
      
      console.log('Upload successful. Public URL:', publicUrl);
      
      // Update image in state with final URL and success status
      updateImageStatus(imageIndex, 'success', publicUrl);
      
      // Log success
      console.log(`File uploaded successfully: ${publicUrl}`);
    } catch (err) {
      const error = err as Error;
      console.error('Unexpected error during upload:', error);
      setUploadError(`Unexpected error: ${error.message}`);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle button click
  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    if (state.images[index]?.previewUrl) {
      URL.revokeObjectURL(state.images[index].previewUrl!);
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
      {uploadError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{uploadError}</AlertDescription>
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
            <Card key={index} className="relative group overflow-hidden">
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
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageManager;
