
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyOwnerInfoProps {
  owner?: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  } | null;
  className?: string;
  onAddOwner?: () => void;
}

const PropertyOwnerInfo: React.FC<PropertyOwnerInfoProps> = ({ 
  owner, 
  className = '',
  onAddOwner 
}) => {
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
              {owner.company && (
                <p className="text-xs text-muted-foreground">{owner.company}</p>
              )}
            </div>
            
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOwnerInfo;
