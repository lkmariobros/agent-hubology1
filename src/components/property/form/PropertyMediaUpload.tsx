
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NavigateFunction } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PropertyMediaUploadProps {
  propertyImages: File[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  isSubmitting: boolean;
  uploadProgress?: number;
  prevTab: () => void;
  navigate: NavigateFunction;
}

const PropertyMediaUpload: React.FC<PropertyMediaUploadProps> = ({
  propertyImages,
  handleImageUpload,
  removeImage,
  isSubmitting,
  uploadProgress = 0,
  prevTab,
  navigate,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  
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
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        toast.error('Please select image files only');
        return;
      }
      
      // Create a fake change event
      const fakeEvent = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleImageUpload(fakeEvent);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Property Images</h3>
        <p className="text-sm text-muted-foreground">
          Images help your listing stand out. You can add up to 20 images.
        </p>
        
        <div
          className={cn(
            "border-2 border-dashed rounded-md p-6 flex flex-col items-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Drag and drop images here or click to browse
          </p>
          <label htmlFor="image-upload">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={isSubmitting}
            />
            <Button 
              type="button" 
              variant="outline" 
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              Select Images
            </Button>
          </label>
        </div>
      </div>

      {/* Image Preview */}
      {propertyImages.length > 0 && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Uploaded Images</p>
            <p className="text-xs text-muted-foreground">{propertyImages.length}/20</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {propertyImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-md overflow-hidden aspect-square border group"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Property ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Progress */}
      {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading images...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Final Submit Buttons */}
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevTab}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/properties')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create Property'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyMediaUpload;
