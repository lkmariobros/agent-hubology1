
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, ImageOff, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);
  
  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!images || images.length === 0) {
        console.log('PropertyGallery: No images provided');
        setImageUrls([]);
        setLoading(false);
        return;
      }
      
      console.log('PropertyGallery: Fetching URLs for images:', images);
      setDebugData({ originalImages: images });
      
      try {
        const urls = await Promise.all(
          images.map(async (path) => {
            // If it's already a full URL, return it
            if (path.startsWith('http')) {
              return path;
            }
            
            // Check if the bucket exists
            const { data: buckets, error: bucketError } = await supabase
              .storage
              .listBuckets();
            
            const propertyImagesBucketExists = buckets?.some(b => b.name === 'property-images');
            
            if (bucketError || !propertyImagesBucketExists) {
              console.error('PropertyGallery: Error checking buckets:', bucketError);
              setDebugData(prev => ({ ...prev, bucketError, buckets }));
              throw new Error('Property images storage is not properly configured');
            }
            
            // Try to get public URL - this method doesn't return an error property
            const { data } = await supabase.storage
              .from('property-images')
              .getPublicUrl(path);
              
            return data.publicUrl;
          })
        );
        
        console.log('PropertyGallery: Fetched image URLs:', urls);
        setDebugData(prev => ({ ...prev, urls }));
        setImageUrls(urls);
      } catch (err: any) {
        console.error('PropertyGallery: Error fetching image URLs:', err);
        setError(err.message || 'Failed to load images');
        setDebugData(prev => ({ ...prev, error: err }));
      } finally {
        setLoading(false);
      }
    };
    
    fetchImageUrls();
  }, [images]);
  
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="aspect-video w-full h-64" />
        <div className="grid grid-cols-4 gap-2">
          {Array(4).fill(0).map((_, index) => (
            <Skeleton key={index} className="aspect-square" />
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
      <div className="aspect-video bg-black/20 rounded-md overflow-hidden">
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
            <ImageOff className="h-12 w-12 mb-2 opacity-40" />
            <span>No images available</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {hasImages ? (
          imageUrls.slice(1, 5).map((imageUrl, index) => (
            <div key={index} className="aspect-square bg-black/20 rounded-md overflow-hidden">
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
            <div key={index} className="aspect-square bg-black/20 rounded-md flex items-center justify-center">
              <ImageOff className="h-5 w-5 opacity-20" />
            </div>
          ))
        )}
      </div>
      
      {/* Enhanced debug info */}
      {import.meta.env.DEV && (
        <Card className="mt-2 p-2 border border-dashed border-gray-200 rounded-md bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Debug Info: {images ? images.length : 0} images</span>
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
              <strong>Original image paths:</strong>
              {images && images.length > 0 ? (
                <ul className="list-disc pl-4">
                  {images.map((path, idx) => (
                    <li key={idx} className="truncate hover:text-clip">
                      {idx+1}. {path}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-500">No image paths provided</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PropertyGallery;
