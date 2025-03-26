
// Format price to display in currency format
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format price with abbreviated units (K, M)
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(0) + 'K';
  }
  return price.toString();
};

// Calculate stock percentage
export const calculateStockPercentage = (available: number, total: number): number => {
  if (total === 0) return 0;
  return (available / total) * 100;
};

// Get stock status label
export const getStockStatusLabel = (percentage: number): string => {
  if (percentage === 0) return 'Sold Out';
  if (percentage <= 25) return 'Low Stock';
  if (percentage <= 50) return 'Limited';
  if (percentage <= 75) return 'Available';
  return 'Well Stocked';
};

// Get stock status class
export const getStockStatusClass = (percentage: number): string => {
  if (percentage === 0) return 'text-red-500';
  if (percentage <= 25) return 'text-orange-500';
  if (percentage <= 50) return 'text-yellow-500';
  if (percentage <= 75) return 'text-blue-500';
  return 'text-green-500';
};

// Map property data from API response to Property type
export const mapPropertyData = (propertyData: any) => {
  // Extract image paths from property_images if available
  const images = propertyData.property_images 
    ? propertyData.property_images
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.storage_path)
    : [];

  // Map status from property_statuses if available
  const status = propertyData.property_statuses?.name || propertyData.status || 'available';
  
  // Map type from property_types if available
  const type = propertyData.property_types?.name?.toLowerCase() || 
    propertyData.type || 'residential';
  
  // Construct address object
  const address = {
    street: propertyData.street || '',
    city: propertyData.city || '',
    state: propertyData.state || '',
    zip: propertyData.zip || '',
    country: propertyData.country || 'Malaysia',
  };

  // Map property features
  const features = {
    bedrooms: propertyData.bedrooms || 0,
    bathrooms: propertyData.bathrooms || 0,
    squareFeet: propertyData.built_up_area || propertyData.floor_area || 0,
    landSize: propertyData.land_size || 0,
    ...(propertyData.furnishing_status && { furnishingStatus: propertyData.furnishing_status }),
    ...(propertyData.building_class && { buildingClass: propertyData.building_class }),
    ...(propertyData.ceiling_height && { ceilingHeight: propertyData.ceiling_height }),
    ...(propertyData.power_capacity && { powerCapacity: propertyData.power_capacity }),
  };

  // Construct property stock information if available
  const stock = propertyData.total_units 
    ? {
        total: parseInt(propertyData.total_units) || 0,
        available: parseInt(propertyData.available_units) || 0,
        reserved: parseInt(propertyData.reserved_units) || 0,
        sold: parseInt(propertyData.sold_units) || 0,
      }
    : undefined;

  // Map transaction type
  const transactionType = propertyData.transaction_types?.name || 
    propertyData.transactionType || 'Sale';

  // Map the data to the Property interface
  return {
    id: propertyData.id,
    title: propertyData.title,
    description: propertyData.description || '',
    price: parseFloat(propertyData.price) || 0,
    address,
    type: type as 'residential' | 'commercial' | 'industrial' | 'land',
    subtype: propertyData.subtype || '',
    features,
    bedrooms: propertyData.bedrooms || 0,
    bathrooms: propertyData.bathrooms || 0,
    area: propertyData.built_up_area || propertyData.floor_area || 0,
    images,
    status: status as 'available' | 'pending' | 'sold',
    listedBy: propertyData.agent_id || '',
    agent: propertyData.agent 
      ? { id: propertyData.agent.id, name: propertyData.agent.name } 
      : undefined,
    createdAt: propertyData.created_at || new Date().toISOString(),
    updatedAt: propertyData.updated_at || new Date().toISOString(),
    featured: propertyData.featured || false,
    transactionType,
    stock,
    size: propertyData.built_up_area || propertyData.floor_area || 0,
  };
};
