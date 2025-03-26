
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AgentRank, RankRequirement } from '@/types';
import { toast } from 'sonner';

interface RankConfig {
  transactions: number;
  salesVolume: number;
  personalSales: boolean;
  recruitedAgents?: number;
  overridePercentage: number;
}

export const useCommissionConfig = () => {
  const queryClient = useQueryClient();

  // Fetch rank requirements from the database
  const getRankRequirements = async (): Promise<Record<AgentRank, RankRequirement>> => {
    const { data, error } = await supabase
      .from('system_configuration')
      .select('*')
      .eq('key', 'rank_requirements')
      .single();

    if (error) {
      console.error('Error fetching rank requirements:', error);
      throw error;
    }

    return data?.value ? JSON.parse(data.value) : {};
  };

  // Fetch override percentages from the database
  const getOverridePercentages = async (): Promise<Record<AgentRank, number>> => {
    const { data, error } = await supabase
      .from('system_configuration')
      .select('*')
      .eq('key', 'override_percentages')
      .single();

    if (error) {
      console.error('Error fetching override percentages:', error);
      throw error;
    }

    return data?.value ? JSON.parse(data.value) : {};
  };

  // Update rank requirements and override percentages
  const updateRankConfig = async ({
    rank,
    config
  }: {
    rank: AgentRank;
    config: RankConfig;
  }) => {
    try {
      // Get current rank requirements
      const currentRequirements = await getRankRequirements();
      
      // Update with new values
      const updatedRequirements = {
        ...currentRequirements,
        [rank]: {
          rank,
          transactions: config.transactions,
          salesVolume: config.salesVolume,
          personalSales: config.personalSales,
          recruitedAgents: config.recruitedAgents,
          color: currentRequirements[rank]?.color || 'blue' // Preserve existing color
        }
      };

      // Get current override percentages
      const currentOverrides = await getOverridePercentages();
      
      // Update with new values
      const updatedOverrides = {
        ...currentOverrides,
        [rank]: config.overridePercentage
      };

      // Update rank requirements
      const { error: reqError } = await supabase
        .from('system_configuration')
        .upsert({
          key: 'rank_requirements',
          value: JSON.stringify(updatedRequirements),
          updated_at: new Date().toISOString()
        });

      if (reqError) throw reqError;

      // Update override percentages
      const { error: overrideError } = await supabase
        .from('system_configuration')
        .upsert({
          key: 'override_percentages',
          value: JSON.stringify(updatedOverrides),
          updated_at: new Date().toISOString()
        });

      if (overrideError) throw overrideError;

      return { rank, config };
    } catch (error) {
      console.error('Error updating rank configuration:', error);
      throw error;
    }
  };

  // React Query hooks
  const useRankRequirementsQuery = () => {
    return useQuery({
      queryKey: ['rankRequirements'],
      queryFn: getRankRequirements
    });
  };

  const useOverridePercentagesQuery = () => {
    return useQuery({
      queryKey: ['overridePercentages'],
      queryFn: getOverridePercentages
    });
  };

  const useUpdateRankConfigMutation = () => {
    return useMutation({
      mutationFn: updateRankConfig,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rankRequirements'] });
        queryClient.invalidateQueries({ queryKey: ['overridePercentages'] });
        toast.success('Rank configuration updated successfully');
      },
      onError: (error) => {
        console.error('Error updating rank configuration:', error);
        toast.error('Failed to update rank configuration');
      }
    });
  };

  return {
    useRankRequirementsQuery,
    useOverridePercentagesQuery,
    useUpdateRankConfigMutation
  };
};
