
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { DashboardMetric, Property, Transaction, Opportunity, ApiResponse } from '@/types';
import { Building2, Users, DollarSign, LineChart } from 'lucide-react';

// Using these constants as fallbacks and default values
const DEFAULT_METRICS = {
  data: {
    metrics: [
      {
        id: "1",
        label: 'Total Listings',
        value: '142',
        change: 12.5,
        trend: 'up',
        icon: 'building'
      },
      {
        id: "2",
        label: 'Active Agents',
        value: '38',
        change: 4.2,
        trend: 'up',
        icon: 'users'
      },
      {
        id: "3",
        label: 'Monthly Revenue',
        value: '$92,428',
        change: -2.8,
        trend: 'down',
        icon: 'dollar'
      },
      {
        id: "4",
        label: 'Conversion Rate',
        value: '24.3%',
        change: 6.1,
        trend: 'up',
        icon: 'chart'
      }
    ]
  },
  message: 'Metrics retrieved successfully',
  success: true
} as ApiResponse<any>;

const DEFAULT_PROPERTIES = {
  data: [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      description: 'Luxurious apartment in downtown with excellent amenities.',
      price: 425000,
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        country: 'USA'
      },
      type: 'residential',
      subtype: 'apartment',
      features: ['balcony', 'parking', 'pool'],
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      images: ['https://picsum.photos/id/1068/800/600'],
      status: 'available',
      listedBy: 'agent123',
      createdAt: '2024-01-15T12:00:00Z',
      updatedAt: '2024-01-15T12:00:00Z'
    },
    {
      id: '2',
      title: 'Suburban Family Home',
      description: 'Spacious family home with large backyard in quiet neighborhood.',
      price: 750000,
      address: {
        street: '456 Oak Ave',
        city: 'Palo Alto',
        state: 'CA',
        zip: '94301',
        country: 'USA'
      },
      type: 'residential',
      subtype: 'house',
      features: ['backyard', 'garage', 'renovated kitchen'],
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      images: ['https://picsum.photos/id/164/800/600'],
      status: 'pending',
      listedBy: 'agent456',
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-02-05T14:15:00Z'
    },
    {
      id: '3',
      title: 'Commercial Office Space',
      description: 'Prime location commercial office in the business district.',
      price: 1200000,
      address: {
        street: '789 Market St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        country: 'USA'
      },
      type: 'commercial',
      subtype: 'office',
      features: ['reception', 'conference rooms', 'parking'],
      area: 3500,
      images: ['https://picsum.photos/id/260/800/600'],
      status: 'available',
      listedBy: 'agent789',
      createdAt: '2024-01-20T11:45:00Z',
      updatedAt: '2024-01-20T11:45:00Z'
    }
  ],
  message: 'Recent properties retrieved successfully',
  success: true
} as ApiResponse<any[]>;

const DEFAULT_TRANSACTIONS = {
  data: [
    {
      id: '1',
      propertyId: '2',
      agentId: 'agent456',
      buyerId: 'buyer123',
      sellerId: 'seller123',
      commission: 22500,
      status: 'completed',
      date: '2024-02-15T10:30:00Z'
    },
    {
      id: '2',
      propertyId: '4',
      agentId: 'agent789',
      commission: 15000,
      status: 'pending',
      date: '2024-03-01T15:45:00Z'
    },
    {
      id: '3',
      propertyId: '5',
      agentId: 'agent123',
      buyerId: 'buyer456',
      sellerId: 'seller456',
      commission: 30000,
      status: 'completed',
      date: '2024-02-28T09:15:00Z'
    }
  ],
  message: 'Recent transactions retrieved successfully',
  success: true
} as ApiResponse<any[]>;

const DEFAULT_OPPORTUNITIES = {
  data: [
    {
      id: '1',
      title: 'Family looking for 3BR apartment',
      description: 'Family of 4 needs 3-bedroom apartment in central area with good schools nearby.',
      propertyType: 'Residential',
      budget: 'RM450,000 - RM550,000',
      location: 'Kuala Lumpur (KLCC, Bangsar)',
      status: 'Urgent',
      postedBy: 'Sarah Johnson',
      postedDate: '2024-06-01T09:30:00Z'  // Changed from postedAt to postedDate
    },
    {
      id: '2',
      title: 'Retail space for boutique',
      description: 'Fashion designer looking for 800-1000 sq ft retail space in a high foot traffic area.',
      propertyType: 'Commercial',
      budget: 'RM8,000 - RM12,000/mo',
      location: 'Bukit Bintang, Pavilion area',
      status: 'New',
      postedBy: 'Michael Brown',
      postedDate: '2024-06-05T14:15:00Z'  // Changed from postedAt to postedDate
    },
    {
      id: '3',
      title: 'Land for agricultural project',
      description: 'Investor seeking 2-5 acres of agricultural land for sustainable farming project.',
      propertyType: 'Land',
      budget: 'RM1.2M - RM2.5M',
      location: 'Selangor (Rawang, Semenyih)',
      status: 'Featured',
      postedBy: 'John Smith',
      postedDate: '2024-06-03T11:45:00Z'  // Changed from postedAt to postedDate
    }
  ],
  message: 'Opportunities retrieved successfully',
  success: true
} as ApiResponse<Opportunity[]>;

export function useMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardApi.getMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to prevent excessive API calls
    refetchOnWindowFocus: false,
    // Improved error handling using placeholder data
    placeholderData: DEFAULT_METRICS,
  });
}

export function useRecentProperties(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recentProperties', limit],
    queryFn: () => dashboardApi.getRecentProperties(limit),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    // Improved error handling using placeholder data
    placeholderData: DEFAULT_PROPERTIES,
  });
}

export function useRecentTransactions(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recentTransactions', limit],
    queryFn: () => dashboardApi.getRecentTransactions(limit),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    // Improved error handling using placeholder data
    placeholderData: DEFAULT_TRANSACTIONS,
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ['dashboard', 'opportunities'],
    queryFn: dashboardApi.getOpportunities,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    // Improved error handling using placeholder data
    placeholderData: DEFAULT_OPPORTUNITIES,
  });
}
