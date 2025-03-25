
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from "lucide-react";

// Interface for image object
interface ImageFile {
  id?: string;
  name: string;
  file?: File;
  url?: string;
  path?: string;
  uploadStatus?: 'uploading' | 'success' | 'error' | 'completed';
  progress?: number;
  errorMessage?: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onAddImages: (images: ImageFile[]) => void;
  onRemoveImage: (index: number) => void;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onAddImages,
  onRemoveImage,
  maxSize = 5, // 5MB default
  maxFiles = 10,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return { valid: false, error: `File is too large. Maximum size is ${maxSize}MB.` };
    }
    
    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return { valid: false, error: 'File must be an image.' };
    }
    
    return { valid: true };
  };
  
  const processFiles = (files: FileList | null) => {
    if (!files) return;
    
    // Check max files
    if (images.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }
    
    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      const validation = validateFile(file);
      
      if (validation.valid) {
        // Create a new image object
        const newImage: ImageFile = {
          name: file.name,
          file: file,
          uploadStatus: 'completed', // Set as success since we're just mocking here
          progress: 100,
          url: URL.createObjectURL(file), // Create a temporary preview URL
        };
        
        newImages.push(newImage);
      } else {
        // Handle invalid file
        alert(validation.error);
      }
    });
    
    if (newImages.length > 0) {
      onAddImages(newImages);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    processFiles(e.dataTransfer.files);
  };
  
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleChooseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200'} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          transition-colors duration-200
          flex flex-col items-center justify-center text-center space-y-2
        `}
        onClick={disabled ? undefined : handleChooseFiles}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">Drag & Drop Images</h3>
        <p className="text-sm text-muted-foreground">
          or click to browse your files
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: JPG, JPEG, PNG, WebP
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {maxSize}MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/jpg,image/webp"
          disabled={disabled}
          className="hidden"
        />
      </div>
      
      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Uploaded Images ({images.length}/{maxFiles})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
                  {/* Image Preview */}
                  {(image.url || image.path) && (
                    <img 
                      src={image.url || image.path} 
                      alt={image.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {!image.url && !image.path && (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Upload Status Overlay */}
                  {image.uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2">
                      <Loader2 className="h-6 w-6 animate-spin text-white mb-2" />
                      <Progress value={image.progress} className="w-full h-1.5" />
                      <p className="text-xs text-white mt-1">{image.progress}%</p>
                    </div>
                  )}
                  
                  {image.uploadStatus === 'error' && (
                    <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                      <div className="text-white text-center">
                        <AlertCircle className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs">Upload failed</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Success Indicator */}
                {(image.uploadStatus === 'success' || image.uploadStatus === 'completed') && (
                  <div className="absolute top-1 left-1">
                    <div className="bg-green-100 rounded-full p-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                )}
                
                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage(index)}
                  disabled={disabled || image.uploadStatus === 'uploading'}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                {/* Image Name (truncated) */}
                <p className="text-xs truncate mt-1">{image.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
