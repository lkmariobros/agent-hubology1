
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Check, Image, AlertTriangle, RefreshCcw, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
  const { state, addImage, removeImage, setCoverImage, updateImageStatus } = usePropertyForm();
  const { uploadFile, checkStorageBuckets, forceCheckStorageBuckets, testBucketAccess, isUploading, progress } = useStorageUpload();
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const bucketCheckAttempted = useRef(false);
  const [retryCount, setRetryCount] = useState(0);
  const isComponentMounted = useRef(true);
  const [localUploadState, setLocalUploadState] = useState<Record<string, boolean>>({});
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Check if the storage buckets are accessible
  useEffect(() => {
    isComponentMounted.current = true;
    
    const verifyStorageBuckets = async () => {
      try {
        // Skip if already checking or if we've already checked and not retrying
        if (bucketCheckAttempted.current && retryCount === 0) {
          return;
        }
        
        bucketCheckAttempted.current = true;
        setBucketStatus('checking');
        setDebugInfo(`Checking storage buckets (retry: ${retryCount})`);
        
        // Use force check if this is a retry
        const bucketsExist = retryCount > 0
          ? await forceCheckStorageBuckets(['property-images'])
          : await checkStorageBuckets(['property-images']);
        
        if (!isComponentMounted.current) return;
          
        if (!bucketsExist) {
          console.warn('Property images bucket is not accessible');
          setDebugInfo(`Buckets not found. Attempting direct test...`);
          
          // Try direct bucket access as a fallback
          const directAccess = await testBucketAccess('property-images');
          
          if (directAccess) {
            setBucketStatus('available');
            setDebugInfo(`Direct bucket access successful`);
            toast.success('Successfully connected to storage buckets');
            return;
          }
          
          setBucketStatus('unavailable');
          setDebugInfo(`Failed both bucket listing and direct access`);
          
          // Only show toast on retry to avoid duplicate messages
          if (retryCount > 0) {
            toast.warning('Storage bucket is still not accessible. Please check if the "Property Images" bucket exists in Supabase.');
          }
        } else {
          setDebugInfo('Buckets verified successfully');
          setBucketStatus('available');
          if (retryCount > 0) {
            toast.success('Successfully connected to storage buckets');
          }
        }
      } catch (error) {
        if (!isComponentMounted.current) return;
        console.error('Error checking storage bucket:', error);
        setBucketStatus('unavailable');
        setDebugInfo(`Error checking buckets: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (retryCount > 0) {
          toast.error('Failed to connect to storage buckets');
        }
      }
    };
    
    verifyStorageBuckets();
    
    return () => {
      isComponentMounted.current = false;
    };
  }, [checkStorageBuckets, forceCheckStorageBuckets, testBucketAccess, retryCount]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset any previous errors
    setUploadError(null);

    // Check if we're already at maximum images
    if (state.images.length + acceptedFiles.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    // First verify storage bucket access
    if (bucketStatus !== 'available') {
      setUploadError('Storage bucket is not accessible. Please check your connection and try again.');
      return;
    }

    // Track files being processed
    const fileNames = acceptedFiles.map(file => file.name);
    setProcessingFiles(prev => [...prev, ...fileNames]);

    try {
      for (const [index, file] of acceptedFiles.entries()) {
        // Convert the file to a fake URL for preview
        const previewUrl = URL.createObjectURL(file);

        // Generate a unique ID for this image
        const imageId = `img-${Date.now()}-${index}`;
        
        // Track local upload state for this specific image
        setLocalUploadState(prev => ({
          ...prev,
          [imageId]: true
        }));

        // Add to form state immediately for preview with required properties
        addImage({
          id: imageId,
          file,
          url: previewUrl, // Use preview URL as temporary URL
          displayOrder: state.images.length, // Set the display order based on current image count
          isCover: state.images.length === 0, // First image is cover by default
          previewUrl,
          uploadStatus: 'uploading'
        });

        // Try to upload the file
        try {
          setDebugInfo(`Uploading file: ${file.name} to property-images/properties`);
          const uploadedUrl = await uploadFile(file, {
            bucket: 'property-images',
            path: 'properties',
            maxSizeMB,
            acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
          });
          
          console.log(`Successfully uploaded: ${file.name}`, uploadedUrl);
          setDebugInfo(`Upload successful: ${uploadedUrl}`);
          
          // Find the index of this image in the current state
          const currentIndex = state.images.findIndex(img => img.id === imageId);
          if (currentIndex !== -1) {
            // Update the image status to success and set the actual uploaded URL
            updateImageStatus(currentIndex, 'success', uploadedUrl);
            
            // Update local upload state for this image
            setLocalUploadState(prev => ({
              ...prev,
              [imageId]: false
            }));
          }

          // Add success message with the URL
          setDebugInfo(`Upload successful: ${uploadedUrl}`);
        } catch (error: any) {
          console.error('Error uploading file:', error);
          setDebugInfo(`Upload error: ${error.message || 'Unknown error'}`);
          setUploadError(`Error uploading: ${error.message || 'Unknown error'}`);
          
          // Find the index and update the status to error
          const currentIndex = state.images.findIndex(img => img.id === imageId);
          if (currentIndex !== -1) {
            updateImageStatus(currentIndex, 'error');
            
            // Update local upload state for this image
            setLocalUploadState(prev => ({
              ...prev,
              [imageId]: false
            }));
          }
        }
      }
      
      toast.success(`Added ${acceptedFiles.length} image(s) for upload`);
    } finally {
      // Remove files from processing state
      setProcessingFiles(prev => prev.filter(name => !fileNames.includes(name)));
    }
  }, [state.images, addImage, updateImageStatus, maxImages, maxSizeMB, uploadFile, bucketStatus]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
    disabled: disabled || bucketStatus !== 'available',
    noClick: false, // Allow clicking to trigger file dialog
  });

  const handleRemoveImage = (index: number) => {
    // If the image has an ID, update local state
    const imageId = state.images[index]?.id;
    if (imageId) {
      setLocalUploadState(prev => {
        const newState = { ...prev };
        delete newState[imageId];
        return newState;
      });
    }
    
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
    setRetryCount(prev => prev + 1);
    setDebugInfo("Retrying bucket connection...");
  };

  // Helper to check if the upload is currently in progress
  const isAnyImageUploading = () => {
    return state.images.some(image => image.uploadStatus === 'uploading') || 
           Object.values(localUploadState).some(value => value === true) ||
           isUploading;
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
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertTitle>Storage Configuration Issue</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <p>
              Image uploads will not work. Please check if the "Property Images" bucket exists in your Supabase project.
            </p>
            <div className="flex flex-col space-y-1 text-sm mt-2">
              <p className="font-semibold flex items-center">
                <Info className="h-3 w-3 mr-1" /> Troubleshooting:
              </p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Ensure the 'property-images' bucket exists in your Supabase storage</li>
                <li>Check that your bucket has the correct RLS policies for uploads</li>
                <li>Verify that you are authenticated if the bucket requires authentication</li>
                <li>Go to Supabase Dashboard → Storage to verify bucket settings</li>
              </ol>
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryBucketCheck} 
                className="self-start flex items-center"
              >
                <RefreshCcw className="h-3 w-3 mr-2" />
                Retry Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="self-start flex items-center"
                asChild
              >
                <a href="https://supabase.com/dashboard/project/synabhmsxsvsxkyzhfss/storage/buckets" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Open Supabase Storage
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <Alert variant="default" className="mb-4 bg-muted/50">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription className="font-mono text-xs">Debug: {debugInfo}</AlertDescription>
        </Alert>
      )}

      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          bucketStatus !== 'available' || disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
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
            disabled={bucketStatus !== 'available' || disabled}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {state.images.map((image, index) => {
            // Determine if this image is still uploading
            const isImageUploading = 
              (image.uploadStatus === 'uploading') || 
              (image.id && localUploadState[image.id]);
              
            return (
              <div key={index} className="relative group">
                <div className={cn(
                  "overflow-hidden rounded-lg aspect-square",
                  isImageUploading ? "opacity-70" : ""
                )}>
                  <img 
                    src={image.previewUrl || image.url} 
                    alt={`Property preview ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-transform group-hover:scale-105",
                      image.uploadStatus === 'error' ? 'border-2 border-red-500' : ''
                    )}
                    onError={(e) => {
                      console.error('Failed to load image:', image.previewUrl || image.url);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Image status indicator */}
                {isImageUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                
                {image.uploadStatus === 'error' && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    Failed
                  </div>
                )}
                
                {(image.uploadStatus === 'success' && !isImageUploading) && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    Uploaded
                  </div>
                )}
                
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
                      disabled={isImageUploading}
                    >
                      <Check className="h-4 w-4" />
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
                    disabled={isImageUploading}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
