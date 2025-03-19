
import { useQuery } from '@tanstack/react-query';
import { commissionApi } from '@/lib/api';

// Get commission summary (current month, previous month, year to date)
export function useCommissionSummary() {
  return useQuery({
    queryKey: ['commission', 'summary'],
    queryFn: commissionApi.getSummary,
  });
}

// Get commission history with pagination
export function useCommissionHistory(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['commission', 'history', page, pageSize],
    queryFn: () => commissionApi.getHistory(page, pageSize),
    keepPreviousData: true,
  });
}

// Get commission tiers
export function useCommissionTiers() {
  return useQuery({
    queryKey: ['commission', 'tiers'],
    queryFn: commissionApi.getTiers,
  });
}

// Calculate expected commission based on property price and agent tier
export function calculateCommission(propertyPrice: number, commissionRate: number): number {
  return propertyPrice * (commissionRate / 100);
}
