
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/types';

interface PropertyCardHeaderProps {
  property: Property;
  currentImageIndex: number;
  isFavorited: boolean;
  onFavoriteClick: () => void;
  onShare?: (id: string) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function PropertyCardHeader({
  property,
  currentImageIndex,
  isFavorited,
  onFavoriteClick,
  onShare,
  onMouseMove
}: PropertyCardHeaderProps) {
  const statusColors = {
    available: 'bg-green-500 text-white',
    pending: 'bg-amber-500 text-white',
    sold: 'bg-red-500 text-white'
  };

  const getPropertyTypeLabel = () => {
    if (property.title && property.title.length > 25) {
      return property.title;
    }
    return null;
  };

  const typeLabel = getPropertyTypeLabel();

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-neutral-800"
      onMouseMove={onMouseMove}
    >
      {property.images && property.images.length > 0 ? (
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
          <span className="text-neutral-500">No image</span>
        </div>
      )}
      
      {/* Status badge - top left */}
      <div className="absolute top-4 left-4 z-10">
        <Badge 
          className={cn(
            "capitalize border-0 px-3 py-0.5 text-xs font-medium rounded-full",
            statusColors[property.status as keyof typeof statusColors] || "bg-neutral-500"
          )}
        >
          {property.status}
        </Badge>
      </div>

      {/* Property type label - top right for specific properties */}
      {typeLabel && (
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            className="capitalize border-0 px-3 py-0.5 text-xs font-medium rounded-full bg-neutral-900/90 text-white"
          >
            {property.type} {property.subtype}
          </Badge>
        </div>
      )}
      
      {/* Action buttons - top right (or centered if type label exists) */}
      <div className={cn(
        "absolute z-10 flex gap-2",
        typeLabel ? "top-16 right-4" : "top-4 right-4"
      )}>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full bg-neutral-800/80 backdrop-blur-sm hover:bg-neutral-800"
          onClick={onFavoriteClick}
        >
          <Heart 
            className={cn(
              "h-4 w-4", 
              isFavorited ? "fill-red-500 text-red-500" : "text-white"
            )} 
          />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full bg-neutral-800/80 backdrop-blur-sm hover:bg-neutral-800"
          onClick={() => onShare?.(property.id)}
        >
          <Share2 className="h-4 w-4 text-white" />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full bg-neutral-800/80 backdrop-blur-sm hover:bg-neutral-800"
        >
          <MoreVertical className="h-4 w-4 text-white" />
        </Button>
      </div>
      
      {/* Image gallery indicator dots */}
      {property.images && property.images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {property.images.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "w-2 h-2 rounded-full",
                idx === currentImageIndex ? "bg-white" : "bg-white/40"
              )} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
