
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CornerUpRight } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Property } from '@/types';
import { formatPrice } from '@/utils/propertyUtils';
import { cn } from '@/lib/utils';

interface PropertyCardBasicInfoProps {
  property: Property;
  isOpen: boolean;
  onCardClick?: () => void;
  className?: string;
}

export function PropertyCardBasicInfo({ 
  property, 
  isOpen, 
  onCardClick,
  className 
}: PropertyCardBasicInfoProps) {
  return (
    <div 
      className={cn(
        "px-4 py-3 flex flex-col justify-between cursor-pointer",
        "transition-colors duration-150 hover:bg-neutral-800/50",
        "border-t border-neutral-800/40",
        className
      )}
      onClick={onCardClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 py-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-white text-base tracking-tight truncate">
              {property.title}
            </h3>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 ml-2 rounded-full hover:bg-neutral-700/50 shrink-0"
                onClick={(e) => {
                  // Prevent the click from bubbling to the parent div
                  // which would toggle the expanded state twice
                  e.stopPropagation();
                }}
              >
                {isOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <span className="text-xs text-neutral-400 font-medium mt-0.5 block capitalize">
            {property.subtype || property.type}
          </span>
        </div>
      </div>
      
      <div className="border-t border-b border-neutral-800/40 mt-2 mb-2 py-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-neutral-500 mb-1.5">Price</div>
            <div className="font-mono text-cyan-400 text-lg">
              {formatPrice(property.price)}
            </div>
          </div>
          
          {property.stock && (
            <div className="text-right">
              <div className="text-xs text-neutral-500 mb-1.5">Stock</div>
              <div className="text-sm flex items-center gap-1">
                <span className="text-white">{property.stock} units</span>
                {property.stock > 10 && (
                  <CornerUpRight className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
