
import { z } from 'zod';

// Property subtypes by property type
export const propertySubtypes = {
  residential: [
    'Apartment',
    'Condominium',
    'Terrace House',
    'Semi-Detached',
    'Bungalow',
    'Townhouse',
    'Studio',
    'Serviced Residence',
    'SOHO',
    'Duplex',
    'Penthouse'
  ],
  commercial: [
    'Office',
    'Retail',
    'Shop',
    'Shop-Office',
    'Restaurant',
    'Hotel/Resort',
    'Shopping Mall',
    'Mixed Use',
    'Commercial Land'
  ],
  industrial: [
    'Factory',
    'Warehouse',
    'Workshop',
    'Distribution Center',
    'Manufacturing',
    'Showroom',
    'Industrial Land',
    'Data Center'
  ],
  land: [
    'Residential Land',
    'Commercial Land',
    'Industrial Land',
    'Agricultural Land',
    'Development Site',
    'Orchard',
    'Plantation',
    'Greenbelt'
  ]
};

// Common features by property type
export const getFeaturesByType = (type: string) => {
  const commonFeatures = [
    { id: 'parking', label: 'Parking' },
    { id: 'security', label: 'Security System' },
    { id: 'highSpeedInternet', label: 'High-Speed Internet' },
    { id: 'maintenanceStaff', label: 'Maintenance Staff' },
    { id: 'cctv', label: 'CCTV' },
    { id: 'accessControl', label: 'Access Control' },
    { id: 'backup_power', label: 'Backup Power Supply' }
  ];

  const typeSpecificFeatures = {
    residential: [
      { id: 'airConditioning', label: 'Air Conditioning' },
      { id: 'furnishing', label: 'Furnished' },
      { id: 'balcony', label: 'Balcony' },
      { id: 'pool', label: 'Swimming Pool' },
      { id: 'gym', label: 'Gym' },
      { id: 'petFriendly', label: 'Pet Friendly' },
      { id: 'playground', label: 'Playground' },
      { id: 'tennis', label: 'Tennis Court' },
      { id: 'bbq', label: 'BBQ Area' },
      { id: 'sauna', label: 'Sauna' },
      { id: 'jacuzzi', label: 'Jacuzzi' },
      { id: 'roofGarden', label: 'Roof Garden' },
      { id: 'concierge', label: 'Concierge Service' },
      { id: 'laundrySvc', label: 'Laundry Service' },
      { id: 'rainwaterHarvesting', label: 'Rainwater Harvesting' },
      { id: 'solarPanel', label: 'Solar Panels' }
    ],
    commercial: [
      { id: 'elevators', label: 'Elevators' },
      { id: 'conferenceRooms', label: 'Conference Rooms' },
      { id: 'reception', label: 'Reception Area' },
      { id: '24HourAccess', label: '24-Hour Access' },
      { id: 'kitchenette', label: 'Kitchenette' },
      { id: 'sharedAmenities', label: 'Shared Amenities' },
      { id: 'centralAircon', label: 'Central Air Conditioning' },
      { id: 'raisedFloor', label: 'Raised Floor' },
      { id: 'ceilingGrid', label: 'Ceiling Grid' },
      { id: 'mspEntrance', label: 'MSP Entrance' },
      { id: 'roofAccess', label: 'Roof Access' },
      { id: 'loadingBay', label: 'Loading Bay' },
      { id: 'pantry', label: 'Pantry' }
    ],
    industrial: [
      { id: 'loadingDocks', label: 'Loading Docks' },
      { id: 'highCeilings', label: 'High Ceilings' },
      { id: 'heavyPower', label: 'Heavy Power Supply' },
      { id: 'craneSystem', label: 'Crane System' },
      { id: 'refrigeration', label: 'Refrigeration' },
      { id: 'triphasePower', label: 'Triphase Power' },
      { id: 'loadingArea', label: 'Loading Area' },
      { id: 'truckParking', label: 'Truck Parking' },
      { id: 'rollingDoors', label: 'Rolling Doors' },
      { id: 'forkLiftAccess', label: 'Forklift Access' },
      { id: 'weighbridge', label: 'Weighbridge' },
      { id: 'sprinklerSystem', label: 'Sprinkler System' }
    ],
    land: [
      { id: 'roadAccess', label: 'Road Access' },
      { id: 'utilities', label: 'Utilities Available' },
      { id: 'fenced', label: 'Fenced' },
      { id: 'cleared', label: 'Cleared' },
      { id: 'waterSupply', label: 'Water Supply' },
      { id: 'electricitySupply', label: 'Electricity Supply' },
      { id: 'naturalGas', label: 'Natural Gas' },
      { id: 'sewage', label: 'Sewage System' },
      { id: 'telephoneLines', label: 'Telephone Lines' },
      { id: 'floodFree', label: 'Flood Free' },
      { id: 'cornerLot', label: 'Corner Lot' },
      { id: 'rectangularShape', label: 'Rectangular Shape' }
    ]
  };

  if (type in typeSpecificFeatures) {
    return [...commonFeatures, ...typeSpecificFeatures[type as keyof typeof typeSpecificFeatures]];
  }
  
  return commonFeatures;
};

// Malaysian states for address validation
export const malaysianStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu'
];

// Property tenure types
export const tenureTypes = [
  'Freehold',
  'Leasehold',
  'Bumi Lot',
  'Malay Reserve'
];

// Create a Zod enum for Malaysian states
export const stateEnum = z.enum(malaysianStates as [string, ...string[]]);

// Create a Zod enum for tenure types
export const tenureEnum = z.enum(tenureTypes as [string, ...string[]]);

// Zod schema for coordinates
export const coordinatesSchema = z.tuple([
  z.number().min(-90).max(90), // latitude
  z.number().min(-180).max(180) // longitude
]);
