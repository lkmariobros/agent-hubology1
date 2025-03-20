
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NavigateFunction } from 'react-router-dom';

interface PropertyMediaUploadProps {
  propertyImages: File[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  isSubmitting: boolean;
  prevTab: () => void;
  navigate: NavigateFunction;
}

const PropertyMediaUpload: React.FC<PropertyMediaUploadProps> = ({
  propertyImages,
  handleImageUpload,
  removeImage,
  isSubmitting,
  prevTab,
  navigate,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Property Images (Optional)</h3>
        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop images or click to upload
          </p>
          <label htmlFor="image-upload">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button type="button" variant="outline" className="cursor-pointer">
              Select Images
            </Button>
          </label>
        </div>

        {/* Image Preview */}
        {propertyImages.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-sm font-medium">Uploaded Images:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {propertyImages.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-md overflow-hidden aspect-square border"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Final Submit Buttons */}
      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={prevTab}>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Property'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyMediaUpload;
