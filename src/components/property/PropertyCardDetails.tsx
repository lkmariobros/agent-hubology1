
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bed, Bath, Square, Edit2, Calendar, Eye, 
  Users, Building, Tag, ArrowUpRight 
} from 'lucide-react';
import { Property } from '@/types';
import { Badge } from '../ui/badge';

interface PropertyCardDetailsProps {
  property: Property;
  onEdit?: (id: string) => void;
}

export function PropertyCardDetails({ property, onEdit }: PropertyCardDetailsProps) {
  return (
    <div className="px-4 pb-4">
      {/* Property metrics tabs */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        <div className="bg-neutral-900/80 py-2.5 px-3 rounded-md text-center">
          <div className="text-xs text-orange-500 font-medium">Sales</div>
        </div>
        <div className="bg-neutral-900/40 py-2.5 px-3 rounded-md text-center">
          <div className="text-xs text-neutral-500">Views</div>
        </div>
        <div className="bg-neutral-900/40 py-2.5 px-3 rounded-md text-center">
          <div className="text-xs text-neutral-500">Stock</div>
        </div>
      </div>
      
      {/* Activity graph */}
      <div className="mb-4 pt-1 pb-3">
        <svg width="100%" height="80" viewBox="0 0 100 80" preserveAspectRatio="none">
          <path
            d="M0,40 C5,20 15,60 25,35 C35,15 45,55 55,40 C65,25 75,55 85,35 C95,15 100,40 100,40"
            fill="none"
            stroke="rgba(249, 115, 22, 0.15)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0,40 C5,20 15,60 25,35 C35,15 45,55 55,40 C65,25 75,55 85,35 C95,15 100,40 100,40"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
     
      {/* Edit button */}
      <Button 
        variant="default" 
        size="sm" 
        className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-md h-10 w-full"
        onClick={() => onEdit?.(property.id)}
      >
        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
        <span>Edit Product</span>
      </Button>
      
      {/* Additional property stats if needed - optional section */}
      {property.features && property.features.length > 0 && (
        <div className="pt-3 mt-3 border-t border-neutral-900/40">
          <h4 className="text-xs text-neutral-500 mb-2">Features</h4>
          <div className="flex flex-wrap gap-1.5">
            {property.features.map((feature, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs bg-neutral-900/40 border-neutral-800/40 text-neutral-400"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
