
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff, AlertCircle, Maximize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PropertyGalleryProps {
  propertyId?: string;
  images?: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ propertyId, images = [], title }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // If propertyId is provided, fetch images directly from the database
        if (propertyId) {
          console.log('PropertyGallery: Fetching images for property ID:', propertyId);
          
          const { data: imageData, error: imageError } = await supabase
            .from('property_images')
            .select('storage_path, is_cover, display_order')
            .eq('property_id', propertyId)
            .order('is_cover', { ascending: false })
            .order('display_order', { ascending: true });
            
          if (imageError) throw imageError;
          
          if (imageData && imageData.length > 0) {
            const paths = imageData.map(img => img.storage_path);
            console.log('PropertyGallery: Found images in DB:', paths);
            setImageUrls(paths);
            setLoading(false);
            return;
          } else {
            console.log('PropertyGallery: No images found in DB for property ID:', propertyId);
          }
        }
        
        // If images array is provided or no DB images found, use those
        if (images && images.length > 0) {
          console.log('PropertyGallery: Using provided image array:', images);
          setImageUrls(images);
          setLoading(false);
          return;
        }
        
        // No images available
        console.log('PropertyGallery: No images available from any source');
        setImageUrls([]);
        setLoading(false);
      } catch (err: any) {
        console.error('PropertyGallery: Error fetching images:', err);
        setError(err.message || 'Failed to load images');
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [propertyId, images]);

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full aspect-[4/3] rounded-md border border-neutral-800/60" />
        <div className="grid grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-md border border-neutral-800/60" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  const hasImages = imageUrls && imageUrls.length > 0;
  
  return (
    <div className="space-y-4">
      {/* Main large image */}
      <div className="w-full aspect-[4/3] bg-black/30 rounded-md overflow-hidden border border-neutral-800/60 shadow-md relative group">
        {hasImages ? (
          <>
            <img 
              src={imageUrls[activeImageIndex]} 
              alt={`${title} main view`} 
              className="w-full h-full object-cover transition-transform duration-300"
              onError={(e) => {
                console.error('Failed to load image:', imageUrls[activeImageIndex]);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="h-8 w-8 text-white opacity-80" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10 mb-2 opacity-40" />
            <span className="text-sm">No images available</span>
          </div>
        )}
      </div>
      
      {/* Thumbnails row - equally sized squares */}
      <div className="grid grid-cols-4 gap-4">
        {hasImages ? (
          imageUrls.slice(0, 4).map((imageUrl, index) => (
            <div 
              key={index} 
              className={`aspect-square bg-black/30 rounded-md overflow-hidden border border-neutral-800/60 shadow-md cursor-pointer transition-all duration-150 ${
                index === activeImageIndex ? 'ring-2 ring-primary/70' : 'hover:ring-1 hover:ring-primary/40'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img 
                src={imageUrl} 
                alt={`${title} view ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load thumbnail:', imageUrl);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          ))
        ) : (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="aspect-square bg-black/30 rounded-md flex items-center justify-center border border-neutral-800/60 shadow-md">
              <ImageOff className="h-4 w-4 opacity-40" />
            </div>
          ))
        )}
      </div>
      
      {/* Development-only debug info */}
      {import.meta.env.DEV && (
        <Card className="mt-4 p-2 border border-dashed border-gray-200 rounded-md bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Debug Info: {imageUrls.length} images</span>
          </div>
          <div>
            <strong>Property ID:</strong> {propertyId || 'Not provided'}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PropertyGallery;
