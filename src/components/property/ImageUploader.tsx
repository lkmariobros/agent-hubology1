
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { toast } from 'sonner';

interface ImageUploaderProps {
  maxImages?: number;
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  maxImages = 10,
  maxSizeMB = 5
}) => {
  const { state, addImage, removeImage } = usePropertyForm();
  const { uploadFile, isUploading, progress } = useStorageUpload();
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Check if we're already at maximum images
    if (state.images.length + acceptedFiles.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    // Track files being processed
    const fileNames = acceptedFiles.map(file => file.name);
    setProcessingFiles(prev => [...prev, ...fileNames]);

    try {
      for (const file of acceptedFiles) {
        // Convert the file to a fake URL for preview
        const previewUrl = URL.createObjectURL(file);

        // Add to form state immediately for preview with required properties
        addImage({
          file,
          url: previewUrl, // Use preview URL as temporary URL
          displayOrder: state.images.length, // Set the display order based on current image count
          isCover: state.images.length === 0, // First image is cover by default
          previewUrl,
          uploadStatus: 'uploading'
        });

        try {
          // If connected to Supabase, try uploading
          if (window.location.hostname !== 'localhost') {
            console.log('Uploading file to Supabase:', file.name);
            const result = await uploadFile(file, {
              bucket: 'property-images',
              path: 'temp',
              maxSizeMB,
              acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
            });
            
            console.log('Upload result:', result);
            
            // Update the image with the real URL from Supabase
            removeImage(state.images.length - 1);
            addImage({
              file,
              url: result.url,
              storagePath: result.path,
              displayOrder: state.images.length - 1,
              isCover: state.images.length === 1, // First image is cover by default
              previewUrl,
              uploadStatus: 'completed'
            });
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } finally {
      // Remove files from processing state
      setProcessingFiles(prev => prev.filter(name => !fileNames.includes(name)));
    }
  }, [state.images, addImage, removeImage, maxImages, maxSizeMB, uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: isUploading
  });

  const handleRemoveImage = (index: number) => {
    // If the image has a preview URL, revoke it to prevent memory leaks
    const image = state.images[index];
    if (image.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }
    removeImage(index);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag & drop property images</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse (max {maxSizeMB}MB per image)
          </p>
          {isUploading && (
            <div className="mt-2 flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Uploading... {progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      {state.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {state.images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="overflow-hidden rounded-lg aspect-square">
                <img 
                  src={image.previewUrl || image.url} 
                  alt={`Property preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-80 shadow-md"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {image.isCover && (
                <div className="absolute bottom-2 left-2 text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-md">
                  Cover
                </div>
              )}
              {image.uploadStatus === 'uploading' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
