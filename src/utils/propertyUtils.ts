
import { Property } from '@/types';

/**
 * Format price with currency symbol and thousand separators
 */
export const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return 'Price on request';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Calculate stock availability percentage
 */
export const calculateStockPercentage = (property?: Property): number => {
  if (!property?.stock) return 0;
  const { total, available } = property.stock;
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
};

/**
 * Get status label for stock availability
 */
export const getStockStatusLabel = (property?: Property): string => {
  if (!property?.stock) return 'N/A';
  
  const percentage = calculateStockPercentage(property);
  
  if (percentage === 0) return 'Sold Out';
  if (percentage <= 20) return 'Limited Units';
  if (percentage <= 50) return 'Selling Fast';
  return 'Available';
};

/**
 * Get CSS class for stock status
 */
export const getStockStatusClass = (property?: Property): string => {
  if (!property?.stock) return 'bg-gray-100 text-gray-800';
  
  const percentage = calculateStockPercentage(property);
  
  if (percentage === 0) return 'bg-red-100 text-red-800';
  if (percentage <= 20) return 'bg-orange-100 text-orange-800';
  if (percentage <= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

/**
 * Map property data from API to front-end model
 */
export const mapPropertyData = (apiData: any): Property => {
  return {
    id: apiData.id,
    title: apiData.title,
    description: apiData.description,
    price: apiData.price,
    rentalRate: apiData.rental_rate,
    address: {
      street: apiData.street || '',
      city: apiData.city || '',
      state: apiData.state || '',
      zip: apiData.zip || '',
      country: apiData.country || 'Malaysia',
    },
    type: apiData.property_type_id,
    bedrooms: apiData.bedrooms,
    bathrooms: apiData.bathrooms,
    area: apiData.built_up_area || apiData.floor_area || apiData.land_area,
    status: apiData.status_id,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    // Map other fields as needed
  };
};
