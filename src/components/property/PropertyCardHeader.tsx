
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
    available: 'bg-green-500/80 text-white',
    pending: 'bg-amber-500/80 text-white',
    sold: 'bg-red-500/80 text-white'
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-neutral-800"
      onMouseMove={onMouseMove}
    >
      {property.images && property.images.length > 0 ? (
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.title}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
          {/* Placeholder when no image is available */}
          <span className="text-neutral-500">No image</span>
        </div>
      )}
      
      {/* Status badge - top left */}
      <div className="absolute top-3 left-3 z-10">
        <Badge 
          variant="outline"
          className={cn(
            "capitalize border-0 px-3 py-1 text-xs font-normal rounded-full",
            statusColors[property.status as keyof typeof statusColors] || "bg-neutral-500/80"
          )}
        >
          {property.status}
        </Badge>
      </div>
      
      {/* Action buttons - top right */}
      <div className="absolute top-3 right-3 flex gap-1.5 z-10">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full bg-neutral-800/60 backdrop-blur-sm hover:bg-neutral-800/80"
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
          className="h-8 w-8 rounded-full bg-neutral-800/60 backdrop-blur-sm hover:bg-neutral-800/80"
          onClick={() => onShare?.(property.id)}
        >
          <Share2 className="h-4 w-4 text-white" />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full bg-neutral-800/60 backdrop-blur-sm hover:bg-neutral-800/80"
        >
          <MoreVertical className="h-4 w-4 text-white" />
        </Button>
      </div>
      
      {/* Image gallery indicator dots */}
      {property.images && property.images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
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
