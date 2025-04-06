
import { supabase } from '@/lib/supabase';
import { Property } from '@/types';

export const propertyService = {
  getProperties: async () => {
    try {
      // In a real app, this would fetch from Supabase
      // For now, return mock data
      return [
        {
          id: '1',
          title: 'Luxury Condo',
          description: 'A beautiful luxury condo in the heart of the city',
          price: 2500000,
          type: 'residential',
          subtype: 'condo',
          bedrooms: 3,
          bathrooms: 2,
          builtUpArea: 1500,
          status: 'available',
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA'
          },
          listedBy: 'agency',
          features: ['Swimming Pool', 'Gym', 'Security'],
          images: ['/images/property1.jpg'],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-15'
        },
        {
          id: '2',
          title: 'Suburban Home',
          description: 'A cozy family home in a quiet suburb',
          price: 750000,
          type: 'residential',
          subtype: 'single-family',
          bedrooms: 4,
          bathrooms: 3,
          builtUpArea: 2200,
          status: 'available',
          address: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001',
            country: 'USA'
          },
          listedBy: 'agency',
          features: ['Backyard', 'Garage', 'Fireplace'],
          images: ['/images/property2.jpg'],
          createdAt: '2023-02-01',
          updatedAt: '2023-02-15'
        }
      ];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  getPropertyById: async (id: string) => {
    try {
      // Mock implementation
      return {
        id,
        title: 'Luxury Condo',
        description: 'A beautiful luxury condo in the heart of the city',
        price: 2500000,
        type: 'residential',
        subtype: 'condo',
        bedrooms: 3,
        bathrooms: 2,
        builtUpArea: 1500,
        status: 'available',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        },
        listedBy: 'agency',
        features: ['Swimming Pool', 'Gym', 'Security'],
        images: ['/images/property1.jpg'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-15'
      };
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  }
};
