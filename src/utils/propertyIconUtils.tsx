
import React from 'react';
import { 
  Home, 
  Building2, 
  Warehouse, 
  Map, 
  Info 
} from 'lucide-react';

// Function to get property type icon
export const getPropertyTypeIcon = (type: string): JSX.Element => {
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('residential')) {
    return <Home className="h-5 w-5 text-blue-500" />;
  } else if (lowerType.includes('commercial')) {
    return <Building2 className="h-5 w-5 text-green-500" />;
  } else if (lowerType.includes('industrial')) {
    return <Warehouse className="h-5 w-5 text-orange-500" />;
  } else if (lowerType.includes('land')) {
    return <Map className="h-5 w-5 text-amber-600" />;
  }
  
  return <Info className="h-5 w-5 text-muted-foreground" />;
};
