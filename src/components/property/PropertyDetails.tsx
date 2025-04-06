
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PropertyDetailsProps {
  property: any;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  // Generate features based on property type
  const getDefaultFeatures = () => {
    const propertyType = property.property_types?.name || '';
    
    if (propertyType === 'Residential') {
      return [
        "Air Conditioning",
        "Modern Kitchen",
        "Natural Lighting",
        "High Ceilings",
        "Private Balcony",
        "Walk-in Closets"
      ];
    } else if (propertyType === 'Commercial') {
      return [
        "24/7 Security",
        "Secured Parking",
        "High-speed Internet",
        "Meeting Rooms",
        "Common Area",
        "Energy-efficient"
      ];
    } else {
      // Default features
      return [
        "Air Conditioning",
        "Secured Parking",
        "High-speed Internet",
        "Natural Lighting"
      ];
    }
  };

  const featuresItems = property.features || getDefaultFeatures();
  
  // Generate amenities based on property type
  const getDefaultAmenities = () => {
    const propertyType = property.property_types?.name || '';
    
    if (propertyType === 'Residential') {
      return [
        "Swimming Pool",
        "Fitness Center",
        "Playground",
        "BBQ Area",
        "Security",
        "Visitor Parking"
      ];
    } else if (propertyType === 'Commercial') {
      return [
        "Conference Room",
        "Reception Area",
        "Cafeteria",
        "Lounge",
        "Mail Room",
        "CCTV Security"
      ];
    } else {
      // Default amenities
      return [
        "Parking",
        "Security",
        "Common Areas",
        "Fire Safety"
      ];
    }
  };

  const amenitiesItems = property.amenities || getDefaultAmenities();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Features</CardTitle>
          </CardHeader>
          <CardContent>
            {featuresItems.length > 0 ? (
              <ul className="space-y-2">
                {featuresItems.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Info className="h-8 w-8 mb-2 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground">No features specified</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Building Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            {amenitiesItems.length > 0 ? (
              <ul className="space-y-2">
                {amenitiesItems.map((amenity: string, idx: number) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Info className="h-8 w-8 mb-2 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground">No amenities specified</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {property.description ? (
            <p className="text-muted-foreground">
              {property.description}
            </p>
          ) : (
            <p className="text-muted-foreground italic">
              No description available for this property.
            </p>
          )}
          
          {property.agent_notes && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold mb-2">Agent Notes</h3>
                <p className="text-muted-foreground">
                  {property.agent_notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetails;
