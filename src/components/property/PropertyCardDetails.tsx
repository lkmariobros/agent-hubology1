
import React from 'react';
import { Property } from '@/types';
import { formatCurrency } from '@/utils/format';
import { 
  Home, 
  Bed, 
  Bath, 
  Maximize2, 
  Tag, 
  Clock, 
  Award,
  User
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyCardDetailsProps {
  property: Property;
  showActions?: boolean;
}

const PropertyCardDetails = ({ property, showActions = true }: PropertyCardDetailsProps) => {
  // Format the price
  const formattedPrice = formatCurrency(property.price);
  
  // Determine property icon by type
  const getPropertyIcon = () => {
    switch (property.type?.toLowerCase()) {
      case 'commercial':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'industrial':
        return <Home className="h-5 w-5 text-orange-500" />;
      case 'land':
        return <Home className="h-5 w-5 text-green-500" />;
      default:
        return <Home className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  // Calculate how long ago the property was listed
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) !== 1 ? 's' : ''} ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 365)} year${Math.floor(diffInDays / 365) !== 1 ? 's' : ''} ago`;
  };
  
  return (
    <div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-foreground">{property.title}</h2>
            <p className="text-sm text-muted-foreground">
              {property.address?.street && `${property.address.street}, `}
              {property.address?.city && `${property.address.city}, `}
              {property.address?.state && `${property.address.state}`}
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            {property.status}
          </Badge>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-xl font-bold">{formattedPrice}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Price</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                {getPropertyIcon()}
                <span className="ml-2">{property.type}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Property Type</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          {property.bedrooms !== undefined && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          
          {property.area && (
            <div className="flex items-center">
              <Maximize2 className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{property.area} sq ft</span>
            </div>
          )}
        </div>
        
        {property.stock && (
          <Card className="mt-4">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Units</p>
                  <p className="font-medium">{property.stock.total}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Available</p>
                  <p className="font-medium">{property.stock.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {getTimeAgo(property.createdAt)}
            </span>
          </div>
          
          {property.featured && (
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Featured</span>
            </div>
          )}
        </div>
        
        {property.listedBy && (
          <div className="mt-4 flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Listed by: {typeof property.listedBy === 'string' ? 
                property.listedBy : 
                property.listedBy.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCardDetails;
