
import { useQuery } from '@tanstack/react-query';

// Simple stub for useProperty hook
export const useProperty = (id?: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      // In a real application, this would fetch from an API
      // For now, just return some mock data
      return {
        id: id || '1',
        address: '123 Main St',
        city: 'ExampleCity',
        state: 'ExampleState',
        zip: '12345',
        status: 'active',
        type: 'residential',
        price: 500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    enabled: !!id
  });
};

export default useProperty;
