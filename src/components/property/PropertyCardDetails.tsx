
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, Edit2, Calendar, Eye, Tag, Users, Building } from 'lucide-react';
import { formatPrice } from '@/utils/propertyUtils';
import { Property } from '@/types';
import { Badge } from '../ui/badge';

interface PropertyCardDetailsProps {
  property: Property;
  onEdit?: (id: string) => void;
}

export function PropertyCardDetails({ property, onEdit }: PropertyCardDetailsProps) {
  return (
    <div className="p-4 pt-0 space-y-4">
      {/* Price and stock info */}
      <div className="grid grid-cols-2 gap-3 pt-3">
        <div>
          <p className="text-xs text-neutral-400 mb-1">Price</p>
          <p className="text-lg font-semibold text-orange-500">{formatPrice(property.price)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-400 mb-1">Units Available</p>
          <div className="flex items-center gap-1.5">
            <p className="text-white">{property.stock || 1}</p>
            {property.stock && property.stock > 5 && (
              <Badge variant="outline" className="bg-green-500/20 text-green-500 text-xs px-1.5 border-0">In Stock</Badge>
            )}
            {property.stock && property.stock <= 5 && property.stock > 0 && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-500 text-xs px-1.5 border-0">Limited</Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Property specs */}
      <div className="grid grid-cols-3 gap-2 border-t border-neutral-800 pt-3">
        {property.bedrooms && (
          <div className="flex flex-col items-center p-2 bg-neutral-800/50 rounded-md">
            <Bed className="h-4 w-4 text-neutral-400 mb-1" />
            <span className="text-xs">{property.bedrooms} beds</span>
          </div>
        )}
        
        {property.bathrooms && (
          <div className="flex flex-col items-center p-2 bg-neutral-800/50 rounded-md">
            <Bath className="h-4 w-4 text-neutral-400 mb-1" />
            <span className="text-xs">{property.bathrooms} baths</span>
          </div>
        )}
        
        {property.area && (
          <div className="flex flex-col items-center p-2 bg-neutral-800/50 rounded-md">
            <Square className="h-4 w-4 text-neutral-400 mb-1" />
            <span className="text-xs">{property.area} ft²</span>
          </div>
        )}
      </div>
      
      {/* Property features/tags */}
      <div className="flex flex-wrap gap-1.5">
        {property.features && property.features.map((feature, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="text-xs bg-neutral-800/80 border-neutral-700 text-neutral-300"
          >
            {feature}
          </Badge>
        ))}
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-2 border-t border-neutral-800 pt-3">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400">Listed</p>
          <p className="text-xs">2 days</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Eye className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400">Views</p>
          <p className="text-xs">278</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Users className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400">Interested</p>
          <p className="text-xs">38</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Building className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400">Type</p>
          <p className="text-xs capitalize">{property.subtype}</p>
        </div>
      </div>
      
      {/* Simple activity visualization */}
      <div className="h-16 w-full bg-transparent px-1 py-2 border-t border-neutral-800">
        <p className="text-xs text-neutral-400 mb-2">Property Interest (7 days)</p>
        <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
          <path
            d="M0,12 C10,18 20,6 30,12 C40,18 50,3 60,12 C70,21 80,9 90,12 L100,12"
            fill="none"
            stroke="rgba(249, 115, 22, 0.5)"
            strokeWidth="2"
          />
          <path
            d="M0,12 C10,18 20,6 30,12 C40,18 50,3 60,12 C70,21 80,9 90,12 L100,12"
            fill="none"
            stroke="rgba(249, 115, 22, 0.8)"
            strokeWidth="1"
            strokeDasharray="1,1"
          />
        </svg>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-neutral-700 text-neutral-300 hover:text-white rounded-md h-9"
        >
          <Tag className="h-3.5 w-3.5 mr-1.5" />
          <span>Reserve</span>
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md h-9"
          onClick={() => onEdit?.(property.id)}
        >
          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
          <span>Edit</span>
        </Button>
      </div>
    </div>
  );
}
