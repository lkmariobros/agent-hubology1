
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
    <div className="p-4 h-[84px] flex flex-col justify-between">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-base tracking-tight truncate">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="h-3 w-3 text-neutral-400 flex-shrink-0" />
            <span className="text-xs text-neutral-400 truncate">
              {property.address.city}, {property.address.state}
            </span>
          </div>
          
          {/* Only show price in basic info when card is not expanded */}
          {!isOpen && (
            <div className="mt-1.5 font-semibold text-sm text-orange-500">
              {formatPrice(property.price)}
              {property.type === 'commercial' ? '/month' : ''}
            </div>
          )}
        </div>
        
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full hover:bg-neutral-800 flex-shrink-0 mt-0.5"
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
  );
}
