
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateStockPercentage, getStockStatusLabel, getStockStatusClass, formatCurrency, formatPrice } from './propertyUtils';

// Function to truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Function to get property type icon
export const getPropertyTypeIcon = (type: string): JSX.Element => {
  // You can import and use your icons here
  return <></>;
};

// Convert area to standard format
export const formatArea = (area: number, unit: string = 'sq.ft'): string => {
  return `${area.toLocaleString()} ${unit}`;
};

// Helper function to determine if a property is available
export const isPropertyAvailable = (status: string): boolean => {
  return status.toLowerCase() === 'available';
};

// Re-export the functions from propertyUtils.ts for backwards compatibility
export { 
  calculateStockPercentage, 
  getStockStatusLabel, 
  getStockStatusClass,
  formatCurrency,
  formatPrice
};

// Helper function to map property data structures
export const mapPropertyData = (property: any) => {
  // Handle different property structures (from API vs mock data)
  const mappedProperty = {
    id: property.id,
    title: property.title,
    description: property.description || property.agent_notes,
    price: property.price || 0,
    address: {
      street: property.street || '',
      city: property.city || '',
      state: property.state || '',
      zip: property.zip || '',
      country: property.country || 'Malaysia',
    },
    type: property.property_types?.name || property.type || 'Residential',
    subtype: property.subtype || property.property_subtype || '',
    status: property.property_statuses?.name || property.status || 'Available',
    size: property.built_up_area || property.size || 0,
    area: property.built_up_area || property.floor_area || property.land_area || property.size || 0,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    features: {
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      squareFeet: property.built_up_area || property.size || property.area || 0,
      landSize: property.land_size || 0
    },
    images: property.property_images 
      ? property.property_images.map((img: any) => 
          img.storage_path ? getImageUrl(img.storage_path) : ''
        ).filter(Boolean)
      : property.images || [],
    createdAt: property.created_at || new Date().toISOString(),
    updatedAt: property.updated_at || new Date().toISOString(),
    featured: property.featured || false,
    listedBy: property.agent_id || 'Unknown',
    agent: { id: property.agent_id || '', name: 'Agent' },
    transactionType: property.transaction_types?.name || property.transactionType || 'Sale',
    stock: property.stock ? property.stock : 
           (property.stock_total ? {
              total: property.stock_total || 0,
              available: property.stock_available || 0,
              reserved: property.stock_reserved || 0,
              sold: property.stock_sold || 0
           } : undefined)
  };
  
  return mappedProperty;
};

// Get public URL for a storage path
export const getImageUrl = (storage_path: string | null) => {
  if (!storage_path) return '/placeholder.svg';
  
  // Get public URL from Supabase
  try {
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(storage_path);
      
    return data?.publicUrl || '/placeholder.svg';
  } catch (error) {
    console.error('Error getting image URL:', error);
    return '/placeholder.svg';
  }
};
