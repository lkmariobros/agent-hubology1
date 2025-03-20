
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
    available: 'bg-green-500/20 text-green-500',
    pending: 'bg-amber-500/20 text-amber-500',
    sold: 'bg-red-500/20 text-red-500'
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
          {/* Placeholder or icon */}
        </div>
      )}
      
      {/* Image indicator dots */}
      {property.images && property.images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {property.images.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                idx === currentImageIndex ? "bg-white" : "bg-white/40"
              )} 
            />
          ))}
        </div>
      )}

      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        <Badge 
          variant="outline"
          className={cn(
            "rounded-md capitalize border-0 px-2 py-1 text-xs font-normal",
            statusColors[property.status as keyof typeof statusColors] || "bg-neutral-500/20"
          )}
        >
          {property.status}
        </Badge>
        
        <div className="flex gap-1.5">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
            onClick={onFavoriteClick}
          >
            <Heart 
              className={cn(
                "h-3.5 w-3.5", 
                isFavorited ? "fill-red-500 text-red-500" : "text-white"
              )} 
            />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
            onClick={() => onShare?.(property.id)}
          >
            <Share2 className="h-3.5 w-3.5 text-white" />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
          >
            <MoreVertical className="h-3.5 w-3.5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
