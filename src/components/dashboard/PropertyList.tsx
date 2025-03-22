
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Eye, Edit, Trash2 } from 'lucide-react';
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

const PropertyList = ({ properties, isLoading = false, onViewAll }: PropertyListProps) => {
  const navigate = useNavigate();

  const handleViewProperty = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const handleEditProperty = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/properties/${id}/edit`);
  };

  const handleDeleteProperty = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this property?')) {
      // Property deletion logic would go here
      console.log(`Delete property ${id}`);
    }
  };

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Latest Properties</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-accent-foreground hover:text-accent-foreground/80"
          onClick={onViewAll}
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div 
                key={`skeleton-${index}`}
                className="flex items-center space-x-4 p-3 rounded-lg"
              >
                <Skeleton className="h-14 w-14 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-2 ml-auto" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </div>
            ))
          ) : (
            properties.map((property) => (
              <div 
                key={property.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer border border-border/20"
                onClick={() => handleViewProperty(property.id)}
              >
                {property.images && property.images.length > 0 ? (
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
                      className="text-[10px] py-0 h-5 border-border/40"
                    >
                      {property.type}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "text-[10px] py-0 h-5 border-border/40",
                        property.status === 'available' ? 'text-green-400 border-green-400/30' : 
                        property.status === 'pending' ? 'text-yellow-400 border-yellow-400/30' : 
                        'text-red-400 border-red-400/30'
                      )}
                    >
                      {property.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-medium text-foreground">
                    ${property.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(property.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProperty(property.id);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={(e) => handleEditProperty(property.id, e)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:text-destructive" 
                      onClick={(e) => handleDeleteProperty(property.id, e)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {!isLoading && properties.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <p className="mt-2 text-sm text-muted-foreground">No properties found</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => navigate('/properties/new')}
              >
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
