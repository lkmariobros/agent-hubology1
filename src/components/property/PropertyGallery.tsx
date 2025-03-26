
import React from 'react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  // Using placeholder for now, in a real app these would be actual image URLs
  const hasImages = images && images.length > 0;
  
  console.log('PropertyGallery received images:', images);
  
  return (
    <div className="space-y-2">
      <div className="aspect-video bg-muted rounded-md overflow-hidden">
        {hasImages ? (
          <img 
            src={images[0]} 
            alt={`${title} main view`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load image:', images[0]);
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
          images.slice(1, 5).map((image, index) => (
            <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
              <img 
                src={image} 
                alt={`${title} view ${index + 2}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load thumbnail:', image);
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
    </div>
  );
};

export default PropertyGallery;
