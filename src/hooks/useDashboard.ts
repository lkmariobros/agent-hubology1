
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DashboardMetric } from '@/types';

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
