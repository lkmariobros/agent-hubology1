
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PropertyDetailsProps {
  property: any;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {["Central Air Conditioning", "In-unit Laundry", "Hardwood Floors", "Stainless Steel Appliances", "Granite Countertops", "Walk-in Closets"].map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Building Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {["24-hour Concierge", "Fitness Center", "Rooftop Terrace", "Package Room", "Bicycle Storage", "Pet Friendly"].map((amenity, idx) => (
                <li key={idx} className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  {amenity}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {property.description || 'No description available for this property.'}
          </p>
          
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
