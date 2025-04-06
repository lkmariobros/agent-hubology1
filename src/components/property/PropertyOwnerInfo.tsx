
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, User, Plus, Building, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyOwnerInfoProps {
  owner?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    address?: string;
    notes?: string;
    is_primary_contact?: boolean;
  } | null;
  className?: string;
  onAddOwner?: () => void;
  isLoading?: boolean;
}

const PropertyOwnerInfo: React.FC<PropertyOwnerInfoProps> = ({ 
  owner, 
  className = '',
  onAddOwner,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Owner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-3 w-full">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!owner) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Owner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <User className="h-10 w-10 mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground mb-4">No owner information available</p>
            {onAddOwner && (
              <Button variant="outline" onClick={onAddOwner} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Owner Information
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Owner Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10 mt-0.5">
            <AvatarFallback className="bg-primary/10 text-primary">
              {owner.name ? owner.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-3 w-full">
            <div>
              <h3 className="font-medium text-sm">{owner.name}</h3>
              {owner.is_primary_contact && (
                <span className="text-xs text-muted-foreground py-0.5 px-1.5 bg-primary/10 rounded-sm">
                  Primary Contact
                </span>
              )}
            </div>
            
            {owner.company && (
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{owner.company}</span>
              </div>
            )}
            
            {owner.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{owner.email}</span>
              </div>
            )}
            
            {owner.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{owner.phone}</span>
              </div>
            )}
            
            {owner.address && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{owner.address}</span>
              </div>
            )}
            
            {owner.notes && (
              <div className="mt-4 pt-4 border-t border-muted">
                <p className="text-xs font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{owner.notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOwnerInfo;
