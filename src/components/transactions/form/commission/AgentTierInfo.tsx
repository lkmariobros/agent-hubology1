
import React from 'react';
import { Award } from 'lucide-react';
import { AgentRank } from '@/types/transaction-form';

interface AgentTierInfoProps {
  agentTier: {
    name: string;
    rank: AgentRank;
    agentPercentage: number;
  };
}

const AgentTierInfo: React.FC<AgentTierInfoProps> = ({ agentTier }) => {
  const agentPortionPercentage = agentTier.agentPercentage;
  const agencyPortionPercentage = 100 - agentPortionPercentage;
  
  return (
    <div className="bg-muted/50 p-4 rounded-md">
      <h3 className="text-sm font-semibold flex items-center gap-1 mb-2">
        <Award className="h-4 w-4" />
        {agentTier.name} Commission Split
      </h3>
      <p className="text-xs text-muted-foreground mb-2">
        Your current commission split rate is {agentPortionPercentage}/{agencyPortionPercentage} based on your tier.
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm">You: {agentPortionPercentage}%</span>
        <span className="text-sm">Agency: {agencyPortionPercentage}%</span>
      </div>
    </div>
  );
};

export default AgentTierInfo;
