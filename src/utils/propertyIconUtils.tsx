
import React from 'react';
import { 
  Home, 
  Building2, 
  Warehouse, 
  Landmark, 
  MapPin 
} from 'lucide-react';

// Function to get property type icon
export const getPropertyTypeIcon = (type: string): JSX.Element => {
  switch(type?.toLowerCase()) {
    case 'residential':
      return <Home className="h-5 w-5" />;
    case 'commercial':
      return <Building2 className="h-5 w-5" />;
    case 'industrial':
      return <Warehouse className="h-5 w-5" />;
    case 'land':
      return <Landmark className="h-5 w-5" />;
    default:
      return <MapPin className="h-5 w-5" />;
  }
};

// Get appropriate color class based on property status
export const getPropertyStatusColor = (status: string): string => {
  switch(status?.toLowerCase()) {
    case 'active':
    case 'available':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'pending':
    case 'under contract':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'sold':
    case 'leased':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'expired':
    case 'withdrawn':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};
