
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, ImageOff, AlertCircle } from 'lucide-react';
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
  const [debugData, setDebugData] = useState<any>(null);
  
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
            setDebugData({ source: 'database', count: paths.length, paths });
            setLoading(false);
            return;
          } else {
            console.log('PropertyGallery: No images found in DB for property ID:', propertyId);
            setDebugData({ source: 'database', count: 0 });
          }
        }
        
        // If images array is provided or no DB images found, use those
        if (images && images.length > 0) {
          console.log('PropertyGallery: Using provided image array:', images);
          setImageUrls(images);
          setDebugData({ source: 'props', count: images.length, images });
          setLoading(false);
          return;
        }
        
        // No images available
        console.log('PropertyGallery: No images available from any source');
        setImageUrls([]);
        setDebugData({ source: 'none', message: 'No images available from any source' });
        setLoading(false);
      } catch (err: any) {
        console.error('PropertyGallery: Error fetching images:', err);
        setError(err.message || 'Failed to load images');
        setDebugData({ error: err.message, code: err.code });
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [propertyId, images]);
  
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="aspect-video w-full h-48" />
        <div className="grid grid-cols-4 gap-2">
          {Array(4).fill(0).map((_, index) => (
            <Skeleton key={index} className="aspect-square h-12" />
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
    <div className="space-y-2">
      <div className="aspect-video bg-black/20 rounded-md overflow-hidden h-48 max-h-48">
        {hasImages ? (
          <img 
            src={imageUrls[0]} 
            alt={`${title} main view`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load image:', imageUrls[0]);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8 mb-2 opacity-40" />
            <span className="text-sm">No images available</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {hasImages ? (
          imageUrls.slice(1, 5).map((imageUrl, index) => (
            <div key={index} className="aspect-square bg-black/20 rounded-md overflow-hidden h-12">
              <img 
                src={imageUrl} 
                alt={`${title} view ${index + 2}`}
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
            <div key={index} className="aspect-square bg-black/20 rounded-md h-12 flex items-center justify-center">
              <ImageOff className="h-3 w-3 opacity-20" />
            </div>
          ))
        )}
      </div>
      
      {/* Enhanced debug info */}
      {import.meta.env.DEV && (
        <Card className="mt-2 p-2 border border-dashed border-gray-200 rounded-md bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Debug Info: {imageUrls.length} images</span>
            {hasImages && (
              <a 
                href="https://supabase.com/dashboard/project/synabhmsxsvsxkyzhfss/storage/buckets/property-images/explore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:underline"
              >
                <ExternalLink size={12} className="mr-1" />
                View in Supabase
              </a>
            )}
          </div>
          <div className="overflow-x-auto">
            {debugData && (
              <pre className="text-xs overflow-auto max-h-40">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            )}
            <div className="mt-2">
              <strong>Property ID:</strong> {propertyId || 'Not provided'}
            </div>
            <div className="mt-2">
              <strong>Image URLs:</strong>
              {imageUrls && imageUrls.length > 0 ? (
                <ul className="list-disc pl-4">
                  {imageUrls.map((url, idx) => (
                    <li key={idx} className="truncate hover:text-clip">
                      {idx+1}. {url}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-500">No image URLs available</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PropertyGallery;
