
import { getPublicImageUrl } from '@/integrations/supabase/storage';
import { Property } from '@/types';

/**
 * Maps the raw property data from Supabase to the format expected by the UI
 */
export const mapPropertyData = (rawProperty: any): Property => {
  // Process images - if they're objects from Supabase, extract their paths
  const images = rawProperty.property_images && Array.isArray(rawProperty.property_images)
    ? rawProperty.property_images
        .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
        .map((img: any) => img.storage_path || '')
    : [];

  // Create the property object in the format expected by the UI
  return {
    id: rawProperty.id,
    title: rawProperty.title || 'Untitled Property',
    description: rawProperty.description || '',
    type: rawProperty.property_types?.name || rawProperty.property_type || 'Residential',
    subtype: rawProperty.subtype || '',
    status: rawProperty.property_statuses?.name || rawProperty.status || 'Available',
    transactionType: rawProperty.transaction_types?.name || rawProperty.transaction_type || 'For Sale',
    price: rawProperty.price || 0,
    rentalRate: rawProperty.rental_rate || 0,
    address: {
      street: rawProperty.street || '',
      city: rawProperty.city || '',
      state: rawProperty.state || '',
      zip: rawProperty.zip || '',
      country: rawProperty.country || 'Malaysia',
    },
    features: {
      bedrooms: rawProperty.bedrooms || 0,
      bathrooms: rawProperty.bathrooms || 0,
      squareFeet: rawProperty.built_up_area || rawProperty.floor_area || 0,
      landSize: rawProperty.land_size || rawProperty.land_area || 0,
    },
    agent: {
      id: rawProperty.agent_id || '',
      name: rawProperty.agent_name || 'Agent',
    },
    images: images,
    createdAt: rawProperty.created_at || new Date().toISOString(),
    updatedAt: rawProperty.updated_at || new Date().toISOString(),
    featured: !!rawProperty.featured,
    size: rawProperty.built_up_area || rawProperty.floor_area || 0,
    area: rawProperty.land_size || rawProperty.land_area || 0,
    bedrooms: rawProperty.bedrooms || 0,
    bathrooms: rawProperty.bathrooms || 0,
    // Add stock data if this is a development property
    stock: rawProperty.stock_total 
      ? {
          total: rawProperty.stock_total || 0,
          available: rawProperty.stock_available || 0,
        }
      : undefined,
  };
};

/**
 * Formats a currency value with appropriate formatting
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Gets the cover image URL for a property
 */
export const getPropertyCoverImage = (property: Property): string => {
  if (!property.images || property.images.length === 0) {
    return '';
  }
  
  const coverImage = property.images[0];
  
  // Check if the image is a Supabase path
  if (typeof coverImage === 'string' && coverImage.startsWith('property-images/')) {
    return getPublicImageUrl(coverImage);
  }
  
  return coverImage;
};

/**
 * Calculate the percentage of available stock
 */
export const calculateStockPercentage = (available: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
};

/**
 * Get a label for stock status based on percentage
 */
export const getStockStatusLabel = (percentage: number): string => {
  if (percentage === 0) return 'Sold Out';
  if (percentage <= 25) return 'Limited';
  if (percentage <= 50) return 'Selling Fast';
  if (percentage <= 75) return 'Available';
  return 'Good Availability';
};

/**
 * Get property statistics for dashboard
 */
export const getPropertyStats = (properties: Property[]) => {
  const stats = {
    total: properties.length,
    residential: 0,
    commercial: 0,
    industrial: 0,
    land: 0,
    available: 0,
    pending: 0,
    sold: 0,
  };

  properties.forEach(property => {
    // Count by type
    if (property.type.toLowerCase() === 'residential') stats.residential++;
    else if (property.type.toLowerCase() === 'commercial') stats.commercial++;
    else if (property.type.toLowerCase() === 'industrial') stats.industrial++;
    else if (property.type.toLowerCase() === 'land') stats.land++;

    // Count by status
    if (property.status.toLowerCase() === 'available') stats.available++;
    else if (property.status.toLowerCase() === 'pending') stats.pending++;
    else if (property.status.toLowerCase() === 'sold') stats.sold++;
  });

  return stats;
};

/**
 * Format price with appropriate suffixes (K, M)
 * This function is needed by components like PropertyShowcase.tsx
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(0) + 'K';
  }
  return price.toString();
};

/**
 * Get stock status class
 */
export const getStockStatusClass = (percentage: number): string => {
  if (percentage >= 70) return 'text-green-500';
  if (percentage >= 30) return 'text-yellow-500';
  return 'text-red-500';
};
