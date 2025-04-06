
import React from 'react';
import { Button } from "@/components/ui/button";
import { formatCurrency, formatArea } from "@/lib/utils";
import { Calendar, MapPin, Building, Maximize2, Bed, Bath, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PropertyCardDetailsProps {
  property: any;
  onEdit?: (id: string) => void;
}

const PropertyCardDetails: React.FC<PropertyCardDetailsProps> = ({ property, onEdit }) => {
  // Format property data for display
  const formattedPrice = property.price ? formatCurrency(property.price) : "Price on request";
  const builtUpArea = property.built_up_area ? formatArea(property.built_up_area) : "N/A";
  const landArea = property.land_area ? formatArea(property.land_area) : "N/A";

  // Check if property has agent notes
  const hasAgentNotes = property.agent_notes && property.agent_notes.trim().length > 0;

  return (
    <div className="px-4 pb-4">
      {/* Property Specifications */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {property.year_built || property.created_at ? 
              new Date(property.year_built || property.created_at).getFullYear() : 
              "N/A"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm truncate">
            {property.city || property.location || "Location N/A"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {property.property_types?.name || property.type || "Type N/A"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{builtUpArea}</span>
        </div>
        
        {property.bedrooms && (
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
          </div>
        )}
        
        {property.bathrooms && (
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
          </div>
        )}
      </div>
      
      {/* Property Status Badge */}
      <div className="mb-4">
        <Badge variant="outline" className="bg-background">
          {property.property_statuses?.name || property.status || "Status N/A"}
        </Badge>
        
        {property.featured && (
          <Badge className="ml-2 bg-amber-500 text-black">Featured</Badge>
        )}
      </div>

      {/* Agent Notes (if available) */}
      {hasAgentNotes && (
        <>
          <Separator className="my-3" />
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1">Agent Notes:</h4>
            <p className="text-sm text-muted-foreground">
              {property.agent_notes}
            </p>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-end mt-4">
        {onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => onEdit(property.id)}
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyCardDetails;
