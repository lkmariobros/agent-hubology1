
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Check, Image } from 'lucide-react';
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
  const { state, addImage, removeImage, setCoverImage } = usePropertyForm();
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

        // In a production environment, we'd actually upload the file here
        if (window.location.hostname !== 'localhost') {
          try {
            await uploadFile(file, {
              bucket: 'property-images',
              path: 'temp',
              maxSizeMB,
              acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
            });
          } catch (error) {
            console.error('Error uploading file:', error);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
      }
    } finally {
      // Remove files from processing state
      setProcessingFiles(prev => prev.filter(name => !fileNames.includes(name)));
    }
  }, [state.images, addImage, maxImages, maxSizeMB, uploadFile]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: isUploading,
    noClick: false, // Allow clicking to trigger file dialog
    noKeyboard: false, // Allow keyboard navigation
  });

  const handleRemoveImage = (index: number) => {
    removeImage(index);
  };

  const handleSetCover = (index: number) => {
    setCoverImage(index);
    toast.success('Cover image updated');
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        } cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag & drop property images</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse (max {maxSizeMB}MB per image)
          </p>
          <Button 
            type="button" 
            variant="secondary" 
            className="mt-2" 
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            <Image className="h-4 w-4 mr-2" />
            Select Files
          </Button>
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
              <div className={`overflow-hidden rounded-lg aspect-square ${image.uploadStatus === 'uploading' ? 'opacity-70' : ''}`}>
                <img 
                  src={image.previewUrl || image.url} 
                  alt={`Property preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              
              {/* Image status indicator */}
              {image.uploadStatus === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex gap-1">
                {!image.isCover && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 opacity-90 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetCover(index);
                    }}
                    title="Set as cover image"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 opacity-90 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {image.isCover && (
                <div className="absolute bottom-2 left-2 text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-md">
                  Cover
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
