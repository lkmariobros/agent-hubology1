
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, Edit2 } from 'lucide-react';
import { formatPrice } from '@/utils/propertyUtils';
import { Property } from '@/types';

interface PropertyCardDetailsProps {
  property: Property;
  onEdit?: (id: string) => void;
}

export function PropertyCardDetails({ property, onEdit }: PropertyCardDetailsProps) {
  return (
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
  );
}
