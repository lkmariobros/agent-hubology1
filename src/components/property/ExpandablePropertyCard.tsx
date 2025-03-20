
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
  Edit2,
  MapPin
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
    available: 'bg-green-500/20 text-green-500',
    pending: 'bg-amber-500/20 text-amber-500',
    sold: 'bg-red-500/20 text-red-500'
  };

  return (
    <div className="relative w-full overflow-visible">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full overflow-visible"
      >
        <Card className={cn(
          "relative overflow-hidden transition-all duration-300 border-0 bg-neutral-900/80 backdrop-blur-sm", 
          isOpen ? "rounded-t-xl" : "rounded-xl",
          className
        )}>
          <div className="relative">
            <AspectRatio ratio={5/3}>
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
                          "w-1.5 h-1.5 rounded-full",
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
                  onClick={handleFavoriteClick}
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
          
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-normal text-white text-lg tracking-tight truncate">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-neutral-400" />
                  <span className="text-xs text-neutral-400 truncate">
                    {property.address.city}, {property.address.state}
                  </span>
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-full hover:bg-neutral-800"
                >
                  {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </Card>
        
        <CollapsibleContent
          className={cn(
            "overflow-hidden transition-all data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
            "rounded-b-xl bg-neutral-900/80 backdrop-blur-sm border-0 border-t border-neutral-800"
          )}
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-neutral-500">Price</p>
                <p className="text-lg font-semibold text-white">{formatPrice(property.price)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Stock</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-white">{property.stock || 1} units</p>
                  {property.stock && property.stock > 5 && (
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between border-t border-neutral-800 pt-3">
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
            
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white rounded-md h-9"
              >
                <span>Sales</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white rounded-md h-9"
              >
                <span>Views</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neutral-700 text-neutral-300 hover:text-white rounded-md h-9"
              >
                <span>Stock</span>
              </Button>
            </div>
            
            {/* Simple line chart visualization */}
            <div className="h-16 w-full bg-transparent px-1 py-2">
              <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d="M0,20 C10,30 20,10 30,20 C40,30 50,5 60,20 C70,35 80,15 90,20 L100,20"
                  fill="none"
                  stroke="rgba(249, 115, 22, 0.5)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            <Button 
              variant="default" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md"
              onClick={() => onEdit?.(property.id)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
