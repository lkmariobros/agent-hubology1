
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Share2,
  Bed, 
  Bath, 
  Square, 
  MapPin,
  Building2,
  Store,
  Factory,
  Map,
  Info
} from "lucide-react";
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  isFavorite?: boolean;
  className?: string;
}

export function PropertyCard({ 
  property, 
  onFavorite, 
  onShare, 
  isFavorite = false,
  className = ''
}: PropertyCardProps) {
  const getPropertyTypeIcon = () => {
    switch(property.type) {
      case 'residential':
        return <Building2 className="h-4 w-4" />;
      case 'commercial':
        return <Store className="h-4 w-4" />;
      case 'industrial':
        return <Factory className="h-4 w-4" />;
      case 'land':
        return <Map className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `RM ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `RM ${(price / 1000).toFixed(0)}K`;
    }
    return `RM ${price}`;
  };

  const statusColor = {
    available: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    pending: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
    sold: 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
  };

  return (
    <Card className={`overflow-hidden group hover:shadow-md transition-all ${className}`}>
      <div className="relative">
        <Link to={`/properties/${property.id}`}>
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-48 object-cover group-hover:brightness-95 transition-all"
          />
        </Link>
        
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <Badge 
            variant="outline"
            className={`${statusColor[property.status as keyof typeof statusColor]} capitalize`}
          >
            {property.status}
          </Badge>
          
          <Badge 
            variant="outline" 
            className="bg-background/80 backdrop-blur-sm flex items-center gap-1"
          >
            {getPropertyTypeIcon()}
            {property.subtype}
          </Badge>
        </div>
        
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => onFavorite?.(property.id)}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
          
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => onShare?.(property.id)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="text-primary font-semibold text-lg mb-1">
            {formatPrice(property.price)}
            {property.type === 'commercial' && ' / month'}
          </div>
          <h3 className="font-medium line-clamp-1">{property.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            {property.address.street}, {property.address.city}, {property.address.state}
          </span>
        </div>
        
        <div className="flex justify-between">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.bedrooms} bd</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.bathrooms} ba</span>
            </div>
          )}
          
          {property.area && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.area} ft²</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          asChild
        >
          <Link to={`/properties/${property.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
