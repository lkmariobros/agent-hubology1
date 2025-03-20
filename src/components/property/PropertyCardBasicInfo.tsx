
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Property } from '@/types';
import { formatPrice } from '@/utils/propertyUtils';

interface PropertyCardBasicInfoProps {
  property: Property;
  isOpen: boolean;
}

export function PropertyCardBasicInfo({ property, isOpen }: PropertyCardBasicInfoProps) {
  return (
    <div className="p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-lg tracking-tight truncate">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="h-3 w-3 text-neutral-400 flex-shrink-0" />
            <span className="text-xs text-neutral-400 truncate">
              {property.address.city}, {property.address.state}
            </span>
          </div>
          
          <div className="mt-4 mb-1 flex justify-between items-end">
            <div>
              <div className="text-xs text-neutral-500 mb-1">Price</div>
              <div className="font-semibold text-xl text-orange-500">
                {formatPrice(property.price)}
              </div>
            </div>
            
            {property.stock && (
              <div className="text-right">
                <div className="text-xs text-neutral-500 mb-1">Stock</div>
                <div className="text-sm text-neutral-300 flex items-center gap-1">
                  {property.stock} units
                  {property.stock > 10 && (
                    <span className="text-green-500">↗</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full hover:bg-neutral-800 flex-shrink-0 mt-0.5"
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-neutral-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  );
}
