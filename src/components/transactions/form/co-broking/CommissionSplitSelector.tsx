
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

interface CommissionSplitSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const CommissionSplitSelector: React.FC<CommissionSplitSelectorProps> = ({ 
  value, 
  onChange 
}) => {
  const handleTabChange = (newValue: string) => {
    const splitValue = parseInt(newValue);
    if (!isNaN(splitValue)) {
      onChange(splitValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="commissionSplit">
        Commission Split (%)
      </Label>
      <Tabs 
        defaultValue="50" 
        value={value.toString()}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="10">10%</TabsTrigger>
          <TabsTrigger value="25">25%</TabsTrigger>
          <TabsTrigger value="50">50%</TabsTrigger>
          <TabsTrigger value="75">75%</TabsTrigger>
          <TabsTrigger value="90">90%</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <Input
            id="commissionSplit"
            type="number"
            min="1"
            max="99"
            value={value}
            onChange={handleInputChange}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-1">
            The co-broker will receive {value}% of the agent's commission.
          </p>
        </div>
      </Tabs>
    </div>
  );
};

export default CommissionSplitSelector;
