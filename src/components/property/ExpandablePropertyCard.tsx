
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  ChevronUp,
  Edit,
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

  const statusColor = {
    available: 'bg-green-500/20 text-green-500 hover:bg-green-500/30',
    pending: 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30',
    sold: 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md border-neutral-800 bg-black", 
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
              className="w-full h-full relative overflow-hidden"
              onMouseMove={handleMouseMove}
            >
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                  {getPropertyTypeIcon(property.type)}
                </div>
              )}
              
              {/* Image indicator dots */}
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {property.images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      )} 
                    />
                  ))}
                </div>
              )}
            </div>
          </AspectRatio>
          
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <Badge 
              variant="outline"
              className={`${statusColor[property.status as keyof typeof statusColor]} capitalize text-xs`}
            >
              {property.status}
            </Badge>
            
            <div className="flex gap-1">
              <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 border-neutral-700"
                onClick={handleFavoriteClick}
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-300'}`} 
                />
              </Button>
              
              <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 border-neutral-700"
                onClick={() => onShare?.(property.id)}
              >
                <Share2 className="h-4 w-4 text-neutral-300" />
              </Button>
              
              <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 border-neutral-700"
              >
                <MoreVertical className="h-4 w-4 text-neutral-300" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white truncate">{property.title}</h3>
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
          
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-3 border-t border-b border-neutral-800 py-3">
              <div>
                <p className="text-xs text-neutral-400">Price</p>
                <p className="text-lg font-semibold text-white">{formatPrice(property.price)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Status</p>
                <div className="flex items-center gap-1">
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
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm">{property.bedrooms} bd</span>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm">{property.bathrooms} ba</span>
                </div>
              )}
              
              {property.area && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm">{property.area} ft²</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between gap-3 pt-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white flex-1"
              >
                <LineChart className="h-4 w-4 mr-1" />
                <span>Sales</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white flex-1"
              >
                <span>Views</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white flex-1"
              >
                <span>Stock</span>
              </Button>
            </div>
            
            <Button 
              variant="default" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
