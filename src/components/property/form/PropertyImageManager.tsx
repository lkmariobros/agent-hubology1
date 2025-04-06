
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, ImageIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const PropertyImageManager: React.FC = () => {
  const { state, addImage, removeImage, setCoverImage, updateImageStatus } = usePropertyForm();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  // Basic file selection handler
  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    // Check if maximum image count reached
    if (state.images.length + imageFiles.length > 20) {
      toast.error('You can only upload a maximum of 20 images');
      return;
    }

    setIsUploading(true);
    
    // Process each file
    imageFiles.forEach((file, index) => {
      // Size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 5MB size limit`);
        return;
      }

      // Generate a unique ID and preview
      const imageId = uuidv4();
      const previewUrl = URL.createObjectURL(file);
      
      // Add to state with initial status
      const newImage = {
        id: imageId,
        file,
        url: previewUrl,
        previewUrl,
        displayOrder: state.images.length + index,
        isCover: state.images.length === 0 && index === 0,
        uploadStatus: 'success' as 'uploading' | 'success' | 'error'
      };
      
      addImage(newImage);
    });
    
    setIsUploading(false);
    toast.success(`Added ${imageFiles.length} image(s)`);
    
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  // Handle select button click
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
            <ImageIcon className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>

      {/* Preview area */}
      {state.images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {state.images.map((image, index) => (
            <div key={index} className="relative group border rounded-md overflow-hidden">
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
                  >
                    <ImageIcon className="h-4 w-4" />
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
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p>No images added yet</p>
            <p className="text-sm">Images will appear here after you upload them</p>
          </CardContent>
        </Card>
      )}

      {/* Instruction note */}
      <Alert variant="default" className="bg-muted/50">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>
          <strong>Important:</strong> Images are stored locally until you submit the form. They will be uploaded to the server when you submit the property.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PropertyImageManager;
