
import React from 'react';
import { AgentRank } from '@/types/transaction-form';
import { useAgentProfile } from '@/hooks/useAgentProfile';
import { Award, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AGENT_TIER_PERCENTAGES } from '@/context/TransactionForm/agentTiers';

interface AgentTierSelectorProps {
  value: AgentRank | undefined;
  onChange: (tier: AgentRank) => void;
}

const AgentTierSelector: React.FC<AgentTierSelectorProps> = ({ value, onChange }) => {
  const { data: agentProfile, isLoading, error } = useAgentProfile();
  
  // Set the agent tier from profile when data is loaded
  React.useEffect(() => {
    if (agentProfile && (!value || value !== agentProfile.tier_name)) {
      onChange(agentProfile.tier_name);
    }
  }, [agentProfile, value, onChange]);
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1">
          <Award className="h-4 w-4" />
          Agent Tier
        </label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (error) {
    console.error('Error loading agent tier:', error);
  }
  
  // Find the tier details for the agent
  const tierName = agentProfile?.tier_name || 'Advisor';
  const tierPercentage = agentProfile?.commission_percentage || 
    AGENT_TIER_PERCENTAGES[tierName as AgentRank] || 70;
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-1">
        <Award className="h-4 w-4" />
        Agent Tier
      </label>
      
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{tierName}</span>
          <span>({tierPercentage}%)</span>
        </div>
        <Lock className="h-4 w-4 opacity-70" />
      </div>
      
      <p className="text-xs text-muted-foreground">
        Your agent tier is set by management and determines your commission percentage.
        <span className="block mt-1 italic">
          Contact your team leader if you believe this is incorrect.
        </span>
      </p>
    </div>
  );
};

export default AgentTierSelector;
