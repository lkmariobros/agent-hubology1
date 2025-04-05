
import { z } from 'zod';

// Property subtypes by property type
export const propertySubtypes = {
  residential: ['Apartment', 'House', 'Townhouse', 'Condo', 'Villa'],
  commercial: ['Office', 'Retail', 'Restaurant', 'Warehouse', 'Mixed Use'],
  industrial: ['Factory', 'Workshop', 'Storage', 'Distribution Center'],
  land: ['Residential Land', 'Commercial Land', 'Agricultural Land', 'Development Site']
};

// Common features by property type
export const getFeaturesByType = (type: string) => {
  const commonFeatures = [
    { id: 'parking', label: 'Parking' },
    { id: 'security', label: 'Security System' },
    { id: 'highSpeedInternet', label: 'High-Speed Internet' },
  ];

  const typeSpecificFeatures = {
    residential: [
      { id: 'airConditioning', label: 'Air Conditioning' },
      { id: 'furnishing', label: 'Furnished' },
      { id: 'balcony', label: 'Balcony' },
      { id: 'pool', label: 'Swimming Pool' },
      { id: 'gym', label: 'Gym' },
      { id: 'petFriendly', label: 'Pet Friendly' },
    ],
    commercial: [
      { id: 'elevators', label: 'Elevators' },
      { id: 'conferenceRooms', label: 'Conference Rooms' },
      { id: 'reception', label: 'Reception Area' },
      { id: '24HourAccess', label: '24-Hour Access' },
      { id: 'kitchenette', label: 'Kitchenette' },
    ],
    industrial: [
      { id: 'loadingDocks', label: 'Loading Docks' },
      { id: 'highCeilings', label: 'High Ceilings' },
      { id: 'heavyPower', label: 'Heavy Power Supply' },
      { id: 'craneSystem', label: 'Crane System' },
    ],
    land: [
      { id: 'roadAccess', label: 'Road Access' },
      { id: 'utilities', label: 'Utilities Available' },
      { id: 'fenced', label: 'Fenced' },
      { id: 'cleared', label: 'Cleared' },
    ]
  };

  if (type in typeSpecificFeatures) {
    return [...commonFeatures, ...typeSpecificFeatures[type as keyof typeof typeSpecificFeatures]];
  }
  
  return commonFeatures;
};
