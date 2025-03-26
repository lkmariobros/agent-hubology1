
import { Property, PropertyStock } from '@/types';

// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value);
};

// Format price for display (shorter format)
export const formatPrice = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(0) + 'K';
  } else {
    return value.toString();
  }
};

// Calculate percentage of available stock
export const calculateStockPercentage = (available: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
};

// Get stock status label based on percentage
export const getStockStatusLabel = (percentage: number): string => {
  if (percentage <= 10) return 'Low Stock';
  if (percentage <= 30) return 'Limited';
  if (percentage >= 80) return 'High Availability';
  return 'Available';
};

// Get stock status class for styling based on percentage
export const getStockStatusClass = (percentage: number): string => {
  if (percentage === 0) return 'text-red-500';
  if (percentage <= 25) return 'text-orange-500';
  if (percentage <= 50) return 'text-yellow-500';
  if (percentage <= 75) return 'text-blue-500';
  return 'text-green-500';
};

// Map API property data to component-ready Property type
export const mapPropertyData = (property: any): Property => {
  return {
    id: property.id,
    title: property.title || '',
    description: property.description || '',
    price: Number(property.price) || 0,
    address: {
      street: property.street || '',
      city: property.city || '',
      state: property.state || '',
      zip: property.zip || '',
      country: property.country || 'Malaysia'
    },
    type: (property.property_types?.name?.toLowerCase() || 'residential') as 'residential' | 'commercial' | 'industrial' | 'land',
    subtype: property.subtype || '',
    features: Array.isArray(property.features) ? property.features : [], // Ensure features is an array
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.built_up_area || 0,
    images: property.property_images?.map((img: any) => img.storage_path) || [],
    status: property.property_statuses?.name?.toLowerCase() || 'available',
    agent: {
      id: property.agent_id || '',
      name: 'Agent Name', // This would come from a join in a real app
      firstName: 'Unknown',
      lastName: 'Agent',
      email: 'agent@example.com',
      phone: '123-456-7890'
    },
    createdAt: property.created_at || new Date().toISOString(),
    updatedAt: property.updated_at || new Date().toISOString()
  };
};
