
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PropertyGallery from './PropertyGallery';

interface PropertySummaryCardProps {
  property: any;
  propertyImages: string[];
  propertyType: string;
}

const PropertySummaryCard: React.FC<PropertySummaryCardProps> = ({ 
  property, 
  propertyImages, 
  propertyType 
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyGallery images={propertyImages} title={property.title} />
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge>{propertyType}</Badge>
              <Badge variant="outline">
                {property.transaction_types?.name || 'For Sale'}
              </Badge>
              {property.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            
            <p className="text-3xl font-bold mb-6">${property.price?.toLocaleString()}</p>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Property ID:</span>
                <span>{property.id}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Address:</span>
                <span>{property.street}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">City:</span>
                <span>{property.city}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">State:</span>
                <span>{property.state}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Size:</span>
                <span>{property.land_area || property.floor_area || property.built_up_area} sqft</span>
              </div>
              {property.bedrooms && <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Bedrooms:</span>
                <span>{property.bedrooms}</span>
              </div>}
              {property.bathrooms && <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Bathrooms:</span>
                <span>{property.bathrooms}</span>
              </div>}
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">
                  {property.property_statuses?.name || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertySummaryCard;
