
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Edit2, 
  Tag,
  DollarSign,
  Check
} from 'lucide-react';
import { Property, PropertyStock } from '@/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/propertyUtils';
import { PropertyStockInfo } from './PropertyStockInfo';

interface PropertyCardDetailsProps {
  property: Property;
  onEdit?: (id: string) => void;
  className?: string;
}

export function PropertyCardDetails({ property, onEdit, className }: PropertyCardDetailsProps) {
  // Create a feature array from property.features object
  const featureArray = property.features ? 
    (Array.isArray(property.features) ? 
      property.features : 
      Object.entries(property.features)
        .filter(([_, value]) => value !== undefined && value !== null && value !== 0)
        .map(([key, value]) => `${key}: ${value}`)) : 
    [];

  // Format transaction type badge
  const getTransactionBadge = () => {
    const type = property.transactionType?.toLowerCase() || 'sale';
    if (type === 'rent') {
      return <Badge variant="outline" className="bg-indigo-600/10 text-indigo-600 border-indigo-600/20">Rental</Badge>;
    } else if (type === 'primary') {
      return <Badge variant="outline" className="bg-purple-600/10 text-purple-600 border-purple-600/20">Primary</Badge>;
    } else {
      return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Sale</Badge>;
    }
  };

  return (
    <div className={cn(
      "px-4 pb-4 pt-2 rounded-xl transition-all duration-300 ease-in-out bg-[#121212]",
      className
    )}>
      {/* Property metrics tabs */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        <div className="bg-[#201f22] py-2.5 px-3 rounded-md text-center">
          <div className="text-xs text-orange-500 font-medium">{getTransactionBadge()}</div>
        </div>
        <div className="bg-[#181818] py-2.5 px-3 rounded-md text-center">
          <div className="text-xs text-neutral-500">
            {property.status.toLowerCase() === 'available' ? 
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Available</Badge> :
              property.status.toLowerCase() === 'pending' ?
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge> :
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Sold</Badge>
            }
          </div>
        </div>
        <div className="bg-[#181818] py-2.5 px-3 rounded-md text-center">
          {property.stock ? (
            <PropertyStockInfo stock={property.stock} compact />
          ) : (
            <div className="text-xs text-neutral-400">No Stock</div>
          )}
        </div>
      </div>
      
      {/* Activity graph with dashed border below */}
      <div className="mb-4 pt-1 pb-3 border-b border-dashed border-neutral-700/40">
        <svg width="100%" height="80" viewBox="0 0 100 80" preserveAspectRatio="none">
          <path
            d="M0,40 C5,20 15,60 25,35 C35,15 45,55 55,40 C65,25 75,55 85,35 C95,15 100,40 100,40"
            fill="none"
            stroke="rgba(249, 115, 22, 0.1)"
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

      {/* Property price highlight */}
      <div className="mb-4 pt-1 pb-3 border-b border-dashed border-neutral-700/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-orange-500" />
            <span className="text-sm text-neutral-300">Price</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {formatCurrency(property.price || 0)}
          </div>
        </div>
        
        {property.featured && (
          <div className="mt-2 flex items-center text-yellow-500">
            <Tag className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Featured Property</span>
          </div>
        )}
      </div>
     
      {/* Stock information for property developments */}
      {property.stock && property.stock.total > 1 && (
        <div className="mb-4 pt-1 pb-3 border-b border-dashed border-neutral-700/40">
          <PropertyStockInfo stock={property.stock} />
        </div>
      )}
     
      {/* Edit button */}
      <Button 
        variant="default" 
        size="sm" 
        className="bg-[#222222] hover:bg-[#2c2c2c] text-white border-0 rounded-md h-10 w-full"
        onClick={() => onEdit?.(property.id)}
      >
        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
        <span>Edit Property</span>
      </Button>
      
      {/* Property features */}
      {featureArray.length > 0 && (
        <div className="pt-4 mt-4 border-t border-dashed border-neutral-700/40">
          <h4 className="text-xs text-neutral-500 mb-2">Features</h4>
          <div className="flex flex-wrap gap-1.5">
            {featureArray.map((feature, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs bg-[#181818] border-[#333333] text-neutral-400"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Add listed by information */}
      <div className="pt-4 mt-4 border-t border-dashed border-neutral-700/40">
        <div className="flex items-center text-xs text-neutral-500">
          <span>Listed by: </span>
          <span className="ml-1 text-neutral-300">{property.listedBy || property.agent?.name || 'Unknown Agent'}</span>
        </div>
      </div>
    </div>
  );
}
