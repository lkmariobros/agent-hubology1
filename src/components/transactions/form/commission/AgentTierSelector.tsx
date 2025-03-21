
import React, { useState, useEffect } from 'react';
import { AgentRank } from '@/types/transaction-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award } from 'lucide-react';

// Agent tier definitions - Would be fetched from API in production
export const AGENT_TIERS = [{
  id: 1,
  name: 'Advisor',
  rank: 'Advisor' as AgentRank,
  agentPercentage: 70
}, {
  id: 2,
  name: 'Sales Leader',
  rank: 'Sales Leader' as AgentRank,
  agentPercentage: 80
}, {
  id: 3,
  name: 'Team Leader',
  rank: 'Team Leader' as AgentRank,
  agentPercentage: 83
}, {
  id: 4,
  name: 'Group Leader',
  rank: 'Group Leader' as AgentRank,
  agentPercentage: 85
}, {
  id: 5,
  name: 'Supreme Leader',
  rank: 'Supreme Leader' as AgentRank,
  agentPercentage: 85
}];

// Mock function to get current agent's tier - would be replaced with actual API call
export const getCurrentAgentTier = () => {
  // In production, this would fetch the current user's tier from an API
  return AGENT_TIERS[2]; // Default to Team Leader tier for demonstration
};

interface AgentTierSelectorProps {
  value: AgentRank | undefined;
  onChange: (tier: AgentRank) => void;
}

const AgentTierSelector: React.FC<AgentTierSelectorProps> = ({ value, onChange }) => {
  const [agentTier, setAgentTier] = useState(getCurrentAgentTier());

  // Initialize agent tier in form data if not set
  useEffect(() => {
    if (!value) {
      onChange(agentTier.rank);
    }
  }, [value, agentTier.rank, onChange]);

  const handleTierChange = (tierValue: string) => {
    const selectedTier = AGENT_TIERS.find(tier => tier.rank === tierValue);
    if (selectedTier) {
      setAgentTier(selectedTier);
      onChange(selectedTier.rank as AgentRank);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-1">
        <Award className="h-4 w-4" />
        Agent Tier
      </label>
      <Select 
        value={value} 
        onValueChange={handleTierChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select agent tier" />
        </SelectTrigger>
        <SelectContent>
          {AGENT_TIERS.map(tier => (
            <SelectItem key={tier.id} value={tier.rank}>
              {tier.name} ({tier.agentPercentage}%)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        The agent tier determines the commission percentage split between agent and agency.
      </p>
    </div>
  );
};

export default AgentTierSelector;
