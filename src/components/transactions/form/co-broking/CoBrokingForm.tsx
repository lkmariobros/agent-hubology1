
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CoBrokingInfo } from '@/types/transaction-form';

interface CoBrokingFormProps {
  coBroking: CoBrokingInfo;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string | number | boolean) => void;
}

const CoBrokingForm: React.FC<CoBrokingFormProps> = ({ 
  coBroking, 
  errors, 
  onFieldChange 
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label htmlFor="agentName">Co-Broker Agent Name</Label>
        <Input
          id="agentName"
          value={coBroking.agentName || ''}
          onChange={(e) => onFieldChange('agentName', e.target.value)}
          placeholder="Enter co-broker agent name"
          className={errors.coAgentName ? 'border-destructive' : ''}
        />
        {errors.coAgentName && (
          <p className="text-sm text-destructive mt-1">{errors.coAgentName}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="agentCompany">Co-Broker Company</Label>
        <Input
          id="agentCompany"
          value={coBroking.agentCompany || ''}
          onChange={(e) => onFieldChange('agentCompany', e.target.value)}
          placeholder="Enter co-broker company name"
          className={errors.coAgentCompany ? 'border-destructive' : ''}
        />
        {errors.coAgentCompany && (
          <p className="text-sm text-destructive mt-1">{errors.coAgentCompany}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="agentContact">Co-Broker Contact</Label>
        <Input
          id="agentContact"
          value={coBroking.agentContact || ''}
          onChange={(e) => onFieldChange('agentContact', e.target.value)}
          placeholder="Enter co-broker contact information"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="commissionSplit">Commission Split</Label>
          <span className="text-sm font-medium">
            {coBroking.commissionSplit}% / {100 - coBroking.commissionSplit}%
          </span>
        </div>
        <Slider
          id="commissionSplit"
          value={[coBroking.commissionSplit]}
          min={0}
          max={100}
          step={5}
          onValueChange={(value) => onFieldChange('commissionSplit', value[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Our Agency: {coBroking.commissionSplit}%</span>
          <span>Co-Broker: {100 - coBroking.commissionSplit}%</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="credentialsVerified"
          checked={coBroking.credentialsVerified || false}
          onCheckedChange={(checked) => onFieldChange('credentialsVerified', checked)}
        />
        <Label htmlFor="credentialsVerified">
          I have verified the co-broker's credentials
        </Label>
      </div>
    </div>
  );
};

export default CoBrokingForm;
