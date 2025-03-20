
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
    <div className="space-y-4">
      {/* Property specs */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {property.bedrooms && (
          <div className="flex flex-col items-center p-3 bg-neutral-800/50 rounded-md">
            <Bed className="h-4 w-4 text-neutral-400 mb-1.5" />
            <span className="text-xs">{property.bedrooms} beds</span>
          </div>
        )}
        
        {property.bathrooms && (
          <div className="flex flex-col items-center p-3 bg-neutral-800/50 rounded-md">
            <Bath className="h-4 w-4 text-neutral-400 mb-1.5" />
            <span className="text-xs">{property.bathrooms} baths</span>
          </div>
        )}
        
        {property.area && (
          <div className="flex flex-col items-center p-3 bg-neutral-800/50 rounded-md">
            <Square className="h-4 w-4 text-neutral-400 mb-1.5" />
            <span className="text-xs">{property.area} ft²</span>
          </div>
        )}
      </div>
      
      {/* Property features/tags */}
      {property.features && property.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {property.features.map((feature, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="text-xs bg-neutral-800/80 border-neutral-700 text-neutral-300"
            >
              {feature}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Units and Listed info */}
      <div className="flex justify-between items-center p-4 border-t border-neutral-800/70">
        <div>
          <p className="text-xs text-neutral-400 mb-1">Units Available</p>
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-white">{property.stock || 1}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-neutral-400 mb-1">Listed</p>
          <p className="text-sm text-white">2 days ago</p>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-neutral-950/50 border-t border-b border-neutral-800/50">
        <div className="text-center">
          <div className="flex justify-center mb-1.5">
            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 mb-0.5">Listed</p>
          <p className="text-xs">2 days</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-1.5">
            <Eye className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 mb-0.5">Views</p>
          <p className="text-xs">278</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-1.5">
            <Users className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 mb-0.5">Interested</p>
          <p className="text-xs">38</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-1.5">
            <Building className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 mb-0.5">Type</p>
          <p className="text-xs capitalize">{property.subtype}</p>
        </div>
      </div>
      
      {/* Simple activity visualization */}
      <div className="px-4 py-3 border-b border-neutral-800/50">
        <p className="text-xs text-neutral-400 mb-2">Property Interest (7 days)</p>
        <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
          <path
            d="M0,12 C10,18 20,6 30,12 C40,18 50,3 60,12 C70,21 80,9 90,12 L100,12"
            fill="none"
            stroke="rgba(249, 115, 22, 0.3)"
            strokeWidth="2"
          />
          <path
            d="M0,12 C10,18 20,6 30,12 C40,18 50,3 60,12 C70,21 80,9 90,12 L100,12"
            fill="none"
            stroke="rgba(249, 115, 22, 0.8)"
            strokeWidth="1"
          />
        </svg>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-neutral-700 text-neutral-300 hover:text-white rounded-md h-10"
        >
          <Tag className="h-3.5 w-3.5 mr-1.5" />
          <span>Reserve</span>
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md h-10"
          onClick={() => onEdit?.(property.id)}
        >
          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
          <span>Edit</span>
        </Button>
      </div>
    </div>
  );
}
