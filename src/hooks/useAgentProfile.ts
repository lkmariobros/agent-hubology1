
import { useQuery } from '@tanstack/react-query';

// Mock agent profile data
const mockAgentProfile = {
  id: 'agent-1',
  tier: 2,
  tier_name: 'Advisor',
  commission_percentage: 70,
  total_sales: 2500000,
  join_date: new Date(2022, 0, 15).toISOString(),
  specializations: ['Residential', 'Commercial'],
  avatar_url: '/avatars/agent-1.jpg',
  full_name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  agency_id: 'agency-1',
  upline_id: null,
  total_transactions: 12
};

// Fetch the agent profile
export const useAgentProfile = () => {
  return useQuery({
    queryKey: ['agentProfile'],
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAgentProfile;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
