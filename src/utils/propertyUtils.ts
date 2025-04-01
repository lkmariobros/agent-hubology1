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
 * Format currency with symbol and thousand separators
 */
export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate stock availability percentage
 */
export const calculateStockPercentage = (property?: Property | { stock?: { total: number, available: number } }): number => {
  if (!property?.stock) return 0;
  const { total, available } = property.stock;
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
};

/**
 * Calculate stock availability percentage with direct values
 */
export const calculateStockPercentage2 = (available: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
};

/**
 * Get status label for stock availability
 */
export const getStockStatusLabel = (property?: Property | number): string => {
  // If property is a number, treat it as a percentage directly
  if (typeof property === 'number') {
    if (property === 0) return 'Sold Out';
    if (property <= 20) return 'Limited Units';
    if (property <= 50) return 'Selling Fast';
    return 'Available';
  }
  
  // Otherwise calculate from property object
  if (!property || !('stock' in property)) return 'N/A';
  
  const percentage = calculateStockPercentage(property);
  
  if (percentage === 0) return 'Sold Out';
  if (percentage <= 20) return 'Limited Units';
  if (percentage <= 50) return 'Selling Fast';
  return 'Available';
};

/**
 * Get status label for stock availability using percentage
 */
export const getStockStatusLabelFromPercentage = (percentage: number): string => {
  if (percentage === 0) return 'Sold Out';
  if (percentage <= 20) return 'Limited Units';
  if (percentage <= 50) return 'Selling Fast';
  return 'Available';
};

/**
 * Get CSS class for stock status
 */
export const getStockStatusClass = (property?: Property | number): string => {
  // If property is a number, treat it as a percentage directly
  if (typeof property === 'number') {
    if (property === 0) return 'bg-red-100 text-red-800';
    if (property <= 20) return 'bg-orange-100 text-orange-800';
    if (property <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }
  
  // Otherwise calculate from property object
  if (!property || !('stock' in property)) return 'bg-gray-100 text-gray-800';
  
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
