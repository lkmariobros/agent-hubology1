
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DashboardMetric, Opportunity } from '@/types';

// Mock data for development
const mockMetrics: DashboardMetric[] = [
  {
    id: '1',
    label: 'Total Sales',
    value: '$4,200,000',
    change: 12.5,
    trend: 'up'
  },
  {
    id: '2',
    label: 'Commission Earned',
    value: '$87,500',
    change: 8.2,
    trend: 'up'
  },
  {
    id: '3',
    label: 'Active Listings',
    value: '32',
    change: -3.1,
    trend: 'down'
  },
  {
    id: '4',
    label: 'Closed Deals',
    value: '18',
    change: 5.5,
    trend: 'up'
  }
];

// Mock opportunities data
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Luxury Condo Buyer',
    description: 'Looking for a 3-bedroom luxury condo in downtown, budget around $1.5M with modern finishes and amenities.',
    budget: '$1.5M - $2M',
    location: 'Downtown',
    status: 'Urgent',
    propertyType: 'Residential',
    postedBy: 'Jane Smith',
    postedDate: '2025-03-15T09:30:00Z'
  },
  {
    id: '2',
    title: 'Commercial Space for Tech Startup',
    description: 'Tech startup looking for 5,000 sq ft office space with open floor plan and good connectivity.',
    budget: '$25-30 per sq ft',
    location: 'Business District',
    status: 'New',
    propertyType: 'Commercial',
    postedBy: 'Michael Johnson',
    postedDate: '2025-03-30T14:15:00Z'
  },
  {
    id: '3',
    title: 'Family Home in Suburbs',
    description: 'Family of 4 relocating to the area, looking for a 4-bedroom home in a good school district.',
    budget: '$800K - $950K',
    location: 'Northern Suburbs',
    status: 'Featured',
    propertyType: 'Residential',
    postedBy: 'Robert Lee',
    postedDate: '2025-03-28T11:45:00Z'
  }
];

export function useMetrics() {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      // In a real app, we would fetch from Supabase
      // For now, return mock data
      return {
        data: {
          metrics: mockMetrics
        }
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: ['recentTransactions'],
    queryFn: async () => {
      // Mock data
      return {
        data: {
          transactions: []
        }
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useRecentProperties() {
  return useQuery({
    queryKey: ['recentProperties'],
    queryFn: async () => {
      // Mock data
      return {
        data: {
          properties: []
        }
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      // In a real app, we would fetch from Supabase
      // For now, return mock data
      return {
        data: mockOpportunities
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}
