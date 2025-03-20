
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Property } from '@/types';

interface PropertyCardBasicInfoProps {
  property: Property;
  isOpen: boolean;
}

export function PropertyCardBasicInfo({ property, isOpen }: PropertyCardBasicInfoProps) {
  return (
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
  );
}
