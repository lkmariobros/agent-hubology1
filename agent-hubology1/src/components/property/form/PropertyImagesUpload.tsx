
import React, { useState } from 'react';
import { Upload, X, Image, ChevronUp, ChevronDown, Star } from 'lucide-react';
import { usePropertyForm } from '@/context/PropertyForm';
import { PropertyImage } from '@/types/property-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PropertyImagesUpload: React.FC = () => {
  const { state, addImage, removeImage, setCoverImage, reorderImages } = usePropertyForm();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (fileList: FileList) => {
    const files = Array.from(fileList);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please select image files only');
      return;
    }
    
    if (state.images.length + imageFiles.length > 20) {
      toast.error('You can upload a maximum of 20 images');
      return;
    }
    
    // Process each image file
    imageFiles.forEach(file => {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Add to state
      const newImage: PropertyImage = {
        file,
        url: previewUrl,
        displayOrder: state.images.length,
        isCover: state.images.length === 0, // First image is cover by default
      };
      
      addImage(newImage);
    });
    
    toast.success(`${imageFiles.length} image(s) added`);
  };
  
  const handleRemoveImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (state.images[index]?.url) {
      URL.revokeObjectURL(state.images[index].url);
    }
    
    removeImage(index);
    toast.info('Image removed');
  };
  
  const handleSetCover = (index: number) => {
    setCoverImage(index);
    toast.success('Cover image updated');
  };
  
  const moveImageUp = (index: number) => {
    if (index > 0) {
      reorderImages(index, index - 1);
    }
  };
  
  const moveImageDown = (index: number) => {
    if (index < state.images.length - 1) {
      reorderImages(index, index + 1);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Property Images</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Add photos of the property. The first image will be used as the cover photo.
        </p>
        
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "hover:border-primary hover:bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Drag and drop images here or click to browse
          </p>
          <label>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            <Button type="button" variant="outline" className="cursor-pointer">
              Select Images
            </Button>
          </label>
        </div>
      </div>
      
      {/* Image Preview Grid */}
      {state.images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Uploaded Images ({state.images.length}/20)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {state.images.map((image, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full p-1 bg-black/50 text-white text-xs flex items-center">
                  <span className="mr-auto">{index + 1}</span>
                  {image.isCover && (
                    <span className="px-1 bg-yellow-500 rounded text-black ml-1 font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1" /> Cover
                    </span>
                  )}
                </div>
                
                <div className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={`Property ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-black/30"
                      onClick={() => moveImageUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-black/30"
                      onClick={() => moveImageDown(index)}
                      disabled={index === state.images.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex space-x-1">
                    {!image.isCover && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:bg-yellow-500/80"
                        onClick={() => handleSetCover(index)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-red-500/80"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImagesUpload;
