
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Check, Image, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  maxImages?: number;
  maxSizeMB?: number;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  maxImages = 10,
  maxSizeMB = 5,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, addImage, removeImage, setCoverImage } = usePropertyForm();
  const { uploadFile, isUploading, progress } = useStorageUpload();
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Check if the storage buckets are accessible
  useEffect(() => {
    const checkBuckets = async () => {
      try {
        setBucketStatus('checking');
        
        // Try to list buckets to check permissions
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error('Error checking buckets:', error);
          setBucketStatus('unavailable');
          return;
        }
        
        const requiredBuckets = ['property-images', 'property-documents'];
        const existingBuckets = buckets.map(b => b.name);
        
        // Check if our required buckets exist
        const allBucketsExist = requiredBuckets.every(bucket => 
          existingBuckets.includes(bucket)
        );
        
        setBucketStatus(allBucketsExist ? 'available' : 'unavailable');
        
        if (!allBucketsExist) {
          console.warn('Missing required buckets. Found:', existingBuckets);
        } else {
          console.log('All required buckets are available:', existingBuckets);
        }
      } catch (error) {
        console.error('Error checking buckets:', error);
        setBucketStatus('unavailable');
      }
    };
    
    checkBuckets();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset any previous errors
    setUploadError(null);

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

        // Try to upload the file
        try {
          const result = await uploadFile(file, {
            bucket: 'property-images',
            path: 'temp',
            maxSizeMB,
            acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
          });
          
          console.log(`Successfully uploaded: ${file.name}`, result);
        } catch (error: any) {
          console.error('Error uploading file:', error);
          setUploadError(`Error uploading: ${error.message || 'Unknown error'}`);
          // We'll still keep the image in the UI for preview purposes
        }
      }
      
      toast.success(`Added ${acceptedFiles.length} image(s) for upload`);
    } finally {
      // Remove files from processing state
      setProcessingFiles(prev => prev.filter(name => !fileNames.includes(name)));
    }
  }, [state.images, addImage, maxImages, maxSizeMB, uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: isUploading || disabled || bucketStatus !== 'available',
    noClick: false, // Allow clicking to trigger file dialog
  });

  const handleRemoveImage = (index: number) => {
    removeImage(index);
  };

  const handleSetCover = (index: number) => {
    setCoverImage(index);
    toast.success('Cover image updated');
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Manually trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const retryBucketCheck = () => {
    setBucketStatus('checking');
    // Re-check bucket status
    setTimeout(async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error('Error checking buckets:', error);
          setBucketStatus('unavailable');
          return;
        }
        
        const requiredBuckets = ['property-images', 'property-documents'];
        const existingBuckets = buckets.map(b => b.name);
        
        const allBucketsExist = requiredBuckets.every(bucket => 
          existingBuckets.includes(bucket)
        );
        
        setBucketStatus(allBucketsExist ? 'available' : 'unavailable');
        
        if (allBucketsExist) {
          toast.success('Storage buckets are now available');
        }
      } catch (error) {
        console.error('Error checking buckets:', error);
        setBucketStatus('unavailable');
      }
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {bucketStatus === 'checking' && (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <AlertDescription>
            Checking storage configuration...
          </AlertDescription>
        </Alert>
      )}

      {bucketStatus === 'unavailable' && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Storage Configuration Issue</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <p>
              Image uploads might not work correctly. This could be due to missing storage buckets or permission issues.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retryBucketCheck} 
              className="self-start flex items-center"
            >
              <RefreshCcw className="h-3 w-3 mr-2" />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        } ${bucketStatus !== 'available' || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} ref={fileInputRef} disabled={bucketStatus !== 'available' || disabled} />
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
            onClick={handleSelectClick}
            disabled={bucketStatus !== 'available' || disabled || isUploading}
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
                  onError={(e) => {
                    console.error('Failed to load image:', image.previewUrl || image.url);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
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
