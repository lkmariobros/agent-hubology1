
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { DashboardMetric, Property, Transaction, Opportunity } from '@/types';

export function useMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardApi.getMetrics,
    // For now, provide fallback data while the API is being developed
    placeholderData: {
      data: {
        metrics: [
          {
            label: 'Total Listings',
            value: '142',
            change: 12.5,
            trend: 'up',
            icon: 'building'
          },
          {
            label: 'Active Agents',
            value: '38',
            change: 4.2,
            trend: 'up',
            icon: 'users'
          },
          {
            label: 'Monthly Revenue',
            value: '$92,428',
            change: -2.8,
            trend: 'down',
            icon: 'dollar'
          },
          {
            label: 'Conversion Rate',
            value: '24.3%',
            change: 6.1,
            trend: 'up',
            icon: 'chart'
          }
        ]
      }
    }
  });
}

export function useRecentProperties(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recentProperties', limit],
    queryFn: () => dashboardApi.getRecentProperties(limit),
    // For now, provide fallback data while the API is being developed
    placeholderData: {
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
      ]
    }
  });
}

export function useRecentTransactions(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recentTransactions', limit],
    queryFn: () => dashboardApi.getRecentTransactions(limit),
    // For now, provide fallback data while the API is being developed
    placeholderData: {
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
      ]
    }
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ['dashboard', 'opportunities'],
    queryFn: dashboardApi.getOpportunities
  });
}
