
import React, { useState, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, Upload, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from '@/types';

interface PropertyMediaUploadProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyMediaUpload: React.FC<PropertyMediaUploadProps> = ({ form }) => {
  const [previewImages, setPreviewImages] = useState<{ file: File; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Validate file types
      const invalidFiles = newFiles.filter(
        file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      );
      
      if (invalidFiles.length > 0) {
        toast.error('Only JPG, PNG and WebP images are allowed');
        return;
      }
      
      // Validate file sizes (max 5MB)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error('Images must be smaller than 5MB');
        return;
      }
      
      // Create preview URLs
      const newPreviews = newFiles.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);
      
      // Store file references in form
      const currentImages = form.getValues('images') || [];
      const newImagePaths = newFiles.map(() => `pending-upload-${Date.now()}`);
      form.setValue('images', [...currentImages, ...newImagePaths], { shouldValidate: true });
      
      toast.success(`${newFiles.length} image(s) added`);
    }
    
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    // Remove from preview
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      // Release object URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    
    // Remove from form
    const images = form.getValues('images') || [];
    const newImages = [...images];
    newImages.splice(index, 1);
    form.setValue('images', newImages, { shouldValidate: true });
    
    toast.info('Image removed');
  };
  
  const clearAllImages = () => {
    // Release all object URLs
    previewImages.forEach(img => URL.revokeObjectURL(img.url));
    
    setPreviewImages([]);
    form.setValue('images', [], { shouldValidate: true });
    toast.info('All images cleared');
  };
  
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Images</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files or click to upload
                </p>
                <div className="flex flex-col items-center">
                  <label htmlFor="image-upload">
                    <input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button type="button" variant="outline" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Images
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or WebP. Max 5MB each.
                  </p>
                </div>
              </div>
              
              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">
                      {previewImages.length} image{previewImages.length !== 1 ? 's' : ''}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAllImages}
                      className="text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewImages.map((img, index) => (
                      <Card key={index} className="relative group overflow-hidden">
                        <img
                          src={img.url}
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <CardContent className="p-2">
                          <p className="text-xs truncate">{img.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(img.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PropertyMediaUpload;
