
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  MoreVertical,
  Bed,
  Bath,
  Square,
  LineChart,
  Edit2
} from 'lucide-react';
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import { formatPrice, getPropertyTypeIcon } from '@/utils/propertyUtils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExpandablePropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

export function ExpandablePropertyCard({ 
  property, 
  onFavorite, 
  onShare, 
  onEdit,
  className = ''
}: ExpandablePropertyCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Function to cycle through images based on cursor position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (property.images.length <= 1) return;
    
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const position = (clientX - left) / width;
    const imageIndex = Math.min(
      Math.floor(position * property.images.length),
      property.images.length - 1
    );
    setCurrentImageIndex(imageIndex);
  };

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    if (onFavorite) onFavorite(property.id);
  };

  const statusColors = {
    available: 'bg-green-500 text-black',
    pending: 'bg-amber-500 text-black',
    sold: 'bg-red-500 text-white'
  };

  const iconButtonClass = "h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700";

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg border-0 bg-neutral-900", 
      isOpen ? "scale-[1.02]" : "",
      className
    )}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="relative">
          <AspectRatio ratio={4/3}>
            <div 
              className="w-full h-full relative overflow-hidden bg-neutral-800"
              onMouseMove={handleMouseMove}
            >
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                  {getPropertyTypeIcon(property.type)}
                </div>
              )}
              
              {/* Image indicator dots */}
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
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
          </AspectRatio>
          
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <Badge 
              className={cn(
                "px-3 py-1 rounded-full font-medium capitalize border-0",
                statusColors[property.status as keyof typeof statusColors] || "bg-neutral-500"
              )}
            >
              {property.status}
            </Badge>
            
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className={iconButtonClass}
                onClick={handleFavoriteClick}
              >
                <Heart 
                  className={cn(
                    "h-5 w-5", 
                    isFavorited ? "fill-red-500 text-red-500" : "text-white"
                  )} 
                />
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className={iconButtonClass}
                onClick={() => onShare?.(property.id)}
              >
                <Share2 className="h-5 w-5 text-white" />
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className={iconButtonClass}
              >
                <MoreVertical className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white text-base tracking-tight truncate">
                {property.title}
              </h3>
              <p className="text-sm text-neutral-400">{property.subtype}</p>
            </div>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-neutral-800"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3 border-t border-b border-neutral-800 py-3">
              <div>
                <p className="text-xs text-neutral-500">Price</p>
                <p className="text-lg font-semibold text-white">{formatPrice(property.price)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Status</p>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "inline-block w-2 h-2 rounded-full",
                    property.status === 'available' ? 'bg-green-500' : 
                    property.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  )}></span>
                  <p className="text-sm capitalize">{property.status}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              {property.bedrooms && (
                <div className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm">{property.bedrooms} beds</span>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm">{property.bathrooms} baths</span>
                </div>
              )}
              
              {property.area && (
                <div className="flex items-center gap-1.5">
                  <Square className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm">{property.area} ft²</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between gap-3 pt-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white flex-1 rounded-full"
              >
                <LineChart className="h-4 w-4 mr-1" />
                <span>Sales</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white flex-1 rounded-full"
              >
                <span>Views</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white flex-1 rounded-full"
              >
                <span>Stock</span>
              </Button>
            </div>
            
            <Button 
              variant="default" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full"
              onClick={() => onEdit?.(property.id)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </Card>
  );
}
