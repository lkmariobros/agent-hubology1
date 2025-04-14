
import React, { useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { debounce } from 'lodash';

interface CommissionSplitSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const CommissionSplitSelector: React.FC<CommissionSplitSelectorProps> = ({ 
  value, 
  onChange 
}) => {
  // Memoize the tab values to prevent unnecessary recalculations
  const tabValues = useMemo(() => ["10", "25", "50", "75", "90"], []);
  
  // Use debounce for input changes to prevent rapid state updates
  const debouncedOnChange = useCallback(
    debounce((newValue: number) => {
      onChange(newValue);
    }, 300),
    [onChange]
  );
  
  // Callbacks for handling changes
  const handleTabChange = useCallback((newValue: string) => {
    const splitValue = parseInt(newValue);
    if (!isNaN(splitValue)) {
      onChange(splitValue); // Use direct onChange since tabs don't need debouncing
    }
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      debouncedOnChange(newValue);
    }
  }, [debouncedOnChange]);

  // Memoize the description text to prevent re-renders
  const descriptionText = useMemo(() => 
    `The co-broker will receive ${value}% of the agent's commission.`,
    [value]
  );

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
          {tabValues.map(tabValue => (
            <TabsTrigger key={tabValue} value={tabValue}>
              {tabValue}%
            </TabsTrigger>
          ))}
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
            {descriptionText}
          </p>
        </div>
      </Tabs>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(CommissionSplitSelector);
