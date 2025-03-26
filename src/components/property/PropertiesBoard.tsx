
import React from 'react';
import { Property } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Home } from 'lucide-react';

interface PropertiesBoardProps {
  properties: Property[];
}

const PropertiesBoard: React.FC<PropertiesBoardProps> = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Home className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No properties available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-40 h-32 bg-muted">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Home className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {property.address.street}, {property.address.city}
                </p>
                <div className="flex justify-between">
                  <p className="font-medium">${property.price.toLocaleString()}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {property.type}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertiesBoard;
