
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  maxSize?: number; // in MB
  maxFiles?: number;
  label?: string;
  description?: string;
}

interface UploadedImage {
  file: File;
  status: 'uploading' | 'success' | 'error' | 'completed'; // Added 'completed' as a valid status
  progress: number;
  preview: string;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  maxSize = 5, // 5MB default
  maxFiles = 10,
  label = 'Upload Images',
  description = 'Upload JPEG, PNG, or WebP images'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length === 0) {
      alert('Please drop image files only.');
      return;
    }
    
    handleFiles(files);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };
  
  const handleFiles = (files: File[]) => {
    if (uploadedImages.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }
    
    const validFiles = files.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB <= maxSize;
    });
    
    if (validFiles.length !== files.length) {
      alert(`Some files were too large. Maximum file size is ${maxSize}MB.`);
    }
    
    const newUploadedImages = [
      ...uploadedImages,
      ...validFiles.map(file => ({
        file,
        status: 'uploading' as const,
        progress: 0,
        preview: URL.createObjectURL(file)
      }))
    ];
    
    setUploadedImages(newUploadedImages);
    onUpload(validFiles);
    
    // Simulate upload progress and completion
    validFiles.forEach((file, index) => {
      const fileIndex = uploadedImages.length + index;
      
      const simulateProgress = () => {
        setUploadedImages(prev => {
          const updated = [...prev];
          if (updated[fileIndex]) {
            updated[fileIndex].progress += 10;
            
            if (updated[fileIndex].progress >= 100) {
              updated[fileIndex].status = 'completed';
              clearInterval(intervalId);
            }
          }
          return updated;
        });
      };
      
      const intervalId = setInterval(simulateProgress, 300);
    });
  };
  
  const removeImage = (index: number) => {
    URL.revokeObjectURL(uploadedImages[index].preview);
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label>{label}</Label>
        <div 
          className={cn(
            "mt-2 border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors",
            isDragging && "border-primary bg-accent/50",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload')?.click()}
          tabIndex={0}
          role="button"
          aria-label="Upload images"
        >
          <input 
            type="file" 
            id="image-upload" 
            className="hidden" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center">
            <Image className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {isDragging ? 'Drop images here' : 'Drag and drop or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum file size: {maxSize}MB
            </p>
          </div>
        </div>
      </div>
      
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden bg-muted">
                  <img 
                    src={image.preview} 
                    alt={`Preview ${index + 1}`} 
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="absolute top-2 right-2">
                  {image.status === 'uploading' ? (
                    <div className="bg-white rounded-full p-1">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  ) : image.status === 'error' ? (
                    <div className="bg-white rounded-full p-1">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                  ) : (
                    <div className="bg-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
