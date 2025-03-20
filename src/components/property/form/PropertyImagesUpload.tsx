
import React, { useCallback, useState } from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Star, X, Image } from 'lucide-react';
import { PropertyImage } from '@/types/property-form';

const PropertyImagesUpload: React.FC = () => {
  const { state, addImage, removeImage, setCoverImage } = usePropertyForm();
  const { images } = state;
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach((file, index) => {
      const isFirstImage = images.length === 0 && index === 0;
      
      const newImage: PropertyImage = {
        file,
        url: URL.createObjectURL(file),
        displayOrder: images.length + index,
        isCover: isFirstImage,
      };
      
      addImage(newImage);
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Images</h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Drag and drop image files here, or click to select files
        </p>
        <Label htmlFor="image-upload" className="cursor-pointer">
          <Button variant="outline" type="button">
            Select Images
          </Button>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Uploaded Images ({images.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`relative rounded-md overflow-hidden aspect-square border ${image.isCover ? 'ring-2 ring-primary' : ''}`}
              >
                <img
                  src={image.url}
                  alt={`Property ${index}`}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCoverImage(index)}
                      title="Set as cover image"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeImage(index)}
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {image.isCover && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs py-0.5 px-2 rounded-sm">
                    Cover
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImagesUpload;
