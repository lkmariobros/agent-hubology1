
import React, { useState, useCallback } from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, File, Star, X, MoveHorizontal } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PropertyImage } from '@/types/property-form';

const MediaTab: React.FC = () => {
  const { state, addImage, removeImage, setCoverImage, reorderImages } = usePropertyForm();
  const { images } = state;
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const previewUrl = reader.result as string;
        const newImage: PropertyImage = {
          id: `temp-${Date.now()}-${index}`,
          file,
          url: '',
          previewUrl,
          displayOrder: images.length + index,
          isCover: images.length === 0,
          uploadStatus: 'uploading'
        };
        
        addImage(newImage);
      };
      
      reader.readAsDataURL(file);
    });
  }, [images, addImage]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
  });

  return (
    <div className="space-y-6">
      <div>
        <Label>Property Images</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload images of the property. First image will be the featured image.
        </p>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop the files here' : 'Drag & drop images here or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: JPG, PNG, GIF, WEBP (Max 5MB)
          </p>
        </div>
      </div>
      
      {images.length > 0 && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-4">Uploaded Images</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className="relative border rounded-md overflow-hidden group"
              >
                <div className="aspect-video">
                  <img 
                    src={image.previewUrl || image.url} 
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCoverImage(index)}
                    className={`h-8 w-8 ${image.isCover ? 'bg-primary text-primary-foreground' : 'bg-transparent text-white'}`}
                    title="Set as cover image"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => removeImage(index)}
                    className="h-8 w-8 bg-transparent text-white hover:bg-destructive"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {image.isCover && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Cover
                  </div>
                )}
                
                {image.uploadStatus === 'uploading' && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-white text-xs">Uploading...</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <Label>Property Documents</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload documents related to the property (optional)
        </p>
        
        <Button type="button" variant="outline" className="w-full py-8">
          <File className="h-6 w-6 mr-2" />
          Upload Documents
        </Button>
      </div>
    </div>
  );
};

export default MediaTab;
