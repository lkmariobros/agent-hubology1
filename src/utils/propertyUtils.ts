
import { Building2, Store, Factory, Map } from 'lucide-react';
import React from 'react';

export const getPropertyTypeIcon = (type: string) => {
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

export const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `RM ${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `RM ${(price / 1000).toFixed(0)}K`;
  }
  return `RM ${price}`;
};
