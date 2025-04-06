
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  BedDouble, 
  Bath, 
  Calendar, 
  MapPin, 
  Ruler,
  Building, 
  Check,
  Square
} from 'lucide-react';
import { getPropertyTypeIcon } from '@/utils/propertyIconUtils';

interface PropertyDetailsProps {
  property: any;
  features?: any[];
  isLoading?: boolean;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  property, 
  features = [],
  isLoading = false
}) => {
  if (!property) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No property details available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const propertyType = property?.property_types?.name || 'Property';
  const transactionType = property?.transaction_types?.name || 'For Sale';
  const status = property?.property_statuses?.name || 'Available';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Property Type</h3>
                <div className="flex items-center">
                  {getPropertyTypeIcon(propertyType)}
                  <span className="ml-2">{propertyType}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Transaction</h3>
                <Badge variant="outline">{transactionType}</Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                <Badge variant="secondary">{status}</Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Listed Date</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {property.address && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                    <span>
                      {property.street && `${property.street}, `}
                      {property.city && `${property.city}, `}
                      {property.state && `${property.state}, `}
                      {property.zip && `${property.zip}, `}
                      {property.country}
                    </span>
                  </div>
                </div>
              )}
              
              {property.price > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Price</h3>
                  <span className="text-xl font-bold">
                    {property.price.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    })}
                  </span>
                </div>
              )}
              
              {property.rental_rate > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Rental Rate</h3>
                  <span className="text-xl font-bold">
                    {property.rental_rate.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    })}
                    /month
                  </span>
                </div>
              )}
              
              {property.agent_notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Agent Notes</h3>
                  <p className="text-sm italic">{property.agent_notes}</p>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Property specifications */}
          <div>
            <h3 className="text-sm font-medium mb-4">Property Specifications</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <BedDouble className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {property.bathrooms > 0 && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{property.bathrooms} Bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {property.built_up_area > 0 && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{property.built_up_area.toLocaleString()} sq ft</span>
                </div>
              )}
              
              {property.land_area > 0 && (
                <div className="flex items-center">
                  <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{property.land_area.toLocaleString()} sq ft land</span>
                </div>
              )}
              
              {property.land_size > 0 && (
                <div className="flex items-center">
                  <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{property.land_size.toLocaleString()} acres</span>
                </div>
              )}
              
              {property.building_class && (
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Class {property.building_class}</span>
                </div>
              )}
            </div>
          </div>
          
          {features && features.length > 0 && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-4">Features</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                      <span>{feature.feature_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {property.description && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm whitespace-pre-line">{property.description}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
