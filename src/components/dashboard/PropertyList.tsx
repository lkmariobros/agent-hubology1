
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from 'lucide-react';
import { Property } from '@/types';

interface PropertyListProps {
  properties: Property[];
}

const PropertyList = ({ properties }: PropertyListProps) => {
  return (
    <Card className="glass-card">
      <CardHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Latest Properties</CardTitle>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {properties.map((property) => (
            <div 
              key={property.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              {property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="h-14 w-14 rounded-md object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-md bg-secondary flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{property.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {property.address.street}, {property.address.city}
                </p>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge 
                    variant="outline" 
                    className="text-[10px] py-0 h-5 border-white/10"
                  >
                    {property.type}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-[10px] py-0 h-5 border-white/10",
                      property.status === 'available' ? 'text-green-400 border-green-400/30' : 
                      property.status === 'pending' ? 'text-yellow-400 border-yellow-400/30' : 
                      'text-red-400 border-red-400/30'
                    )}
                  >
                    {property.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  ${property.price.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(property.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          
          {properties.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <p className="mt-2 text-sm text-muted-foreground">No properties found</p>
              <Button variant="outline" size="sm" className="mt-4">
                Add property
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyList;
