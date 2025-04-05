// Define property types and their related features

// Property type interface
export interface PropertyType {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

// Property feature interface
export interface PropertyFeature {
  id: string;
  label: string;
  description?: string;
  propertyTypes?: string[]; // Which property types this feature applies to
}

// Define list of property types
export const propertyTypes: PropertyType[] = [
  {
    id: 'Residential',
    label: 'Residential',
    description: 'Homes and living spaces for individuals and families',
    icon: 'Home'
  },
  {
    id: 'Commercial',
    label: 'Commercial',
    description: 'Properties for business use such as offices, shops, and restaurants',
    icon: 'Store'
  },
  {
    id: 'Industrial',
    label: 'Industrial',
    description: 'Factories, warehouses, and manufacturing facilities',
    icon: 'Factory'
  },
  {
    id: 'Land',
    label: 'Land',
    description: 'Undeveloped land plots for various purposes',
    icon: 'Map'
  }
];

// Property subtypes
export const propertySubtypes = {
  Residential: [
    { id: 'apartment', label: 'Apartment' },
    { id: 'condominium', label: 'Condominium' },
    { id: 'terrace', label: 'Terrace House' },
    { id: 'semi-detached', label: 'Semi-Detached House' },
    { id: 'bungalow', label: 'Bungalow' },
    { id: 'townhouse', label: 'Townhouse' },
  ],
  Commercial: [
    { id: 'office', label: 'Office Space' },
    { id: 'retail', label: 'Retail Space' },
    { id: 'shop', label: 'Shop Lot' },
    { id: 'restaurant', label: 'Restaurant Space' },
    { id: 'hotel', label: 'Hotel' },
  ],
  Industrial: [
    { id: 'factory', label: 'Factory' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'data-center', label: 'Data Center' },
  ],
  Land: [
    { id: 'residential-land', label: 'Residential Land' },
    { id: 'commercial-land', label: 'Commercial Land' },
    { id: 'industrial-land', label: 'Industrial Land' },
    { id: 'agricultural', label: 'Agricultural Land' },
  ]
};

// Define features for each property type
const residentialFeatures: PropertyFeature[] = [
  { id: 'central_ac', label: 'Central Air Conditioning' },
  { id: 'hardwood_floors', label: 'Hardwood Floors' },
  { id: 'balcony', label: 'Balcony/Patio' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'gym', label: 'Fitness Center' },
  { id: 'security', label: 'Security System' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
  { id: 'storage', label: 'Storage Space' },
  { id: 'parking', label: 'Parking' },
];

const commercialFeatures: PropertyFeature[] = [
  { id: 'elevator', label: 'Elevator' },
  { id: 'loading_dock', label: 'Loading Dock' },
  { id: 'security_system', label: 'Security System' },
  { id: 'reception', label: 'Reception Area' },
  { id: 'kitchen', label: 'Kitchen/Pantry' },
  { id: 'conference', label: 'Conference Rooms' },
  { id: 'parking', label: 'Parking' },
];

const industrialFeatures: PropertyFeature[] = [
  { id: 'loading_bays', label: 'Loading Bays' },
  { id: 'dock_high', label: 'Dock-High Doors' },
  { id: 'crane', label: 'Overhead Crane' },
  { id: 'heavy_power', label: 'Heavy Power Supply' },
  { id: 'security', label: 'Security System' },
  { id: 'climate_control', label: 'Climate Control' },
];

const landFeatures: PropertyFeature[] = [
  { id: 'road_access', label: 'Road Access' },
  { id: 'water_supply', label: 'Water Supply' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'sewage', label: 'Sewage Connection' },
  { id: 'cleared', label: 'Cleared Land' },
  { id: 'fenced', label: 'Fenced' },
];

// Function to get features based on property type
export const getFeaturesByType = (propertyType: string): PropertyFeature[] => {
  switch (propertyType) {
    case 'Residential':
      return residentialFeatures;
    case 'Commercial':
      return commercialFeatures;
    case 'Industrial':
      return industrialFeatures;
    case 'Land':
      return landFeatures;
    default:
      return [];
  }
};
