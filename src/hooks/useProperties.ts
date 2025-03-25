
import { useState } from 'react';
import { Property } from '@/types';

export interface PropertyFilters {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  location?: string;
  features?: string[];
  searchQuery?: string;
  title?: string;
  bedrooms?: number;
  propertyType?: string;
  bathrooms?: number;
}

export const useProperties = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Property[]>([]);
  
  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const fetchProperties = async (): Promise<Property[]> => {
    setLoading(true);
    try {
      // In a real implementation, this would make an API call
      // with the filters applied
      console.log('Fetching properties with filters:', filters);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      const mockData: Property[] = [];
      setData(mockData);
      return mockData;
    } catch (err) {
      setError('Failed to fetch properties');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    fetchProperties,
    loading,
    error,
    data,
    isLoading: loading
  };
};

// Add property detail hook
export const useProperty = (id?: string) => {
  const [data, setData] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    if (!id) return null;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock property data
      const mockProperty: Property = {
        id,
        title: "Sample Property",
        description: "This is a sample property",
        price: 500000,
        type: "residential",
        images: ["/placeholder.jpg"],
        bedrooms: 3,
        bathrooms: 2,
        size: 1500
      };
      
      setData(mockProperty);
      return mockProperty;
    } catch (err) {
      setError('Failed to fetch property');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { data, isLoading, error, fetchProperty };
};

// Add delete property hook
export const useDeleteProperty = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const mutateAsync = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      throw new Error('Failed to delete property');
    } finally {
      setIsLoading(false);
    }
  };
  
  return { mutateAsync, isLoading };
};
