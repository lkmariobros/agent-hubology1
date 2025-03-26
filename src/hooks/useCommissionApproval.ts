
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch the system configuration for commission approval threshold
export const useSystemConfiguration = (key: string) => {
  return useQuery({
    queryKey: ['systemConfig', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('value')
        .eq('key', key)
        .single();
        
      if (error) {
        console.error(`Error fetching system configuration for ${key}:`, error);
        return null;
      }
      
      return data?.value;
    }
  });
};

// Function to check if a commission requires approval
export const useCommissionApprovalCheck = (commissionAmount: number) => {
  const { data: thresholdValue, isLoading } = useSystemConfiguration('commission_approval_threshold');
  
  // Default threshold if not set in the database
  const threshold = thresholdValue ? parseFloat(thresholdValue) : 10000;
  const exceedsThreshold = commissionAmount > threshold;
  
  return {
    threshold,
    exceedsThreshold,
    isLoading
  };
};
