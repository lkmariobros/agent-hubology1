
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AgentRank } from '@/types/transaction-form';

interface AgentTierSelectorProps {
  value: AgentRank | string;
  onChange: (value: string) => void;
}

const AgentTierSelector: React.FC<AgentTierSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="agentTier">Agent Tier</Label>
      <Select value={value as string} onValueChange={onChange}>
        <SelectTrigger id="agentTier">
          <SelectValue placeholder="Select agent tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Associate">Associate (70%)</SelectItem>
          <SelectItem value="Senior Associate">Senior Associate (75%)</SelectItem>
          <SelectItem value="Advisor">Advisor (70%)</SelectItem>
          <SelectItem value="Sales Leader">Sales Leader (80%)</SelectItem>
          <SelectItem value="Team Leader">Team Leader (83%)</SelectItem>
          <SelectItem value="Group Leader">Group Leader (85%)</SelectItem>
          <SelectItem value="Director">Director (87%)</SelectItem>
          <SelectItem value="Supreme Leader">Supreme Leader (85%)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgentTierSelector;
