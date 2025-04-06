import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!images || images.length === 0) {
        setImageUrls([]);
        setLoading(false);
        return;
      }
      
      try {
        const urls = await Promise.all(
          images.map(async (path) => {
            // If it's already a full URL, return it
            if (path.startsWith('http')) {
              return path;
            }
            
            // Otherwise get the URL from Supabase
            const { data } = supabase.storage
              .from('property-images')
              .getPublicUrl(path);
              
            return data.publicUrl;
          })
        );
        
        console.log('Fetched image URLs:', urls);
        setImageUrls(urls);
      } catch (err) {
        console.error('Error fetching image URLs:', err);
        setError('Failed to load images');
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
      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  const hasImages = imageUrls && imageUrls.length > 0;
  
  return (
    <div className="space-y-2">
      <div className="aspect-video bg-muted rounded-md overflow-hidden">
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
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">No main image available</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {hasImages ? (
          imageUrls.slice(1, 5).map((imageUrl, index) => (
            <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
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
            <div key={index} className="aspect-square bg-muted rounded-md"></div>
          ))
        )}
      </div>
      
      {/* Image debug info - only in development */}
      {import.meta.env.DEV && hasImages && (
        <div className="mt-2 p-2 border border-dashed border-gray-200 rounded-md bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Debug Info: {images.length} images</span>
            <a 
              href="https://supabase.com/dashboard/project/synabhmsxsvsxkyzhfss/storage/buckets/property-images/explore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:underline"
            >
              <ExternalLink size={12} className="mr-1" />
              View in Supabase
            </a>
          </div>
          <div className="overflow-x-auto">
            {images.map((path, idx) => (
              <div key={idx} className="truncate hover:text-clip">
                {idx+1}. {path}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
