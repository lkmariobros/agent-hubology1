import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building2, 
  Warehouse, 
  Map, 
  Bath, 
  BedDouble, 
  Square, 
  Info, 
  Landmark,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface PropertyDetailsProps {
  property: any;
  features?: any[];
  isLoading?: boolean;
}

// Helper function to format the area based on property type
const formatArea = (property: any) => {
  if (property.built_up_area) return `${property.built_up_area} sq ft`;
  if (property.floor_area) return `${property.floor_area} sq ft`;
  if (property.land_area) return `${property.land_area} sq ft`;
  if (property.land_size) return `${property.land_size} sq ft`;
  return 'Not specified';
};

// Group features by category
const groupFeaturesByCategory = (features: any[]) => {
  const grouped: Record<string, any[]> = {};
  
  features.forEach(feature => {
    const category = feature.feature_category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(feature);
  });
  
  return grouped;
};

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
          <div className="text-center py-4 text-muted-foreground">
            Property information not available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const propertyTypeIcon = () => {
    const type = property.property_types?.name || '';
    
    switch(type.toLowerCase()) {
      case 'residential':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'commercial':
        return <Building2 className="h-5 w-5 text-green-500" />;
      case 'industrial':
        return <Warehouse className="h-5 w-5 text-yellow-500" />;
      case 'land':
        return <Map className="h-5 w-5 text-brown-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Group the features by category
  const groupedFeatures = groupFeaturesByCategory(features);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Property Details</CardTitle>
        <Badge variant="outline" className="capitalize">
          {property.property_types?.name || 'Property'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            {propertyTypeIcon()}
            <div>
              <p className="text-sm font-medium">Type</p>
              <p className="text-sm text-muted-foreground">
                {property.property_types?.name || 'Not specified'}
              </p>
            </div>
          </div>
          
          {property.bedrooms !== null && property.bedrooms !== undefined && (
            <div className="flex items-center space-x-3">
              <BedDouble className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Bedrooms</p>
                <p className="text-sm text-muted-foreground">{property.bedrooms}</p>
              </div>
            </div>
          )}
          
          {property.bathrooms !== null && property.bathrooms !== undefined && (
            <div className="flex items-center space-x-3">
              <Bath className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Bathrooms</p>
                <p className="text-sm text-muted-foreground">{property.bathrooms}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Square className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Area</p>
              <p className="text-sm text-muted-foreground">{formatArea(property)}</p>
            </div>
          </div>
          
          {property.furnishing_status && (
            <div className="flex items-center space-x-3">
              <Landmark className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Furnishing</p>
                <p className="text-sm text-muted-foreground capitalize">{property.furnishing_status}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Listed</p>
              <p className="text-sm text-muted-foreground">
                {new Date(property.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Property Description */}
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {property.description || 'No description provided'}
          </p>
        </div>
        
        {/* Property Location */}
        <div>
          <h3 className="text-sm font-medium mb-2">Location</h3>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">{property.street}</p>
            <p className="text-muted-foreground">
              {[property.city, property.state, property.zip]
                .filter(Boolean)
                .join(', ')}
            </p>
            <p className="text-muted-foreground">{property.country}</p>
          </div>
        </div>
        
        {/* Property Features */}
        {isLoading ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ) : features.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Features</h3>
            {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-xs font-medium uppercase text-muted-foreground">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature.feature_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-medium mb-2">Features</h3>
            <p className="text-sm text-muted-foreground">No features listed for this property</p>
          </div>
        )}
        
        {/* Agent Notes */}
        {property.agent_notes && (
          <div>
            <h3 className="text-sm font-medium mb-2">Agent Notes</h3>
            <div className="p-3 bg-muted rounded-md text-sm">
              {property.agent_notes}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;
