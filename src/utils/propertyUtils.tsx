
import { Building2, Store, Factory, Map } from 'lucide-react';
import React from 'react';

export const getPropertyTypeIcon = (type: string) => {
  switch(type) {
    case 'residential':
      return React.createElement(Building2, { className: "h-4 w-4" });
    case 'commercial':
      return React.createElement(Store, { className: "h-4 w-4" });
    case 'industrial':
      return React.createElement(Factory, { className: "h-4 w-4" });
    case 'land':
      return React.createElement(Map, { className: "h-4 w-4" });
    default:
      return React.createElement(Building2, { className: "h-4 w-4" });
  }
};

export const formatPrice = (price: number) => {
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const getTimeAgo = (date: string) => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInMs = now.getTime() - pastDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};
