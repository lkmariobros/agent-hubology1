import { Property } from '@/types';

/**
 * Format a price for display
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(2) + 'M';
  } else {
    return price.toLocaleString();
  }
};

/**
 * Format a price in currency format
 */
export const formatCurrency = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return 'RM 0';
  return `RM ${price.toLocaleString()}`;
};

/**
 * Calculate stock availability percentage
 */
export const calculateStockPercentage = (available: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
};

/**
 * Get stock status label based on percentage
 */
export const getStockStatusLabel = (percentage: number): string => {
  if (percentage === 0) return 'Sold Out';
  if (percentage <= 25) return 'Low Stock';
  if (percentage <= 50) return 'Selling Fast';
  if (percentage <= 75) return 'Available';
  return 'Fully Available';
};

/**
 * Get CSS class for stock status based on percentage
 */
export const getStockStatusClass = (percentage: number): string => {
  if (percentage === 0) return 'text-red-500 bg-red-500/10 border-red-500/20';
  if (percentage <= 25) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  if (percentage <= 50) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
  if (percentage <= 75) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  return 'text-green-500 bg-green-500/10 border-green-500/20';
};

/**
 * Map property data from Supabase to our internal Property type
 */
export const mapPropertyData = (propertyData: any): Property => {
  // Extract image URLs from property_images array
  const images = propertyData.property_images 
    ? propertyData.property_images
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => {
          // Get public URL from storage_path
          if (img.storage_path) {
            const baseUrl = 'https://synabhmsxsvsxkyzhfss.supabase.co/storage/v1/object/public/property-images/';
            return baseUrl + img.storage_path;
          }
          return '/placeholder.svg';
        })
    : [];

  // Get property type from relation or fallback
  const propertyType = propertyData.property_types?.name || 'Residential';

  // Get transaction type from relation or fallback 
  const transactionType = propertyData.transaction_types?.name || 'Sale';

  // Get status from relation or fallback
  const status = propertyData.property_statuses?.name || 'Available';

  // Combine all data
  return {
    id: propertyData.id,
    title: propertyData.title,
    description: propertyData.description || '',
    type: propertyType,
    status: status,
    transactionType: transactionType,
    price: propertyData.price || propertyData.rental_rate || 0,
    rentalRate: propertyData.rental_rate || 0,
    address: {
      street: propertyData.street || '',
      city: propertyData.city || '',
      state: propertyData.state || '',
      zip: propertyData.zip || '',
      country: propertyData.country || 'Malaysia'
    },
    features: {
      bedrooms: propertyData.bedrooms || 0,
      bathrooms: propertyData.bathrooms || 0,
      squareFeet: propertyData.built_up_area || propertyData.floor_area || propertyData.land_area || 0,
      landSize: propertyData.land_size || 0
    },
    agent: {
      id: propertyData.agent_id || '',
      name: 'Agent Name', // This would come from agent relation
    },
    images: images,
    createdAt: propertyData.created_at || new Date().toISOString(),
    updatedAt: propertyData.updated_at || new Date().toISOString(),
    featured: propertyData.featured || false,
    // Add these fields for direct access
    size: propertyData.built_up_area || propertyData.floor_area || propertyData.land_area || 0,
    bedrooms: propertyData.bedrooms || 0,
    bathrooms: propertyData.bathrooms || 0
  };
};
