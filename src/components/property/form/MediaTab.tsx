
import React, { useState } from 'react';
import { usePropertyForm } from '@/context/PropertyForm/PropertyFormContext';
import { Button } from '@/components/ui/button';
import { Upload, X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const MediaTab: React.FC = () => {
  const { state, addImage, removeImage, setCoverImage } = usePropertyForm();
  const { images } = state;
  const [dragging, setDragging] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleFilesSelected = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string;
          
          addImage({
            file,
            url: URL.createObjectURL(file),
            previewUrl,
            displayOrder: images.length,
            isCover: images.length === 0, // First image is cover by default
            uploadStatus: 'uploading',
          });
        };
        
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Property Images</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload images of the property. The first image will be used as the cover image.
        </p>
        
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            dragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="font-medium">Drag and drop your images here</h3>
            <p className="text-sm text-muted-foreground">
              or click to browse (PNG, JPG, JPEG up to 5MB)
            </p>
          </div>
          <div className="mt-4">
            <Label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex h-9 px-4 py-2 bg-primary text-primary-foreground rounded-md items-center justify-center text-sm font-medium"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      
      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative pt-[100%]">
                    <img
                      src={image.previewUrl || image.url}
                      alt={`Property image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded"
                    />
                    
                    {image.isCover && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-primary/80 text-primary-foreground text-xs rounded">
                        Cover
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity">
                      {!image.isCover && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setCoverImage(index)}
                          className="h-8 px-2"
                        >
                          Set as Cover
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaTab;
