
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Store, Factory, Map, MapPin, ArrowUpDown } from 'lucide-react';

interface PropertyTableProps {
  properties: Property[];
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ properties }) => {
  const navigate = useNavigate();

  const getPropertyTypeIcon = (type: string) => {
    switch(type) {
      case 'residential':
        return <Building2 className="h-4 w-4" />;
      case 'commercial':
        return <Store className="h-4 w-4" />;
      case 'industrial':
        return <Factory className="h-4 w-4" />;
      case 'land':
        return <Map className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `RM ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `RM ${(price / 1000).toFixed(0)}K`;
    }
    return `RM ${price}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="clean-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Address</th>
            <th>
              <div className="flex items-center">
                Price <ArrowUpDown size={14} className="ml-1" />
              </div>
            </th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {properties.length > 0 ? (
            properties.map((property) => (
              <tr key={property.id} className="cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted/30 flex items-center justify-center">
                      {getPropertyTypeIcon(property.type)}
                    </div>
                    <div>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {property.bedrooms && `${property.bedrooms} bd • `}
                        {property.bathrooms && `${property.bathrooms} ba • `}
                        {property.area && `${property.area} ft²`}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant="outline" className="capitalize bg-secondary/50">
                    {property.subtype}
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{property.address.city}, {property.address.state}</span>
                  </div>
                </td>
                <td className="font-medium">{formatPrice(property.price)}</td>
                <td>
                  <Badge
                    variant={property.status === 'available' ? 'default' : 'outline'}
                    className={property.status === 'pending' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : ''}
                  >
                    {property.status}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/properties/${property.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                No properties found. Add a property to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
