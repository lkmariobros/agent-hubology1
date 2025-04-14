
// Add formatCurrency utility that's imported by various components
export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format price with currency symbol
export const formatPrice = (price: number): string => {
  return `$${formatCurrency(price)}`;
};

// Calculate stock percentage
export const calculateStockPercentage = (sold: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((sold / total) * 100);
};

// Get stock status label
export const getStockStatusLabel = (percentage: number): string => {
  if (percentage >= 90) return 'Almost Sold Out';
  if (percentage >= 75) return 'Selling Fast';
  if (percentage >= 50) return 'Selling Well';
  if (percentage >= 25) return 'Available';
  return 'Just Launched';
};

// Get stock status class
export const getStockStatusClass = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-blue-500';
  return 'bg-green-500';
};

// Get status badge from percentage
export const getStockStatusLabelFromPercentage = (percentage: number): string => {
  return getStockStatusLabel(percentage);
};

// Convert snake_case property data from the API to camelCase for the frontend
export const mapPropertyFromApi = (propertyData: any): any => {
  if (!propertyData) return null;
  
  return {
    id: propertyData.id,
    title: propertyData.title,
    description: propertyData.description,
    price: propertyData.price,
    rentalRate: propertyData.rental_rate,
    address: {
      street: propertyData.street,
      city: propertyData.city,
      state: propertyData.state,
      zip: propertyData.zip,
      country: propertyData.country,
    },
    type: propertyData.property_types?.name?.toLowerCase() || 'residential',
    bedrooms: propertyData.bedrooms,
    bathrooms: propertyData.bathrooms,
    area: propertyData.built_up_area,
    status: propertyData.property_statuses?.name || 'available',
    createdAt: propertyData.created_at,
    updatedAt: propertyData.updated_at,
    features: propertyData.features || [],
    images: propertyData.property_images?.map((img: any) => img.storage_path) || [],
    reference: propertyData.reference || `P-${propertyData.id.substring(0, 8)}`
  };
};

export const getPropertyStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'bg-green-500';
    case 'under offer':
      return 'bg-amber-500';
    case 'pending':
      return 'bg-blue-500';
    case 'sold':
      return 'bg-red-500';
    case 'rented':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export const getPropertyTypeBadge = (type: string): { icon: string; color: string } => {
  switch (type.toLowerCase()) {
    case 'house':
    case 'residential':
      return {
        icon: 'home',
        color: 'bg-blue-100 text-blue-800',
      };
    case 'apartment':
    case 'condo':
      return {
        icon: 'building',
        color: 'bg-green-100 text-green-800',
      };
    case 'commercial':
    case 'office':
      return {
        icon: 'briefcase',
        color: 'bg-purple-100 text-purple-800',
      };
    case 'industrial':
    case 'warehouse':
      return {
        icon: 'package',
        color: 'bg-orange-100 text-orange-800',
      };
    case 'land':
      return {
        icon: 'map',
        color: 'bg-amber-100 text-amber-800',
      };
    default:
      return {
        icon: 'home',
        color: 'bg-gray-100 text-gray-800',
      };
  }
};

// Map property data for admin views
export const mapPropertyData = (data: any) => {
  if (!data) return null;
  
  return {
    id: data.id,
    title: data.title,
    price: data.price,
    status: data.status,
    propertyType: data.property_type || 'residential',
    location: `${data.city || ''}, ${data.state || ''}`,
    agentId: data.agent_id,
    agent: {
      id: data.agent?.id,
      name: data.agent?.name,
      email: data.agent?.email,
      firstName: data.agent?.first_name,
      lastName: data.agent?.last_name,
    },
    createdAt: data.created_at
  };
};
